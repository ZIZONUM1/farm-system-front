/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// shadcn Chart
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
} from "@/components/ui/chart";
import * as Recharts from "recharts";

import { actionsApi } from "@/services/actions.api";
import DashboardLayout from "@/components/layout/DashboardLayout";
import type { Product } from "@/types/product";
import { productsApi } from "@/services/products.api";

type StatisticItem = {
  productId: string | null;
  productName?: string;
  totalوارد: number;
  totalمنصرف: number;
  netAmount: number;
  count: number;
};

type StatisticsResponse = {
  period: "month" | "year";
  year: string;
  month?: string;
  productId: string | null;
  statistics: StatisticItem[];
  summary: {
    totalCount: number;
    totalوارد: number;
    totalمنصرف: number;
    netAmount: number;
  };
};

const StatisticsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [period, setPeriod] = useState<"month" | "year">("month");
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [month, setMonth] = useState<string>(
    (new Date().getMonth() + 1).toString().padStart(2, "0")
  );
  const [productId, setProductId] = useState<string>("");

  const [data, setData] = useState<StatisticsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError("");

      const params: any = { period, year };
      if (period === "month") params.month = month;
      if (productId) params.productId = productId;

      const res = await actionsApi.getStatistics(params);
      setData(res.data);

      const productsData = await productsApi.getAll("");
      setProducts(productsData.productsOptions);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "حدث خطأ ما");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  // Chart configuration
  const chartConfig = {
    totalوارد: { label: "إجمالي الوارد" },
    totalمنصرف: { label: "إجمالي المنصرف" },
    netAmount: { label: "الصافي" },
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 rtl">
        {/* فلترة */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>تصفية الإحصائيات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Select
                value={period}
                onValueChange={(val) => setPeriod(val as "month" | "year")}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="اختر الفترة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">شهر</SelectItem>
                  <SelectItem value="year">سنة</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="number"
                className="w-24"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="السنة"
              />

              {period === "month" && (
                <Input
                  type="number"
                  className="w-24"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  placeholder="الشهر (1-12)"
                />
              )}

              <Select
                value={productId || ""}
                onValueChange={(value) => setProductId(value as string)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر منتجًا" />
                </SelectTrigger>
                <SelectContent>
                  {products?.map((product) => (
                    <SelectItem key={product._id} value={product._id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button onClick={fetchStatistics} className="h-10 mt-1">
                {loading ? "جارٍ التحميل..." : "جلب الإحصائيات"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && <div className="text-red-600">{error}</div>}

        {data && (
          <>
            {/* الملخص */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>الملخص</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>إجمالي المنتجات: {data.summary.totalCount}</div>
                <div>إجمالي الوارد: {data.summary.totalوارد} جنية</div>
                <div>إجمالي المنصرف: {data.summary.totalمنصرف} جنية</div>
                <div>الصافي: {data.summary.netAmount} جنية</div>
              </CardContent>
            </Card>

            {/* الجدول */}
            <Card dir="rtl" className="bg-white">
              <CardHeader>
                <CardTitle>تفاصيل الإحصائيات</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">إجمالي الوارد</TableHead>
                      <TableHead className="text-right">إجمالي المنصرف</TableHead>
                      <TableHead className="text-right">الصافي</TableHead>
                      <TableHead className="text-right">عدد العناصر</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.statistics.map((item) => (
                      <TableRow key={item.productId || Math.random()}>
                        <TableCell>{item.totalوارد}</TableCell>
                        <TableCell>{item.totalمنصرف}</TableCell>
                        <TableCell>{item.netAmount}</TableCell>
                        <TableCell>{item.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* الرسم البياني */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>الرسم البياني للإجمالي حسب المنتج</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer id="statistics-chart" config={chartConfig}>
                  {data.statistics.length > 0 ? (
                    <Recharts.BarChart
                      width={600}
                      height={300}
                      data={data.statistics}
                      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    >
                      <Recharts.XAxis dataKey="productName" />
                      <Recharts.YAxis />
                      <Recharts.Bar dataKey="totalوارد" fill="#4f46e5" />
                      <Recharts.Bar dataKey="totalمنصرف" fill="#f43f5e" />
                      <Recharts.Bar dataKey="netAmount" fill="#10b981" />
                      <Recharts.Tooltip content={<ChartTooltipContent />} />
                      <Recharts.Legend content={<ChartLegendContent />} />
                    </Recharts.BarChart>
                  ) : (
                    <div>لا توجد بيانات لعرض الرسم البياني</div>
                  )}
                </ChartContainer>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StatisticsPage;
