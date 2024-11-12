"use client"

import * as React from "react"
import { BarChart2 } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

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

// Define the type for items in chartData
interface NonPasigResidentData {
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

interface NonPasigResidentStudentsProps {
  selectedCollege: string;
}

export function NonPasigResidentStudents({ selectedCollege }: NonPasigResidentStudentsProps) {
  const [chartData, setChartData] = React.useState<NonPasigResidentData[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/non-pasig-residents?college=${encodeURIComponent(selectedCollege)}`)
        if (!response.ok) throw new Error('Failed to fetch data')
        const data: NonPasigResidentData[] = await response.json()
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
  const itemHeight = 30 // height per bar in pixels
  const totalHeight = Math.max(chartData.length * itemHeight, 400) // minimum height of 400px

  return (
    <Card className="flex flex-col w-full">
      <CardHeader>
        <CardTitle>Non-Pasig Resident Students</CardTitle>
        <CardDescription className="flex items-center">
          <BarChart2 className="mr-1 h-4 w-4" /> Enrollees from outside Pasig
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
                  width={120}
                />
                <XAxis dataKey="students" type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Bar
                  dataKey="students"
                  layout="vertical"
                  fill="var(--color-students)"
                  radius={5}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
