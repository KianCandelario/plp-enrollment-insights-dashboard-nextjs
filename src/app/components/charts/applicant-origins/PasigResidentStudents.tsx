"use client"

import * as React from "react"
import { BarChart2 } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface BarangayData {
  students: number
  barangay: string
}

const chartConfig = {
  students: {
    label: "students",
    color: "hsl(var(--chart-1))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig

interface PasigResidentStudentsProps {
  selectedCollege: string;
}

export function PasigResidentStudents({ selectedCollege }: PasigResidentStudentsProps) {
  const [chartData, setChartData] = React.useState<BarangayData[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/pasig-barangay?college=${encodeURIComponent(selectedCollege)}`)
        if (!response.ok) throw new Error('Failed to fetch data')
        const data: BarangayData[] = await response.json()
        setChartData(data)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError("An unexpected error occurred")
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [selectedCollege])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading data: {error}</div>

  // Calculate dynamic height based on number of items
  const itemHeight = 35 // height per bar in pixels
  const totalHeight = Math.max(chartData.length * itemHeight, 400) // minimum height of 400px

  return (
    <Card className="flex flex-col w-full">
      <CardHeader>
        <CardTitle>Pasigueño Students</CardTitle>
        <CardDescription className="flex items-center">
          <BarChart2 className="mr-1 h-4 w-4" />Distribution of Pasig local students
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {/* Scrollable container */}
        <div className="overflow-y-auto max-h-64">
          <div style={{ height: `${totalHeight}px` }}>
            <ChartContainer className="w-full h-full" config={chartConfig}>
              <BarChart
                accessibilityLayer
                data={chartData}
                layout="vertical"
                margin={{
                  left: -20,
                  right: 50, // Added right margin for labels
                }}
                height={totalHeight}
              >
                <CartesianGrid horizontal={false} />
                <YAxis
                  dataKey="barangay"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  width={140}
                />
                <XAxis 
                  dataKey="students" 
                  type="number"
                  hide 
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Bar
                  dataKey="students"
                  layout="vertical"
                  fill="var(--color-students)"
                  radius={5}
                >
                  <LabelList 
                    dataKey="students" 
                    position="right" 
                    fill="hsl(var(--foreground))"
                    formatter={(value: number) => value.toLocaleString()}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}