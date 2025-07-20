
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import AdminInventory from "./pages/AdminInventory";
import AdminOrders from "./pages/AdminOrders";
import AdminCustomers from "./pages/AdminCustomers";
import AdminInvoice from "./pages/AdminInvoice";
import AdminBusinessInfoPage from "./pages/AdminBusinessInfoPage";
import AdminCategoriesPage from "./pages/AdminCategoriesPage";
import AdminExpensesPage from "./pages/AdminExpensesPage";
import PublicStore from "./pages/PublicStore";
import StorefrontPage from "./pages/StorefrontPage";
import BusinessInfoPage from "./pages/BusinessInfoPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import ShoppingCart from "./pages/ShoppingCart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import { AdminLayout } from "./components/AdminLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Admin routes with sidebar layout */}
            <Route path="/admin" element={
              <AdminLayout title="Dashboard Overview">
                <AdminDashboard />
              </AdminLayout>
            } />
            <Route path="/admin/inventory" element={
              <AdminLayout title="Inventory Management">
                <AdminInventory />
              </AdminLayout>
            } />
            <Route path="/admin/orders" element={
              <AdminLayout title="Order Management">
                <AdminOrders />
              </AdminLayout>
            } />
            <Route path="/admin/customers" element={
              <AdminLayout title="Customer Management">
                <AdminCustomers />
              </AdminLayout>
            } />
            <Route path="/admin/invoice/:orderId" element={
              <AdminLayout title="Invoice Details">
                <AdminInvoice />
              </AdminLayout>
            } />
            <Route path="/admin/settings/business-info" element={
              <AdminLayout title="Business Information">
                <BusinessInfoPage />
              </AdminLayout>
            } />
            <Route path="/admin/settings/categories" element={
              <AdminLayout title="Category Management">
                <AdminCategoriesPage />
              </AdminLayout>
            } />
            <Route path="/admin/finance/expenses" element={
              <AdminLayout title="Expense Management">
                <AdminExpensesPage />
              </AdminLayout>
            } />
            
            {/* Public store routes */}
            <Route path="/storefront" element={<StorefrontPage />} />
            <Route path="/store" element={<PublicStore />} />
            <Route path="/store/product/:id" element={<ProductDetailsPage />} />
            <Route path="/store/cart" element={<ShoppingCart />} />
            <Route path="/store/checkout" element={<Checkout />} />
            <Route path="/store/success" element={<OrderSuccess />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
