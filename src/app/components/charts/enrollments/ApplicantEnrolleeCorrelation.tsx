"use client"

import { BarChart2Icon } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A stacked bar chart with a legend"

const chartData = [
    { year: "2020-2021", enrollees: 230, applicants: 300 },
    { year: "2021-2022", enrollees: 205, applicants: 270 },
    { year: "2022-2023", enrollees: 220, applicants: 317 },
    { year: "2023-2024", enrollees: 240, applicants: 330 },
    { year: "2024-2025", enrollees: 186, applicants: 200 },
  ]

const chartConfig = {
  enrollees: {
    label: "enrollees",
    color: "hsl(var(--chart-1))",
  },
  applicants: {
    label: "applicants",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function ApplicantEnrolleeCorrelation() {
  return (
    <Card className="w-[40%]">
      <CardHeader>
        <CardTitle>Applicant-to-Enrollee Correlation</CardTitle>
        <CardDescription>2020-2025</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-64 w-full" config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, )}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Bar
              dataKey="enrollees"
              stackId="a"
              fill="var(--color-enrollees)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="applicants"
              stackId="a"
              fill="var(--color-applicants)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none items-center">
            Applicant-to-Enrollee Fallout Over the Last 5 Years <BarChart2Icon className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  )
}
