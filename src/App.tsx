import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ScrollToTop from "./components/ScrollToTop";
import SkipLink from "./components/SkipLink";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const NssEngenharia = lazy(() => import("./pages/NssEngenharia"));
const Servicos = lazy(() => import("./pages/Servicos"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const ObrasExecutadas = lazy(() => import("./pages/ObrasExecutadas"));
const Informativo = lazy(() => import("./pages/Informativo"));
const ArticleDetail = lazy(() => import("./pages/ArticleDetail"));
const Contato = lazy(() => import("./pages/Contato"));
const Auth = lazy(() => import("./pages/Auth"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading fallback component
const PageLoader = () => (
  <main
    id="main-content"
    tabIndex={-1}
    className="min-h-screen flex items-center justify-center bg-background"
    role="status"
    aria-live="polite"
  >
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" aria-hidden="true"></div>
    <span className="sr-only">Carregando página...</span>
  </main>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <SkipLink />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/nss-engenharia" element={<NssEngenharia />} />
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
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
