
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Home from "./pages/Home";
import PropertyDetail from "./pages/PropertyDetail";
import ListProperty from "./pages/ListProperty";
import SavedProperties from "./pages/SavedProperties";
import NotFound from "./pages/NotFound";
import AuthModal from "./components/AuthModal";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/buy" element={<Home />} />
              <Route path="/rent" element={<Home />} />
              <Route path="/pg" element={<Home />} />
              <Route path="/commercial" element={<Home />} />
              <Route path="/property/:id" element={<PropertyDetail />} />
              <Route path="/list-property" element={<ListProperty />} />
              <Route path="/saved-properties" element={<SavedProperties />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <AuthModal />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
