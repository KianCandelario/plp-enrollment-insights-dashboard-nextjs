import { BarChart2Icon } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, Legend } from "recharts";
import { useEffect, useState } from "react";

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

interface ApplicantEnrolleeData {
  academic_year: string;
  applicant_count: number;
  enrollee_count: number;
}

const chartConfig: ChartConfig = {
  enrollees: {
    label: "Enrollees",
    color: "hsl(var(--chart-1))",
  },
  applicants: {
    label: "Applicants",
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

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex justify-center gap-6 text-sm mt-2">
        {payload?.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="w-[40%]">
      <CardHeader>
        <CardTitle>Applicant-to-Enrollee Correlation</CardTitle>
        <CardDescription>
          <span className="flex items-center">
            <BarChart2Icon className="h-4 w-4 mr-1" /> 
            <span>
              Applicant-to-Enrollee Fallout Over the Years
            </span>
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-72 w-full" config={chartConfig}>
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
              name="Enrollees"
              dataKey="enrollee_count"
              stackId="a"
              fill="var(--color-enrollees)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              name="Applicants"
              dataKey="applicant_count"
              stackId="a"
              fill="var(--color-applicants)"
              radius={[4, 4, 0, 0]}
            />
            <Legend content={CustomLegend} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}