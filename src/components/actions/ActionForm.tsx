import React, { useState } from "react";
import type { Product } from "../../types/product";
import type { ActionRequest, ActionType } from "../../types/action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ActionFormProps {
  products: Product[];
  onSubmit: (action: ActionRequest) => void;
  isSubmitting: boolean;
}

const ActionForm: React.FC<ActionFormProps> = ({ products, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState<ActionRequest>({
    productId: "",
    actionType: "harvest",
    quantity: 0,
  });

  const handleChange = (name: keyof ActionRequest, value: string | number) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="productId">اختر المنتج</Label>
          <Select 
            value={formData.productId} 
            onValueChange={(value) => handleChange("productId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر منتجًا" />
            </SelectTrigger>
            <SelectContent>
              {products.length && products.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="actionType">نوع الإجراء</Label>
          <Select 
            value={formData.actionType} 
            onValueChange={(value: ActionType) => handleChange("actionType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر إجراءً" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="harvest">حصاد</SelectItem>
              <SelectItem value="watering">ري</SelectItem>
              <SelectItem value="selling">بيع</SelectItem>
              <SelectItem value="adding">إضافة كمية</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="quantity">الكمية</Label>
          <Input
            id="quantity"
            type="number"
            min="0"
            value={formData.quantity}
            onChange={(e) => handleChange("quantity", Number(e.target.value))}
            required
            placeholder="أدخل الكمية"
          />
        </div>
      </div>
      
      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "جاري المعالجة..." : "إرسال الإجراء"}
        </Button>
      </div>
    </form>
  );
};

export default ActionForm;