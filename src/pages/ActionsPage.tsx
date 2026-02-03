/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import type { Product } from "../types/product";
import type { Action, ActionRequest } from "../types/action";
import DashboardLayout from "../components/layout/DashboardLayout";
import ActionForm from "../components/actions/ActionForm";
import ActionDetail from "../components/actions/ActionDetail";
import BalanceHeader from "../components/balance/BalanceHeader";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit, Eye } from "lucide-react";
import { PaginationComponent } from "@/components/PaginationComponent";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
type Filters = Record<string, any>;
const ActionsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const [actionToDelete, setActionToDelete] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingAction, setEditingAction] = useState<Action | null>(null);
  const [viewingAction, setViewingAction] = useState<Action | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1); // State to keep track of the current page
  const [totalActions, setTotalActions] = useState<number>(0);
  const [filters, setFilters] = useState<Filters>({
    page: currentPage,
    size: 10,
    type: "",
    searchKey: "",
    searchFields: ["typeDesc"],
    amountType: "",
    product: "",
    date: "",
    وارد: "",
    منصرف: "",
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
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      const params = buildSearchParams(filters);
      setLoading(true);
      const [productsData, actionsData] = await Promise.all([
        productsApi.getAll(""),
        actionsApi.getAll(params),
      ]);
      setProducts(productsData.products);
      setActions(actionsData.actions);
      setTotalActions(actionsData.actionsCount || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleActionSubmit = async (actionData: ActionRequest) => {
    try {
      setIsSubmitting(true);
      let result: any;

      if (editingAction) {
        result = await actionsApi.update(editingAction._id, actionData);
        setActions(
          actions.map((a) => (a._id === editingAction._id ? result.action : a))
        );
        setEditingAction(null);
      } else {
        result = await actionsApi.add(actionData);
        setActions([...actions, result.action]);
      }
      fetchData();

      setIsFormOpen(false);
    } catch (error) {
      console.error("Error submitting action:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditAction = (action: Action) => {
    setEditingAction(action);
    setIsFormOpen(true);
  };

  const handleViewAction = (action: Action) => {
    setViewingAction(action);
    setIsDetailOpen(true);
  };

  // const handleAddAction = () => {
  //   setEditingAction(null);
  //   setIsFormOpen(true);
  // };

  const handleDeleteAction = (id: string) => {
    setActionToDelete(id);
    setIsAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (!actionToDelete) return;

    try {
      setIsSubmitting(true);
      await actionsApi.delete(actionToDelete);
      setActions(actions.filter((a) => a.id !== actionToDelete));
      setIsAlertOpen(false);
      setActionToDelete(null);
      fetchData();
    } catch (error) {
      console.error("Error deleting action:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format action type for display
  const formatActionType = (type: string) => {
    switch (type) {
      case "buy":
        return "شراء";
      case "other":
        return "آخر";
      default:
        return type;
    }
  };

  // Get product name by ID
  const getProductName = (productId?: string) => {
    if (!productId) return "-";
    const product = products.find((p) => p._id === productId);
    return product ? product.name : "المنتج محذوف";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Balance Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <BalanceHeader />
        </div>

        {/* Actions Management Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            إدارة الإجراءات
          </h2>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                تنفيذ إجراء
              </h3>
              <ActionForm
                products={products}
                onSubmit={handleActionSubmit}
                isSubmitting={isSubmitting}
              />
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  سجل الإجراءات
                </h3>
                <Button
                  variant={"outline"}
                  onClick={() =>
                    setFilters({
                      page: 1,
                      size: 10,
                      type: "",
                      searchKey: "",
                      amountType: "",
                      product: "",
                      date: "",
                    })
                  }
                >
                  إستعادة التصفية
                </Button>
              </div>
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
                        <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <Select
                            value={""}
                            onValueChange={(value) => {
                              setFilters((prev) => ({
                                ...prev,
                                product: value,
                              }));
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="المنتج" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map((product) => (
                                <SelectItem
                                  key={product._id}
                                  value={product._id}
                                >
                                  {product.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </th>
                        <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <Select
                            value={""}
                            onValueChange={(value) => {
                              setFilters((prev) => ({
                                ...prev,
                                type: value,
                              }));
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="الإجراء" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="buy">شراء</SelectItem>
                              <SelectItem value="other">آخر</SelectItem>
                            </SelectContent>
                          </Select>
                        </th>
                        <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          الكمية
                        </th>
                        <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <Select
                            value={""}
                            onValueChange={(value) => {
                              setFilters((prev) => ({
                                ...prev,
                                amountType: value,
                              }));
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="نوع الكمية" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="kg">كيلوغرام</SelectItem>
                              <SelectItem value="piece">قطعة</SelectItem>
                              <SelectItem value="litre">لتر</SelectItem>
                            </SelectContent>
                          </Select>
                        </th>
                        <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          وارد
                        </th>
                        <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          منصرف
                        </th>
                        <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          بيان
                        </th>
                        <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <Input
                            type="date"
                            onChange={(e) =>
                              setFilters((prev) => ({
                                ...prev,
                                date: e.target.value,
                              }))
                            }
                          />
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          الإجراءات
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {actions.length &&
                        actions.map((action: Action) => (
                          <tr key={action._id} className="hover:bg-gray-50">
                            <td className="py-4 px-4 whitespace-nowrap text-right">
                              {getProductName(action.product)}
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap text-right">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                {formatActionType(action.type)} (
                                {action.typeDesc})
                              </span>
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap text-right">
                              {action.amount}
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap text-right">
                              {action.amountType}
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap text-right">
                              {action["وارد"] || 0}
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap text-right">
                              {action["منصرف"] || 0}
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap text-right">
                              {action["بيان"] || ""}
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap text-right">
                              {new Date(action.date).toLocaleDateString(
                                "ar-EG"
                              )}
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap text-left">
                              <div className="flex justify-end space-x-reverse space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewAction(action)}
                                  className="flex items-center gap-1"
                                >
                                  <Eye className="w-4 h-4" />
                                  عرض
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditAction(action)}
                                  className="flex items-center gap-1"
                                >
                                  <Edit className="w-4 h-4" />
                                  تعديل
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteAction(action._id)}
                                  className="flex items-center gap-1"
                                >
                                  حذف
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                    <div className="flex justify-end items-center gap-x-3">
                      <PaginationComponent
                        currentPage={currentPage}
                        totalActions={totalActions}
                        onPageChange={(page: number) => {
                          setCurrentPage(page);
                          setFilters({ ...filters, page });
                        }}
                      />
                      <div className="min-w-[150px]">
                        <p className="text-sm text-gray-700 font-medium w-full mb-0">
                          عدد الإجراءات: {totalActions}
                        </p>
                      </div>
                    </div>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl bg-white rounded-xl shadow-sm p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAction ? "تعديل الإجراء" : "إضافة إجراء جديد"}
            </DialogTitle>
          </DialogHeader>
          <ActionForm
            products={products}
            onSubmit={handleActionSubmit}
            isSubmitting={isSubmitting}
            initialData={
              editingAction
                ? {
                    type: editingAction.type as any,
                    amountType: editingAction.amountType as any,
                    amount: editingAction.amount,
                    product: editingAction.product,
                    typeDesc: editingAction.typeDesc,
                    date: editingAction.date,
                    income: editingAction["وارد"] || 0,
                    outcome: editingAction["منصرف"] || 0,
                    desc: editingAction["بيان"] || ("" as string),
                  }
                : undefined
            }
          />
        </DialogContent>
      </Dialog>

      {/* Action Detail Dialog */}
      <ActionDetail
        action={viewingAction}
        product={
          viewingAction
            ? products.find((p) => p._id === viewingAction.product) || null
            : null
        }
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />

      {/* Delete Confirmation Alert */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="bg-white rounded-xl shadow-sm p-6">
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد أنك تريد حذف هذا الإجراء؟ لا يمكن التراجع عن هذا
              الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsAlertOpen(false)}>
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isSubmitting}>
              {isSubmitting ? "جاري الحذف..." : "حذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default ActionsPage;
