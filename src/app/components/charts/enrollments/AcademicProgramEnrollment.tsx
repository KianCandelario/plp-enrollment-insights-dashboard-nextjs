"use client"

import { BarChart2Icon } from "lucide-react"
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

// Original chartData array
const chartData = [
  { program: "BSHM", enrollees: 705 },
  { program: "BSIT", enrollees: 650 },
  { program: "BSBA", enrollees: 624 },
  { program: "BSN", enrollees: 396 },
  { program: "BSA", enrollees: 310 },
  { program: "BS Entrep", enrollees: 270 },
  { program: "BEEd", enrollees: 231 },
  { program: "BSEd - Fil", enrollees: 225 },
  { program: "BSEd - Eng", enrollees: 214 },
  { program: "BSECE", enrollees: 168 },
  { program: "ABPsych", enrollees: 136 },
  { program: "BSCS", enrollees: 135 },
  { program: "BSEd - Math", enrollees: 84 },
]

// Sort the chartData in ascending order based on the number of enrollees
const sortedChartData = chartData.sort((a, b) => b.enrollees - a.enrollees);

const chartConfig = {
  enrollees: {
    label: "enrollees",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function AcademicProgramEnrollment() {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Number of Enrollment per Curricular Program</CardTitle>
        <CardDescription className="flex items-center"><BarChart2Icon className="h-4 w-4 mr-1" /> Enrollees for Every Curricular Program </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-72 w-full" config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={sortedChartData} // Use the sorted data
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="program"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, )}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="enrollees" fill="var(--color-enrollees)" radius={8}>
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
