import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import FamilyTree from "./pages/FamilyTree";
import MemberDetails from "./pages/MemberDetails";
import AddFamilyMember from "./pages/AddFamilyMember";
import EditMember from "./pages/EditMember";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/family-tree" element={<FamilyTree />} />
          <Route path="/member/:id" element={<MemberDetails />} />
          <Route path="/add-member" element={<AddFamilyMember />} />
          <Route path="/edit-member/:id" element={<EditMember />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
