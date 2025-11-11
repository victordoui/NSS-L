import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface BackupData {
  version: string;
  timestamp: string;
  data: {
    articles: any[];
    contact_info: any[];
    contact_messages: any[];
    projects: any[];
    services: any[];
    site_settings: any[];
    social_links: any[];
  };
}

interface BackupHistoryItem {
  filename: string;
  timestamp: string;
  size: string;
  date: Date;
}

export const useBackup = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);

  // Exportar backup
  const exportBackup = async () => {
    setIsExporting(true);
    setImportProgress(0);
    
    try {
      toast.info("Iniciando exportação do backup...");
      
      // Buscar dados de todas as tabelas
      const [
        articlesRes,
        contactInfoRes,
        messagesRes,
        projectsRes,
        servicesRes,
        settingsRes,
        socialLinksRes,
      ] = await Promise.all([
        supabase.from("articles").select("*").order("created_at", { ascending: false }),
        supabase.from("contact_info").select("*").order("order_position", { ascending: true }),
        supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
        supabase.from("projects").select("*").order("order_position", { ascending: true }),
        supabase.from("services").select("*").order("order_position", { ascending: true }),
        supabase.from("site_settings").select("*").order("key", { ascending: true }),
        supabase.from("social_links").select("*").order("order_position", { ascending: true }),
      ]);

      // Verificar erros
      const errors = [
        articlesRes.error,
        contactInfoRes.error,
        messagesRes.error,
        projectsRes.error,
        servicesRes.error,
        settingsRes.error,
        socialLinksRes.error,
      ].filter(Boolean);

      if (errors.length > 0) {
        throw new Error(`Erro ao buscar dados: ${errors[0]?.message}`);
      }

      // Criar objeto de backup
      const backupData: BackupData = {
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        data: {
          articles: articlesRes.data || [],
          contact_info: contactInfoRes.data || [],
          contact_messages: messagesRes.data || [],
          projects: projectsRes.data || [],
          services: servicesRes.data || [],
          site_settings: settingsRes.data || [],
          social_links: socialLinksRes.data || [],
        },
      };

      // Converter para JSON
      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      
      // Criar nome do arquivo
      const filename = `backup-${format(new Date(), "yyyy-MM-dd-HHmmss")}.json`;
      
      // Download do arquivo
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Salvar no histórico local
      saveToHistory(filename, jsonString.length);

      toast.success("Backup exportado com sucesso!");
      return filename;
    } catch (error: any) {
      console.error("Erro ao exportar backup:", error);
      toast.error(`Erro ao exportar: ${error.message}`);
      throw error;
    } finally {
      setIsExporting(false);
    }
  };

  // Importar backup
  const importBackup = async (file: File, mode: "replace" | "merge") => {
    setIsImporting(true);
    setImportProgress(0);

    try {
      toast.info("Lendo arquivo de backup...");
      
      // Ler arquivo
      const text = await file.text();
      const backupData: BackupData = JSON.parse(text);

      // Validar estrutura
      if (!backupData.version || !backupData.timestamp || !backupData.data) {
        throw new Error("Formato de backup inválido");
      }

      toast.info("Validando dados do backup...");
      setImportProgress(10);

      const tables = Object.keys(backupData.data) as Array<keyof BackupData["data"]>;
      const totalTables = tables.length;
      let processedTables = 0;

      // Modo replace: deletar tudo antes
      if (mode === "replace") {
        toast.info("Removendo dados existentes...");
        
        for (const table of tables) {
          const { error } = await supabase.from(table).delete().neq("id", "00000000-0000-0000-0000-000000000000");
          if (error) {
            console.error(`Erro ao limpar tabela ${table}:`, error);
          }
        }
        
        setImportProgress(30);
      }

      // Importar dados
      toast.info("Importando dados...");
      
      for (const table of tables) {
        const tableData = backupData.data[table];
        
        if (tableData && tableData.length > 0) {
          // Inserir em lotes de 100
          const batchSize = 100;
          for (let i = 0; i < tableData.length; i += batchSize) {
            const batch = tableData.slice(i, i + batchSize);
            
            const { error } = await supabase.from(table).upsert(batch, {
              onConflict: mode === "merge" ? "id" : undefined,
            });

            if (error) {
              console.error(`Erro ao importar ${table}:`, error);
              toast.error(`Erro ao importar ${table}: ${error.message}`);
            }
          }
        }

        processedTables++;
        setImportProgress(30 + (processedTables / totalTables) * 60);
      }

      setImportProgress(100);
      toast.success(`Backup importado com sucesso! (Modo: ${mode === "replace" ? "Substituição" : "Mesclagem"})`);
      
      // Recarregar página após 2 segundos
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error: any) {
      console.error("Erro ao importar backup:", error);
      toast.error(`Erro ao importar: ${error.message}`);
      throw error;
    } finally {
      setIsImporting(false);
    }
  };

  // Salvar no histórico local
  const saveToHistory = (filename: string, size: number) => {
    try {
      const history = getBackupHistory();
      const newItem: BackupHistoryItem = {
        filename,
        timestamp: new Date().toISOString(),
        size: formatFileSize(size),
        date: new Date(),
      };

      history.unshift(newItem);
      
      // Manter apenas os últimos 10
      const limitedHistory = history.slice(0, 10);
      
      localStorage.setItem("backup-history", JSON.stringify(limitedHistory));
    } catch (error) {
      console.error("Erro ao salvar histórico:", error);
    }
  };

  // Obter histórico de backups
  const getBackupHistory = (): BackupHistoryItem[] => {
    try {
      const stored = localStorage.getItem("backup-history");
      if (!stored) return [];
      
      const history = JSON.parse(stored);
      return history.map((item: any) => ({
        ...item,
        date: new Date(item.timestamp),
      }));
    } catch (error) {
      console.error("Erro ao ler histórico:", error);
      return [];
    }
  };

  // Formatar tamanho de arquivo
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return {
    exportBackup,
    importBackup,
    getBackupHistory,
    isExporting,
    isImporting,
    importProgress,
  };
};
