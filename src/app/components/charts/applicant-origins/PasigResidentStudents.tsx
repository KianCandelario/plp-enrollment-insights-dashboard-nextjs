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
  { barangay: "Pinagbuhatan", students: 918 },
  { barangay: "Manggahan", students: 353 },
  { barangay: "Maybunga", students: 277 },
  { barangay: "Rosario", students: 215 },
  { barangay: "San Miguel", students: 212},
  { barangay: "Kapitolyo", students: 27 },
  { barangay: "Sta. Rosa", students: 20},
]

// Sort the chartData array in ascending order based on the number of students
const sortedChartData = chartData.sort((a, b) => b.students - a.students);

const chartConfig = {
  students: {
    label: "students",
    color: "hsl(var(--chart-1))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig

export function PasigResidentStudents() {
  return (
    <Card className="flex flex-col w-full">
      <CardHeader>
        <CardTitle>Pasigueño Students</CardTitle>
        <CardDescription className="flex items-center"><BarChart2 className="mr-1 h-4 w-4" />Distribution of Pasig local students</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 w-full">
        <ChartContainer className="w-full" config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={sortedChartData} // Use the sorted data
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
      {/* Make CardFooter take no space */}
      <CardFooter className="hidden" />
    </Card>
  )
}
