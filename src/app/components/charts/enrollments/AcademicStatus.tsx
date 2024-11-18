import React from "react"
import { Pie, PieChart, Legend } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart"

interface StatusData {
  status: string
  count: number
  fill: string
}

const chartConfig = {
  regular: {
    label: "Regular",
    color: "hsl(var(--chart-1))",
  },
  irregular: {
    label: "Irregular",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

interface AcademicStatusProps {
  selectedCollege: string
}

// Custom tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-background/95 p-2 rounded-md border shadow-sm">
        <p className="text-sm font-medium">{data.status}</p>
        <p className="text-sm text-muted-foreground">{data.count} students</p>
      </div>
    )
  }
  return null
}

export function AcademicStatus({ selectedCollege }: AcademicStatusProps) {
  const [data, setData] = React.useState<StatusData[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/academic-status?college=${encodeURIComponent(selectedCollege)}`)
        if (!response.ok) throw new Error('Failed to fetch data')
        const newData = await response.json()
        setData(newData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedCollege])

  if (loading) return <Card className="h-[400px] flex items-center justify-center">Loading...</Card>
  if (error) return <Card className="h-[400px] flex items-center justify-center text-red-500">{error}</Card>

  const total = data.reduce((sum, item) => sum + item.count, 0)

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Academic Status Distribution</CardTitle>
        <CardDescription>
          {selectedCollege === 'All Colleges' ? 'All Colleges' : `${selectedCollege} College`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[280px] px-0"
        >
          <PieChart>
            <ChartTooltip content={<CustomTooltip />} />
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              labelLine={false}
              label={({ payload, ...props }: any) => {
                if (!payload || !payload.count) return null
                const percentage = ((payload.count / total) * 100).toFixed(1)
                return (
                  <text
                    cx={props.cx}
                    cy={props.cy}
                    x={props.x}
                    y={props.y}
                    textAnchor={props.textAnchor}
                    dominantBaseline={props.dominantBaseline}
                    fill="hsla(var(--foreground))"
                    fontSize="12"
                  >
                    {`${percentage}%`}
                  </text>
                );
              }}
            />
            <Legend />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Total Students: {total}
        </div>
      </CardFooter>
    </Card>
  )
}

export default AcademicStatus