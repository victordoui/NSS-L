import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Download, Upload, Database, AlertTriangle, Clock, FileText } from "lucide-react";
import { useBackup } from "@/hooks/useBackup";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const AdminBackup = () => {
  const {
    exportBackup,
    importBackup,
    getBackupHistory,
    isExporting,
    isImporting,
    importProgress,
  } = useBackup();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importMode, setImportMode] = useState<"replace" | "merge">("merge");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [lastExport, setLastExport] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const history = getBackupHistory();

  const handleExport = async () => {
    try {
      const filename = await exportBackup();
      if (filename) {
        setLastExport(format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }));
      }
    } catch (error) {
      console.error("Erro ao exportar:", error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== "application/json" && !file.name.endsWith(".json")) {
        alert("Por favor, selecione um arquivo JSON válido.");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleImportClick = () => {
    if (!selectedFile) {
      alert("Por favor, selecione um arquivo de backup primeiro.");
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleConfirmImport = async () => {
    if (!selectedFile) return;
    
    setShowConfirmDialog(false);
    
    try {
      await importBackup(selectedFile, importMode);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Erro ao importar:", error);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Database className="h-8 w-8" />
          Backup e Restauração
        </h1>
        <p className="text-muted-foreground">
          Gerencie os dados do sistema através de backups manuais
        </p>
      </div>

      {/* Export Card */}
      <Card className="shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-card to-card/95">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Exportar Backup
          </CardTitle>
          <CardDescription>
            Crie um arquivo de backup com todos os dados do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {lastExport && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Última exportação: {lastExport}</span>
            </div>
          )}
          
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              O backup incluirá: Artigos, Mensagens, Serviços, Projetos, Configurações, Redes Sociais e Dados de Contato.
            </AlertDescription>
          </Alert>

          <Button
            onClick={handleExport}
            disabled={isExporting}
            size="lg"
            className="w-full"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Exportando...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Exportar Backup Completo
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Import Card */}
      <Card className="shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-card to-card/95">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Importar Backup
          </CardTitle>
          <CardDescription>
            Restaure dados de um backup anterior
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>ATENÇÃO:</strong> A importação pode substituir dados existentes. 
              Recomendamos fazer um backup antes de prosseguir.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="backup-file">Selecionar Arquivo</Label>
            <input
              ref={fileInputRef}
              id="backup-file"
              type="file"
              accept=".json,application/json"
              onChange={handleFileSelect}
              disabled={isImporting}
              className="block w-full text-sm text-muted-foreground
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-primary file:text-primary-foreground
                hover:file:bg-primary/90
                file:cursor-pointer cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                Arquivo selecionado: <span className="font-medium">{selectedFile.name}</span>
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label>Modo de Importação</Label>
            <RadioGroup value={importMode} onValueChange={(value: any) => setImportMode(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="replace" id="replace" disabled={isImporting} />
                <Label htmlFor="replace" className="font-normal cursor-pointer">
                  <span className="font-semibold">Substituir todos os dados</span>
                  <span className="text-sm text-muted-foreground block">
                    Remove todos os dados atuais e insere os do backup
                  </span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="merge" id="merge" disabled={isImporting} />
                <Label htmlFor="merge" className="font-normal cursor-pointer">
                  <span className="font-semibold">Mesclar com dados existentes</span>
                  <span className="text-sm text-muted-foreground block">
                    Adiciona ou atualiza registros sem remover dados existentes
                  </span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {isImporting && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Importando...</span>
                <span>{Math.round(importProgress)}%</span>
              </div>
              <Progress value={importProgress} className="h-2" />
            </div>
          )}

          <Button
            onClick={handleImportClick}
            disabled={!selectedFile || isImporting}
            size="lg"
            variant="default"
            className="w-full"
          >
            {isImporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Importando...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Iniciar Importação
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* History Card */}
      {history.length > 0 && (
        <Card className="shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-card to-card/95">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Histórico de Backups
            </CardTitle>
            <CardDescription>
              Últimos backups exportados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {history.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border bg-background/50 hover:bg-background transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{item.filename}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(item.date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })} • {item.size}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirmar Importação
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Você está prestes a importar o backup no modo:{" "}
                <span className="font-semibold">
                  {importMode === "replace" ? "Substituir tudo" : "Mesclar"}
                </span>
              </p>
              {importMode === "replace" && (
                <p className="text-destructive font-medium">
                  ⚠️ Esta ação irá DELETAR todos os dados atuais e substituí-los pelos dados do backup.
                </p>
              )}
              <p>Deseja continuar?</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmImport} className="bg-primary">
              Confirmar Importação
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminBackup;
