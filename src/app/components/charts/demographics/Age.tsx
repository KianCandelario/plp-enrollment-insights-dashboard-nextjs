import { useEffect, useState } from "react"
import { BarChart2Icon } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

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

const chartConfig = {
  students: {
    label: "students",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

interface AgeData {
  ageGroup: string;
  students: number;
}

interface AgeProps {
  selectedCollege: string;
}

export function Age({ selectedCollege }: AgeProps) {
  const [chartData, setChartData] = useState<AgeData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/age-distribution?college=${encodeURIComponent(selectedCollege)}`)
        if (!response.ok) throw new Error('Failed to fetch data')
        const data = await response.json()
        setChartData(data)
      } catch (error) {
        console.error('Error fetching age distribution:', error)
        setError('Failed to load age distribution data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedCollege])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Age</CardTitle>
        <CardDescription className="flex items-center">
          <BarChart2Icon className="mr-1 h-4 w-4" />
          Age Distribution of the Enrollees
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-44 items-center justify-center">
            Loading...
          </div>
        ) : error ? (
          <div className="flex h-44 items-center justify-center text-destructive">
            {error}
          </div>
        ) : (
          <ChartContainer className="h-44 w-full" config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                top: 20,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="ageGroup"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 20) + (value.length > 20 ? '...' : '')}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="students" fill="var(--color-students)" radius={8}>
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

export default Age