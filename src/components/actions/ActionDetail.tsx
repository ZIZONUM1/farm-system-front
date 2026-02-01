import React from "react";
import type { Action } from "../../types/action";
import type { Product } from "../../types/product";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Package, FileText, Wallet } from "lucide-react";

interface ActionDetailProps {
  action: Action | null;
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ActionDetail: React.FC<ActionDetailProps> = ({ action, product, isOpen, onClose }) => {
  if (!action) return null;

  const formatActionType = (type: string) => {
    switch (type) {
      case "buy": return "شراء (Buy)";
      case "other": return "آخر (Other)";
      default: return type;
    }
  };

  const formatAmountType = (type: string) => {
    switch (type) {
      case "piece": return "قطعة";
      case "kg": return "كيلوغرام";
      case "litre": return "لتر";
      default: return type;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-right">تفاصيل الإجراء</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Action Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-blue-500" />
                <span className="font-medium">نوع الإجراء</span>
              </div>
              <p className="text-right">{formatActionType(action.type)}</p>
              {action.typeDesc && (
                <p className="text-sm text-gray-600 text-right mt-1">{action.typeDesc}</p>
              )}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-5 h-5 text-green-500" />
                <span className="font-medium">نوع الكمية</span>
              </div>
              <p className="text-right">{formatAmountType(action.amountType)}</p>
            </div>
          </div>

          {/* Amount and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">الكمية</span>
              </div>
              <p className="text-right text-lg font-semibold">{action.amount}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-purple-500" />
                <span className="font-medium">التاريخ</span>
              </div>
              <p className="text-right">{new Date(action.date).toLocaleDateString("ar-EG")}</p>
            </div>
          </div>

          {/* Product Info */}
          {product && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2 text-right">المنتج</h3>
              <div className="space-y-1">
                <p className="text-right"><span className="font-medium">الاسم:</span> {product.name}</p>
                <p className="text-right"><span className="font-medium">الكمية الحالية:</span> {product.amount}</p>
                {product.desc && (
                  <p className="text-right"><span className="font-medium">الوصف:</span> {product.desc}</p>
                )}
              </div>
            </div>
          )}

          {/* Financial Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-5 h-5 text-green-600" />
                <span className="font-medium">وارد</span>
              </div>
              <p className="text-right text-lg font-semibold text-green-700">
                {action["وارد"] > 0 ? `+${action["وارد"]}` : "0"}
              </p>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-5 h-5 text-red-600" />
                <span className="font-medium">منصرف</span>
              </div>
              <p className="text-right text-lg font-semibold text-red-700">
                {action["منصرف"] > 0 ? `-${action["منصرف"]}` : "0"}
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-5 h-5 text-blue-600" />
                <span className="font-medium">الرصيد</span>
              </div>
              <p className="text-right text-lg font-semibold text-blue-700">{action["رصيد"]}</p>
            </div>
          </div>

          {/* Description */}
          {action["بيان"] && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2 text-right">البيان</h3>
              <p className="text-right text-gray-700">{action["بيان"]}</p>
            </div>
          )}

          {/* Timestamps */}
          <div className="text-sm text-gray-500 text-right space-y-1">
            <p>تم الإنشاء: {new Date(action.createdAt || "").toLocaleString("ar-EG")}</p>
            <p>آخر تعديل: {new Date(action.updatedAt || "").toLocaleString("ar-EG")}</p>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={onClose}>إغلاق</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActionDetail;