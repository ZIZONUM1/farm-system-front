import React, { useState, useEffect } from "react";
import { actionsApi } from "../../services/actions.api";
import { Wallet } from "lucide-react";

const BalanceHeader: React.FC = () => {
  const [balance, setBalance] = useState<number>(0);
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
      setBalance(response.balance || 0);
    } catch (err) {
      setError("فشل في تحميل الرصيد");
      console.error("Error fetching balance:", err);
      setBalance(0);
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
    if (balance > 0) return "text-green-700 bg-green-50 border-green-200";
    if (balance < 0) return "text-red-700 bg-red-50 border-red-200";
    return "text-gray-700 bg-gray-50 border-gray-200";
  };

  return (
    <div className={`w-full p-4 rounded-lg border mb-6 ${getBalanceColor(balance)}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-blue-100">
            <Wallet className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">الرصيد</h2>
            <p className="text-sm text-gray-600">الرصيد الحالي للنظام</p>
          </div>
        </div>
        
        <div className="text-right">
          {loading ? (
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
          ) : error ? (
            <div className="text-red-600 text-sm">{error}</div>
          ) : (
            <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BalanceHeader;