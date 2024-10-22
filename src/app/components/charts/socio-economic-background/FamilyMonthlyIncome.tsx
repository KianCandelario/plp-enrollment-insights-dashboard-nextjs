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
  { month: "Less than 9,520", students: 1861 },
  { month: "Between 9,520 to 21,194", students: 1749 },
  { month: "Between 21,195 to 43,838", students: 276 },
  { month: "Between 43,839 to 76,669", students: 39 },
  { month: "Between 76,670 to 131,484", students: 19 },
  { month: "131,485 and up", students: 8 },
]

const chartConfig = {
  students: {
    label: "students",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function FamilyMonthlyIncome() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Family Monthly Income</CardTitle>
        <CardDescription className="flex items-center"><BarChart2Icon className="mr-1 h-4 w-4" />Illustrates the financial backgrounds of the enrollees</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-52 w-full" config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              height={35} // Increase height for ticks
              tick={<CustomTick />}
              interval={0} // Ensure all ticks are shown
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

import React from 'react';

const CustomTick = ({ x, y, payload }: any) => {
  const words = payload.value.split(' '); // Split the label into words
  const lines = [];
  let currentLine = '';

  words.forEach((word: any) => {
    // If the current line plus the new word exceeds a certain length, push the current line and start a new one
    if (currentLine.length + word.length > 13) {
      lines.push(currentLine);
      currentLine = word; // Start new line with the current word
    } else {
      currentLine += currentLine.length ? ` ${word}` : word; // Add the word to the current line
    }
  });
  lines.push(currentLine); // Push the last line

  return (
    <g transform={`translate(${x},${y})`}>
      {lines.map((line, index) => (
        <text key={index} dy={index * 12} textAnchor="middle" fontSize={12}>
          {line}
        </text>
      ))}
    </g>
  );
};
