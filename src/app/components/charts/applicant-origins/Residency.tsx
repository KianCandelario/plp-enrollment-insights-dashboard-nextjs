"use client"

import * as React from "react"
import { PieChartIcon } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

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

export const description = "A donut chart with text"

const chartData = [
  { residency: "Pasig", population: 3702, fill: "var(--color-pasig)" },
  { residency: "Non-Pasig", population: 250, fill: "var(--color-nonpasig)" },
]

const chartConfig = {
  population: {
    label: "population",
  },
  pasig: {
    label: "pasig",
    color: "hsl(var(--chart-1))",
  },
  nonpasig: {
    label: "nonpasig",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function Residency() {
  const totalpopulation = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.population, 0)
  }, [])

  return (
    <Card className="flex flex-col w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Residency</CardTitle>
        <CardDescription className="flex items-center"><PieChartIcon className="mr-1 h-4 w-4" /> Pasigueno or Non-Pasigueno</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="population"
              nameKey="residency"
              innerRadius={60}
              strokeWidth={5}
            >
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
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalpopulation.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Population
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
