import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import FgLaport from "./pages/FgLaport";
import Servicos from "./pages/Servicos";
import ServiceDetail from "./pages/ServiceDetail";
import ObrasExecutadas from "./pages/ObrasExecutadas";
import Informativo from "./pages/Informativo";
import ArticleDetail from "./pages/ArticleDetail";
import Contato from "./pages/Contato";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/fg-laport" element={<FgLaport />} />
          <Route path="/servicos" element={<Servicos />} />
          <Route path="/servicos/:slug" element={<ServiceDetail />} />
          <Route path="/obras-executadas" element={<ObrasExecutadas />} />
          <Route path="/informativo" element={<Informativo />} />
          <Route path="/informativo/:slug" element={<ArticleDetail />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin/*" element={<Admin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
