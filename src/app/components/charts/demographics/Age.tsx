"use client"

import { BarChart2Icon, TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

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

export const description = "A bar chart with a label"

const chartData = [
  { ageGroup: "Less than 18 years old", students: 35 },
  { ageGroup: "18-22 years old", students: 3631 },
  { ageGroup: "23 years old and above", students: 286 },
]

const chartConfig = {
  students: {
    label: "students",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function Age() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Age</CardTitle>
        <CardDescription className="flex items-center"><BarChart2Icon className="mr-1 h-4 w-4" />Age Distribution of the Enrollees</CardDescription>
      </CardHeader>
      <CardContent>
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
              tickFormatter={(value) => value.slice(0, )}
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
      </CardContent>
    </Card>
  )
}