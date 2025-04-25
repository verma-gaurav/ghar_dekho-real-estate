import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PrivateRoute } from "@/components/auth/PrivateRoute";
import Home from "./pages/Home";
import PropertyDetail from "./pages/PropertyDetail";
import ListProperty from "./pages/ListProperty";
import MyProperties from "./pages/MyProperties";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import AuthModal from "./components/AuthModal";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import { useEffect } from "react";

// ScrollToTop component that will scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster />
          <Sonner />
          <ScrollToTop />
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/buy" element={<Home />} />
              <Route path="/rent" element={<Home />} />
              <Route path="/pg" element={<Home />} />
              <Route path="/commercial" element={<Home />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
              <Route 
                path="/list-property" 
                element={
                  <PrivateRoute>
                    <ListProperty />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/list-property/:purpose" 
                element={
                  <PrivateRoute>
                    <ListProperty />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/edit-property/:id" 
                element={
                  <PrivateRoute>
                    <ListProperty />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/property/:id" 
                element={
                  <PrivateRoute>
                    <PropertyDetail />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/my-properties" 
                element={
                  <PrivateRoute>
                    <MyProperties />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } 
              />
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
