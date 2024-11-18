import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { Pie, PieChart, Legend } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart"

const chartConfig = {
  count: {
    label: "Students",
  },
  Yes: {
    label: "PWD",
    color: "hsl(var(--chart-1))",
  },
  No: {
    label: "Non-PWD",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

interface IsPWDProps {
  selectedCollege: string;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const total = payload[0].payload.total;
    const percentage = ((data.count / total) * 100).toFixed(1);
    const label = data.status === "Yes" ? "PWD" : "Non-PWD";
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="font-medium">{label}</div>
        <div className="text-sm text-muted-foreground">
          {data.count.toLocaleString()} ({percentage}%)
        </div>
      </div>
    );
  }
  return null;
};

export function IsPWD({ selectedCollege }: IsPWDProps) {
  const [pwdData, setPwdData] = useState<Array<{ status: string; count: number; fill: string; total: number }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/is-pwd?college=${encodeURIComponent(selectedCollege)}`)
        if (!response.ok) throw new Error('Failed to fetch data')
        
        const data = await response.json()
        const totalCount = data.reduce((acc: number, curr: { count: number }) => acc + curr.count, 0)
        const transformedData = data.map((item: any) => ({
          ...item,
          fill: item.status === 'Yes' ? 'hsl(var(--chart-1))' : 'hsl(var(--chart-2))',
          total: totalCount
        }))
        setPwdData(transformedData)
        setTotal(totalCount)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedCollege])

  if (error) {
    return (
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="text-red-500">Error Loading Data</CardTitle>
        </CardHeader>
        <CardContent>{error}</CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>PWD Distribution</CardTitle>
        <CardDescription>
          {selectedCollege === "All Colleges" ? "All Colleges" : selectedCollege}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {loading ? (
          <div className="flex h-[270px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square w-full max-h-[270px] px-0"
          >
            <PieChart>
              <ChartTooltip content={<CustomTooltip />} />
              <Pie
                data={pwdData}
                dataKey="count"
                nameKey="status"
                labelLine={false}
                label={({ payload, ...props }) => (
                  <text
                    {...props}
                    fill="hsla(var(--foreground))"
                    textAnchor={props.textAnchor}
                    dominantBaseline={props.dominantBaseline}
                  >
                    {payload.count}
                  </text>
                )}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => {
                  return value === "Yes" ? "PWD" : "Non-PWD";
                }}
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Total Students: {total.toLocaleString()}
        </div>
      </CardFooter>
    </Card>
  )
}

export default IsPWD;