import React, { useState } from "react";
import type { Product } from "../../types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProductFormProps {
  product?: Product;
  onSubmit: (product: Omit<Product, "id"> | Partial<Product>) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState<Omit<Product, "id"> | Partial<Product>>({
    name: product?.name || "",
    amount: product?.amount || 0,
    desc: product?.desc || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "amount" ? Number(value) : value,
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
          <Label htmlFor="name">اسم المنتج</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="أدخل اسم المنتج"
          />
        </div>
                  
        <div>
          <Label htmlFor="desc">الوصف (اختياري)</Label>
          <Input
            id="desc"
            name="desc"
            value={formData.desc || ""}
            onChange={handleChange}
            placeholder="أدخل وصف المنتج"
          />
        </div>
        
        <div>
          <Label htmlFor="amount">الكمية</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            min="0"
            value={formData.amount}
            onChange={handleChange}
            required
            placeholder="أدخل الكمية"
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          إلغاء
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "جاري الحفظ..." : product ? "تحديث المنتج" : "إضافة منتج"}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;