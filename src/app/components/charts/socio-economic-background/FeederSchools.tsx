import React, { useEffect, useState } from "react";
import { PieChartIcon } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  students: {
    label: "students",
  },
  public: {
    label: "public",
    color: "hsl(var(--chart-1))",
  },
  private: {
    label: "private",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface FeederSchoolTypeProps {
  selectedCollege: string;
}

export function FeederSchools({ selectedCollege }: FeederSchoolTypeProps) {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/feeder-school?course=${encodeURIComponent(selectedCollege)}`
        );
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        setChartData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedCollege]);

  const totalStudents = React.useMemo(() => {
    return chartData.reduce((acc: number, curr: any) => acc + curr.students, 0)
  }, [chartData]);

  if (isLoading) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center">
          <CardTitle>Type of Feeder Schools</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center">
          <CardTitle>Type of Feeder Schools</CardTitle>
          <CardDescription className="text-red-500">Error loading data</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Type of Feeder Schools</CardTitle>
        <CardDescription className="flex items-center">
          <PieChartIcon className="mr-1 h-4 w-4" />
          Shows the diversity in student origins by school type.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 overflow-auto">
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
              dataKey="students"
              nameKey="browser"
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
                          {totalStudents.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          students
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="flex justify-center mb-3 mt-1">
          <div className="flex items-center mr-4 text-sm text-black_">
            <div className="w-4 h-4 mr-2 bg-[hsl(var(--chart-1))] rounded"></div>
            <span>Public</span>
          </div>
          <div className="flex items-center text-sm text-black_">
            <div className="w-4 h-4 mr-2 bg-[hsl(var(--chart-2))] rounded"></div>
            <span>Private</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default FeederSchools;