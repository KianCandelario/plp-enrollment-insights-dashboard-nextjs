"use client"

import { BarChart2 } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

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

export const description = "A bar chart with a custom label"

const chartData = [
  { barangay: "Cainta", students: 64},
  { barangay: "Taytay", students: 57},
  { barangay: "Taguig City", students: 54},
  { barangay: "Pateros", students: 34},
  { barangay: "Antipolo", students: 11},
  { barangay: "Marikina City", students: 4},
  { barangay: "Binangonan", students: 3}
]

const chartConfig = {
  students: {
    label: "students",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig

export function NonPasigResidentStudents() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Non-Pasig Resident Students</CardTitle>
        <CardDescription className="flex items-center"><BarChart2 className="mr-1 h-4 w-4" /> Enrollees from outside Pasig</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="barangay"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
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
              radius={4}
            >
              <LabelList
                dataKey="barangay"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              />
              <LabelList
                dataKey="students"
                position="right"
                offset={8}
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
