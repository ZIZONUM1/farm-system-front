import React, { useState, useEffect } from "react";
import type { Product } from "../types/product";
import type { Action } from "../types/action";
import DashboardLayout from "../components/layout/DashboardLayout";
import ActionForm from "../components/actions/ActionForm";
import { productsApi } from "../services/products.api";
import { actionsApi } from "../services/actions.api";
import { Button } from "@/components/ui/button";
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

const ActionsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const [actionToDelete, setActionToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsData, actionsData] = await Promise.all([
        productsApi.getAll(),
        actionsApi.getAll()
      ]);
      setProducts(productsData);
      setActions(actionsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleActionSubmit = async (actionData: { productId: string; actionType: 'harvest' | 'watering' | 'selling' | 'adding'; quantity: number }) => {
    try {
      setIsSubmitting(true);
      const newAction = await actionsApi.add(actionData);
      setActions([...actions, newAction]);
    } catch (error) {
      console.error("Error submitting action:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAction = (id: string) => {
    setActionToDelete(id);
    setIsAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (!actionToDelete) return;

    try {
      setIsSubmitting(true);
      await actionsApi.delete(actionToDelete);
      setActions(actions.filter(a => a.id !== actionToDelete));
      setIsAlertOpen(false);
      setActionToDelete(null);
    } catch (error) {
      console.error("Error deleting action:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format action type for display
  const formatActionType = (type: string) => {
    switch (type) {
      case 'harvest': return 'Harvest';
      case 'watering': return 'Watering';
      case 'selling': return 'Selling';
      case 'adding': return 'Adding Quantity';
      default: return type;
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">إدارة الإجراءات</h2>
        
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">تنفيذ إجراء</h3>
          <ActionForm 
            products={products} 
            onSubmit={handleActionSubmit} 
            isSubmitting={isSubmitting}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">سجل الإجراءات</h3>
          
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : actions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              لا توجد إجراءات
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المنتج</th>
                    <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراء</th>
                    <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الكمية</th>
                    <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التاريخ</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {actions.map((action) => (
                    <tr key={action.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4 whitespace-nowrap text-right">{action.productName}</td>
                      <td className="py-4 px-4 whitespace-nowrap text-right">{formatActionType(action.actionType)}</td>
                      <td className="py-4 px-4 whitespace-nowrap text-right">{action.quantity}</td>
                      <td className="py-4 px-4 whitespace-nowrap text-right">{new Date(action.date).toLocaleDateString()}</td>
                      <td className="py-4 px-4 whitespace-nowrap text-left">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteAction(action.id)}
                        >
                          حذف
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد أنك تريد حذف هذا الإجراء؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsAlertOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isSubmitting}>
              {isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default ActionsPage;