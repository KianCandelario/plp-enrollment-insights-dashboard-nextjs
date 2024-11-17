import { useEffect, useState } from "react"
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"

interface ChartDataItem {
  name: string
  value: number
  count: number
  total: number
  fill: string
}

const chartConfig = {
  value: {
    label: "Dean's Lister Percentage",
  },
  "Dean's Lister": {
    label: "Dean's Lister",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

interface DeansListerProps {
  selectedCollege: string
}

export function DeansLister({ selectedCollege }: DeansListerProps) {
  const [data, setData] = useState<ChartDataItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `/api/deans-lister?college=${encodeURIComponent(selectedCollege)}`
        )
        if (!response.ok) throw new Error('Failed to fetch data')
        const chartData = await response.json()
        setData(chartData)
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

  // Calculate the end angle based on the percentage (360 degrees max)
  const percentage = data[0]?.value || 0
  const endAngle = (percentage / 100) * 360 // Convert percentage to degrees

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Dean's Lister Distribution</CardTitle>
        <CardDescription>
          {selectedCollege === 'All Colleges' ? 'All Colleges' : `${selectedCollege} College`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={data}
            startAngle={90}
            endAngle={90 - endAngle} // Subtract from 90 to make it rotate clockwise from top
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar 
              dataKey="value" 
              background 
              cornerRadius={10}
              animationDuration={1000}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {percentage.toFixed(1)}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Dean's Listers
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          {data[0]?.count.toLocaleString()} out of {data[0]?.total.toLocaleString()} total students
        </div>
      </CardFooter>
    </Card>
  )
}

export default DeansLister