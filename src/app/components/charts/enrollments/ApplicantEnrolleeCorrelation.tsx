// ApplicantEnrolleeCorrelation.tsx
"use client";

import { BarChart2Icon } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ApplicantEnrolleeData {
  academic_year: string;
  applicant_count: number;
  enrollee_count: number;
}

const chartConfig: ChartConfig = {
  enrollees: {
    label: "enrollees",
    color: "hsl(var(--chart-1))",
  },
  applicants: {
    label: "applicants",
    color: "hsl(var(--chart-2))",
  },
};

interface ApplicantEnrolleeCorrelationProps {
  course: string;
}

export function ApplicantEnrolleeCorrelation({ course }: ApplicantEnrolleeCorrelationProps) {
  const [chartData, setChartData] = useState<ApplicantEnrolleeData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/applicant-enrollee?courseCode=${course}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setChartData(data.applicantEnrolleeData || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [course]);

  if (isLoading) {
    return (
      <Card className="w-[40%]">
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-[40%]">
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-[40%]">
      <CardHeader>
        <CardTitle>Applicant-to-Enrollee Correlation</CardTitle>
        <CardDescription>2020-2025</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-64 w-full" config={chartConfig}>
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="academic_year"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 4)}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Bar
              dataKey="enrollee_count"
              stackId="a"
              fill="var(--color-enrollees)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="applicant_count"
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
  );
}