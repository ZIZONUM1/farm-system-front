/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import type { Product } from "../types/product";
import DashboardLayout from "../components/layout/DashboardLayout";
import ProductTable from "../components/products/ProductTable";
import ProductForm from "../components/products/ProductForm";
import BalanceHeader from "../components/balance/BalanceHeader";
import { productsApi } from "../services/products.api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PaginationComponent } from "@/components/PaginationComponent";
import { Input } from "@/components/ui/input";
type Filters = Record<string, any>;
const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1); // State to keep track of the current page
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [filters, setFilters] = useState<Filters>({
    page: currentPage,
    size: 10,
    searchKey: "",
    searchFields: ["name", "desc"],
  });
  const buildSearchParams = (filters: Filters) => {
    const params = new URLSearchParams();

    const hasSearch = Boolean(filters.searchKey?.trim());

    Object.entries(filters).forEach(([key, value]) => {
      // 🚫 don't send searchFields if no searchKey
      if (key === "searchFields" && !hasSearch) return;

      if (
        value === "" ||
        value === null ||
        value === undefined ||
        (Array.isArray(value) && value.length === 0)
      ) {
        return;
      }

      // ✅ Encode key ONCE (Arabic-safe)
      const encodedKey = encodeURIComponent(key);

      if (Array.isArray(value)) {
        value.forEach((v) => {
          const encodedValue = encodeURIComponent(String(v));
          console.log(encodedValue);

          params.append(encodedKey, encodedValue);
        });
      } else {
        params.append(encodedKey, encodeURIComponent(String(value)));
      }
    });

    return params.toString();
  };
  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = buildSearchParams(filters);
      const response = await productsApi.getAll(params);
      console.log(response);

      // Handle both direct array and {products: array} response formats
      const productsData = response.products || response;
      setProducts(Array.isArray(productsData) ? productsData : []);
      setTotalProducts(response.productsCount || 0);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (id: string) => {
    setProductToDelete(id);
    setIsAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      setIsSubmitting(true);
      await productsApi.delete(productToDelete);
      setProducts(products.filter((p) => p._id !== productToDelete));
      setIsAlertOpen(false);
      setProductToDelete(null);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitProduct = async (
    productData: Omit<Product, "id"> | Partial<Product>
  ) => {
    try {
      setIsSubmitting(true);

      if (editingProduct) {
        // Update existing product
        const updatedProduct = await productsApi.update(
          editingProduct._id,
          productData
        );
        setProducts(
          products.map((p) =>
            p._id === editingProduct._id ? updatedProduct.product : p
          )
        );
      } else {
        // Add new product
        const newProduct = await productsApi.add(
          productData as Omit<Product, "id">
        );
        setProducts([...products, newProduct.product]);
      }
      fetchProducts();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Balance Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <BalanceHeader />
        </div>

        {/* Products Management Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="w-full flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">إدارة المنتجات</h2>
            <Button onClick={handleAddProduct}>إضافة منتج</Button>
          </div>
          
          <Input
            type="text"
            value={filters.searchKey || ""}
            onChange={(e) =>
              setFilters({ ...filters, searchKey: e.target.value })
            }
            placeholder="بحث عن المنتجات..."
            className="w-full mb-3"
          />
          <ProductTable
            products={products}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            loading={loading}
          />
          <div className="flex justify-end items-center gap-x-3">
            <PaginationComponent
              currentPage={currentPage}
              totalActions={totalProducts}
              onPageChange={(page: number) => {
                setCurrentPage(page);
                setFilters({ ...filters, page });
              }}
            />
            <div className="min-w-[150px]">
              <p className="text-sm text-gray-700 font-medium w-full mb-0">
                عدد المنتجات: {totalProducts}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Form Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-white rounded-xl shadow-sm p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "تعديل المنتج" : "إضافة منتج"}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            product={editingProduct || undefined}
            onSubmit={handleSubmitProduct}
            onCancel={() => setIsModalOpen(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="bg-white rounded-xl shadow-sm p-6">
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد أنك تريد حذف هذا المنتج؟ لا يمكن التراجع عن هذا
              الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsAlertOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isSubmitting}>
              {isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default ProductsPage;
