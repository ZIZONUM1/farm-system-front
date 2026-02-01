import React, { useState, useEffect } from "react";
import { actionsApi } from "../../services/actions.api";
import { Wallet, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BalanceData {
  balance: number;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}

const BalanceDisplay: React.FC = () => {
  const [balanceData, setBalanceData] = useState<BalanceData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await actionsApi.getBalance();
      setBalanceData(response);
    } catch (err) {
      setError("فشل في تحميل الرصيد");
      console.error("Error fetching balance:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("ar-EG", {
      style: "currency",
      currency: "EGP",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getBalanceColor = (balance: number): string => {
    if (balance > 0) return "text-green-600";
    if (balance < 0) return "text-red-600";
    return "text-gray-600";
  };

  const getBalanceBg = (balance: number): string => {
    if (balance > 0) return "bg-green-50 border-green-200";
    if (balance < 0) return "bg-red-50 border-red-200";
    return "bg-gray-50 border-gray-200";
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-2 text-red-700">
          <Activity className="w-5 h-5" />
          <span>{error}</span>
        </div>
        <Button 
          onClick={fetchBalance} 
          variant="outline" 
          size="sm" 
          className="mt-2"
        >
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  const balance = balanceData?.balance || 0;

  return (
    <div className={`border rounded-lg p-6 ${getBalanceBg(balance)}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-blue-100">
            <Wallet className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">الرصيد الحالي</h3>
            <p className="text-sm text-gray-600">تحديث تلقائي</p>
          </div>
        </div>
        <Button 
          onClick={fetchBalance} 
          variant="ghost" 
          size="sm"
          disabled={loading}
        >
          <Activity className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className="text-center py-4">
        <div className={`text-3xl font-bold ${getBalanceColor(balance)}`}>
          {formatCurrency(Math.abs(balance))}
        </div>
        <div className="flex items-center justify-center gap-2 mt-2">
          {balance > 0 ? (
            <>
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-medium">في الربح</span>
            </>
          ) : balance < 0 ? (
            <>
              <TrendingDown className="w-5 h-5 text-red-600" />
              <span className="text-red-700 font-medium">في الخسارة</span>
            </>
          ) : (
            <span className="text-gray-600 font-medium">متوازن</span>
          )}
        </div>
      </div>

      {balanceData?.updatedAt && (
        <div className="text-xs text-gray-500 text-center mt-4">
          آخر تحديث: {new Date(balanceData.updatedAt).toLocaleString("ar-EG")}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-white p-3 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-600 mx-auto mb-1" />
            <div className="text-sm text-gray-600">إجمالي الوارد</div>
            <div className="text-lg font-semibold text-green-700">
              {formatCurrency(Math.abs(balance))}
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <TrendingDown className="w-5 h-5 text-red-600 mx-auto mb-1" />
            <div className="text-sm text-gray-600">إجمالي المنصرف</div>
            <div className="text-lg font-semibold text-red-700">
              {formatCurrency(0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceDisplay;