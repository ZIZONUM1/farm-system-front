import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Package, Wrench } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const getCurrentPage = (): "products" | "actions" => {
    if (location.pathname === "/" || location.pathname === "/products") {
      return "products";
    }
    return "actions";
  };
  
  const currentPage = getCurrentPage();
  
  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Header */}
      <header className="bg-white shadow-sm w-full">
        <div className="px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between h-16 items-center w-full">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">نظام إدارة المزرعة</h1>
            </div>
            <nav className="flex space-x-4">
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
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full py-8">
        <div className="px-4 sm:px-6 lg:px-8 w-full max-w-none">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;