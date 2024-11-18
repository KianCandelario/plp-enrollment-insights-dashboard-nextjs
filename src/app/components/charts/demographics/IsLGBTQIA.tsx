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
  value: {
    label: "Students",
  },
  "LGBTQIA+": {
    label: "LGBTQIA+",
    color: "hsl(var(--chart-1))",
  },
  "Non-LGBTQIA+": {
    label: "Non-LGBTQIA+",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

interface IsLGBTQIAProps {
  selectedCollege: string;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const total = payload[0].payload.total;
    const percentage = ((data.value / total) * 100).toFixed(1);
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="font-medium">{data.category}</div>
        <div className="text-sm text-muted-foreground">
          {data.value.toLocaleString()} ({percentage}%)
        </div>
      </div>
    );
  }
  return null;
};

export function IsLGBTQIA({ selectedCollege }: IsLGBTQIAProps) {
  const [chartData, setChartData] = useState<Array<{ category: string; value: number; fill: string; total: number }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const queryParams = new URLSearchParams({ college: selectedCollege })
        const response = await fetch(`/api/is-lgbtqia?${queryParams.toString()}`)
        if (!response.ok) throw new Error('Failed to fetch data')
        
        const data = await response.json()
        const transformedData = data.map((item: any) => ({
          category: item.category === 'Yes' ? 'LGBTQIA+' : 'Non-LGBTQIA+',
          value: item.value,
          fill: item.category === 'Yes' ? 'hsl(var(--chart-1))' : 'hsl(var(--chart-2))',
          total: data.reduce((sum: number, d: any) => sum + d.value, 0)
        }))
        setChartData(transformedData)
        setTotal(transformedData[0].total)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
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
        <CardTitle>LGBTQIA+ Distribution</CardTitle>
        <CardDescription>
          {selectedCollege === "All Colleges" ? "All Colleges" : selectedCollege}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {isLoading ? (
          <div className="flex h-[270px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[270px] px-0"
          >
            <PieChart>
              <ChartTooltip content={<CustomTooltip />} />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="category"
                labelLine={false}
                label={({ payload, ...props }) => (
                  <text
                    {...props}
                    fill="hsla(var(--foreground))"
                    textAnchor={props.textAnchor}
                    dominantBaseline={props.dominantBaseline}
                  >
                    {payload.value}
                  </text>
                )}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
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

export default IsLGBTQIA;