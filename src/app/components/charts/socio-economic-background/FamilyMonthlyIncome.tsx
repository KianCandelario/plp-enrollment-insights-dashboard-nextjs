"use client"

import { useEffect, useState } from "react"
import { BarChart2Icon } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
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

const chartConfig = {
  students: {
    label: "students",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

interface FamilyMonthlyIncomeProps {
  selectedCollege: string;
}

export function FamilyMonthlyIncome({ selectedCollege }: FamilyMonthlyIncomeProps) {
  const [chartData, setChartData] = useState<Array<{ month: string; students: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/family-monthly-income?college=${encodeURIComponent(selectedCollege)}`);
        const result = await response.json();
        
        if (result.success) {
          setChartData(result.data);
        } else {
          setError(result.error || 'Failed to fetch data');
        }
      } catch (err) {
        setError('Failed to fetch family monthly income data');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedCollege]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Family Monthly Income</CardTitle>
        <CardDescription className="flex items-center">
          <BarChart2Icon className="mr-1 h-4 w-4" />
          Illustrates the financial backgrounds of the enrollees
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-52 items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Loading data...</div>
          </div>
        ) : error ? (
          <div className="flex h-52 items-center justify-center text-destructive">
            {error}
          </div>
        ) : (
          <ChartContainer className="h-60 w-full" config={chartConfig}>
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
                height={35}
                tick={<CustomTick x={0} y={0} payload={{
                  value: ""
                }} />}
                interval={0}
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
        )}
      </CardContent>
    </Card>
  )
}

interface CustomTickProps {
  x: number;
  y: number;
  payload: {
    value: string;
  };
}

const CustomTick: React.FC<CustomTickProps> = ({ x, y, payload }) => {
  const words = payload.value.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  words.forEach((word) => {
    if (currentLine.length + word.length > 13) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine += currentLine.length ? ` ${word}` : word;
    }
  });
  lines.push(currentLine);

  return (
    <g transform={`translate(${x},${y})`}>
      {lines.map((line, index) => (
        <text
          key={index}
          dy={index * 12}
          textAnchor="middle"
          fontSize={12}
          className="fill-muted-foreground"
        >
          {line}
        </text>
      ))}
    </g>
  );
};