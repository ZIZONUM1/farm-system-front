import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChartNoAxesCombined, History, Package, Wrench } from "lucide-react";
import { productsApi } from "@/services/products.api";
import { toast } from "sonner";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = React.useState(false);
  const getCurrentPage = (): "products" | "actions" | "statistics" => {
    if (location.pathname === "/" || location.pathname === "/products") {
      return "products";
    }
    else if (location.pathname === "/statistics") {
      return "statistics";
    }
    return "actions";
  };
  const handleBackup = async () => {
    try {
      setIsLoading(true);
      const backup = await productsApi.backup();
      console.log(backup);
      toast.success("Backup created successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to create backup");
    } finally {
      setIsLoading(false);
    }
  };
  const currentPage = getCurrentPage();
  
  return (
    <div className="min-h-screen bg-gray-100 w-full">
      {/* Header */}
      <header className="bg-white shadow-sm w-full">
        <div className="px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between h-16 items-center w-full">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">نظام إدارة المزرعة</h1>
            </div>
            <nav className="flex space-x-4">
              <button className="px-3 py-2 rounded-md text-sm font-medium bg-green-800 text-gray-200 flex justify-between gap-x-1 cursor-pointer" disabled={isLoading} onClick={handleBackup}>أخذ نسخة إحتياطية <History/> </button>
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === "products"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  المنتجات
                </div>
              </Link>
              
              <Link
                to="/actions"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === "actions"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4" />
                  الإجراءات
                </div>
              </Link>
              <Link
                to="/statistics"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === "statistics"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <ChartNoAxesCombined className="w-4 h-4" />
                  الإحصائيات
                </div>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full py-8">
        <div className="px-4 sm:px-6 lg:px-8 w-full max-w-none">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;