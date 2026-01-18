import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductsPage from "./pages/ProductsPage";
import ActionsPage from "./pages/ActionsPage";

function App() {
  return (
    <div dir="rtl" className="rtl w-full h-full">
      <Router>
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