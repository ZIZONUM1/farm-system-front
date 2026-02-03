import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Import from your shadcn Chart file
import { ChartContainer, ChartTooltipContent, ChartLegendContent } from "@/components/ui/chart"

type StatisticItem = {
  productId: string | null
  productName?: string
  totalAmount: number
  count: number
  averageAmount: number
}

type StatisticsResponse = {
  period: "month" | "year"
  year: string
  month?: string
  transactionType: "وارد" | "منصرف"
  productId: string | null
  statistics: StatisticItem[]
  summary: {
    totalCount: number
    grandTotal: number
    averagePerItem: number
  }
}

const StatisticsPage = () => {
  const [period, setPeriod] = useState<"month" | "year">("month")
  const [year, setYear] = useState<string>(new Date().getFullYear().toString())
  const [month, setMonth] = useState<string>((new Date().getMonth() + 1).toString().padStart(2, "0"))
  const [transactionType, setTransactionType] = useState<"وارد" | "منصرف">("وارد")
  const [productId, setProductId] = useState<string>("")

  const [data, setData] = useState<StatisticsResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  const fetchStatistics = async () => {
    try {
      setLoading(true)
      setError("")

      const params: any = { period, year, transactionType }
      if (period === "month") params.month = month
      if (productId) params.productId = productId

      const res = await axios.get("http://localhost:5000/api/v1/actions/getStatistics", { params })
      setData(res.data.data)
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "حدث خطأ ما")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatistics()
  }, [])

  return (
    <div className="p-6 space-y-6 rtl">
      {/* فلترة */}
      <Card>
        <CardHeader>
          <CardTitle>تصفية الإحصائيات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Select value={period} onValueChange={(val) => setPeriod(val as "month" | "year")}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="اختر الفترة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">شهر</SelectItem>
                <SelectItem value="year">سنة</SelectItem>
              </SelectContent>
            </Select>

            <Input type="number" className="w-24" value={year} onChange={(e) => setYear(e.target.value)} placeholder="السنة" />

            {period === "month" && (
              <Input type="number" className="w-24" value={month} onChange={(e) => setMonth(e.target.value)} placeholder="الشهر (1-12)" />
            )}

            <Select value={transactionType} onValueChange={(val) => setTransactionType(val as "وارد" | "منصرف")}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="نوع العملية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="وارد">وارد</SelectItem>
                <SelectItem value="منصرف">منصرف</SelectItem>
              </SelectContent>
            </Select>

            <Input placeholder="معرف المنتج (اختياري)" className="w-40" value={productId} onChange={(e) => setProductId(e.target.value)} />

            <Button onClick={fetchStatistics} className="h-10 mt-1">{loading ? "جارٍ التحميل..." : "جلب الإحصائيات"}</Button>
          </div>
        </CardContent>
      </Card>

      {error && <div className="text-red-600">{error}</div>}

      {data && (
        <>
          {/* الملخص */}
          <Card>
            <CardHeader>
              <CardTitle>الملخص</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>إجمالي المنتجات: {data.summary.totalCount}</div>
              <div>الإجمالي الكلي: {data.summary.grandTotal}</div>
              <div>المتوسط لكل عنصر: {data.summary.averagePerItem}</div>
            </CardContent>
          </Card>

          {/* الرسم البياني */}
          <Card>
            <CardHeader>
              <CardTitle>الرسم البياني للإجمالي حسب المنتج</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                id="statistics-chart"
                config={{
                  totalAmount: { label: "الإجمالي" },
                  count: { label: "عدد العناصر" },
                  averageAmount: { label: "المتوسط" },
                }}
              >
                {data.statistics.length > 0 ? (
                  <Recharts.BarChart width={600} height={300} data={data.statistics} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <Recharts.XAxis dataKey="productName" />
                    <Recharts.YAxis />
                    <Recharts.Bar dataKey="totalAmount" fill="#4f46e5" />
                    <Recharts.Tooltip content={<ChartTooltipContent />} />
                    <Recharts.Legend content={<ChartLegendContent />} />
                  </Recharts.BarChart>
                ) : (
                  <div>لا توجد بيانات لعرض الرسم البياني</div>
                )}
              </ChartContainer>
            </CardContent>
          </Card>

          {/* الجدول */}
          <Card>
            <CardHeader>
              <CardTitle>تفاصيل الإحصائيات</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>معرف المنتج</TableHead>
                    <TableHead>اسم المنتج</TableHead>
                    <TableHead>الإجمالي</TableHead>
                    <TableHead>عدد العناصر</TableHead>
                    <TableHead>المتوسط</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.statistics.map((item) => (
                    <TableRow key={item.productId || Math.random()}>
                      <TableCell>{item.productId || "-"}</TableCell>
                      <TableCell>{item.productName || "-"}</TableCell>
                      <TableCell>{item.totalAmount}</TableCell>
                      <TableCell>{item.count}</TableCell>
                      <TableCell>{item.averageAmount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

export default StatisticsPage
