"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

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

export const description = "A line chart with dots"

const chartData = [
  { year: "2016", enrollments: 186 },
  { year: "2017", enrollments: 305 },
  { year: "2018", enrollments: 237 },
  { year: "2019", enrollments: 120 },
  { year: "2020", enrollments: 209 },
  { year: "2021", enrollments: 214 },
  { year: "2022", enrollments: 214 },
  { year: "2023", enrollments: 214 },
  { year: "2024", enrollments: 300 },
]

const chartConfig = {
  enrollments: {
    label: "enrollments",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function YearlyTrend() {
  return (
    <Card className="w-[60%]">
      <CardHeader>
        <CardTitle>Yearly Enrollment Trend</CardTitle>
        <CardDescription>2016 - 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-64 w-full" config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 20,
              right: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="enrollments"
              type="natural"
              stroke="var(--color-enrollments)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-enrollments)",
              }}
              activeDot={{
                r: 7,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Enrollment Trend for the last 8 years. <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          
        </div>
      </CardFooter>
    </Card>
  )
}
