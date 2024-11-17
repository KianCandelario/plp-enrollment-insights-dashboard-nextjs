"use client"

import { useEffect, useState } from "react"
import { TrendingUp, Loader2 } from "lucide-react"
import { Pie, PieChart } from "recharts"

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
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  value: {
    label: "Count",
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

interface ChartDataItem {
  category: string;
  value: number;
  fill: string;
}

const transformData = (data: ChartDataItem[]) => {
  return data.map(item => ({
    ...item,
    category: item.category === 'Yes' ? 'LGBTQIA+' : 'Non-LGBTQIA+'
  }));
};

export function IsLGBTQIA({ selectedCollege }: IsLGBTQIAProps) {
  const [chartData, setChartData] = useState<ChartDataItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const queryParams = new URLSearchParams()
        if (selectedCollege) {
          queryParams.set('college', selectedCollege)
        }
        
        const response = await fetch(`/api/is-lgbtqia?${queryParams.toString()}`)
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        
        const data = await response.json()
        const transformedData = transformData(data)
        setChartData(transformedData)
        
        const newTotal = transformedData.reduce((sum: number, item: ChartDataItem) => sum + item.value, 0)
        setTotal(newTotal)
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
          <CardTitle>LGBTQIA+ Distribution</CardTitle>
          <CardDescription className="text-red-500">Error: {error}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="mt-2">Loading data...</p>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>LGBTQIA+ Distribution</CardTitle>
        <CardDescription>
          {selectedCollege === 'All Colleges' ? 'All Colleges' : selectedCollege}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] px-0"
        >
          <PieChart>
            <ChartTooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  const percentage = ((data.value / total) * 100).toFixed(1);
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="flex flex-col">
                        <span className="font-medium">{data.category}</span>
                        <span>{data.value.toLocaleString()} students</span>
                        <span>{percentage}%</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="category"
              labelLine={true}
              label={({ cx, cy, midAngle, innerRadius, outerRadius, value, percent, name }) => {
                const RADIAN = Math.PI / 180;
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);

                const labelRadius = outerRadius * 1.1;
                const labelX = cx + labelRadius * Math.cos(-midAngle * RADIAN);
                const labelY = cy + labelRadius * Math.sin(-midAngle * RADIAN);

                return (
                  <>
                    <text
                      x={x}
                      y={y}
                      fill="hsla(var(--foreground))"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {value.toLocaleString()}
                    </text>
                    <text
                      x={labelX}
                      y={labelY}
                      fill="hsla(var(--foreground))"
                      textAnchor={midAngle < -90 || midAngle >= 90 ? "end" : "start"}
                      dominantBaseline="middle"
                      fontSize="12"
                    >
                      {`${(percent * 100).toFixed(1)}%`}
                    </text>
                  </>
                );
              }}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: 'hsl(var(--chart-1))' }} />
            <span>LGBTQIA+</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: 'hsl(var(--chart-2))' }} />
            <span>Non-LGBTQIA+</span>
          </div>
        </div>
        <div className="flex items-center gap-2 font-medium leading-none">
          Total Students: {total.toLocaleString()}
        </div>
        <div className="leading-none text-muted-foreground">
          Distribution of LGBTQIA+ and Non-LGBTQIA+ Students
        </div>
      </CardFooter>
    </Card>
  )
}

export default IsLGBTQIA;