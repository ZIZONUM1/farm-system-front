import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductsPage from "./pages/ProductsPage";
import ActionsPage from "./pages/ActionsPage";
import { Toaster } from "sonner";

function App() {
  return (
    <div dir="rtl" className="w-full min-h-screen">
      <Router>
        <Toaster position="top-right" richColors />
        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/actions" element={<ActionsPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App