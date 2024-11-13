import { useEffect, useState } from 'react';
import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Legend } from "recharts";
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

// Define a type for the API data structure
type ApiEnrollmentRecord = {
  year: number;
  isActual: boolean;
  enrollment: number;
  lowerBound: number;
  upperBound: number;
};

// Define a type for the transformed data
type EnrollmentRecord = {
  year: string;
  actualEnrollment: number | null;
  forecastEnrollment: number | null;
  lowerBound: number;
  upperBound: number;
};

const chartConfig = {
  actual: {
    label: "Actual Enrollment",
    color: "hsl(var(--chart-1))",
  },
  forecast: {
    label: "Forecast",
    color: "hsl(var(--chart-2))",
  },
  bounds: {
    label: "Confidence Bounds",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

interface YearlyTrendProps {
  courseCode: string;
}

export function YearlyTrend({ courseCode = 'GRAND_TOTAL' }: YearlyTrendProps) {
  const [enrollmentData, setEnrollmentData] = useState<EnrollmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Selected courseCode:', courseCode); // Debug log
        
        const response = await fetch(`/api/enrollments?courseCode=${encodeURIComponent(courseCode)}`);
        if (!response.ok) throw new Error(`Failed to fetch data: ${response.statusText}`);
        
        const data: ApiEnrollmentRecord[] = await response.json();
        console.log('Received data for courseCode:', courseCode, data); // Detailed debug log
        
        const transformedData: EnrollmentRecord[] = data.map((item) => ({
          year: item.year.toString(),
          actualEnrollment: item.isActual ? item.enrollment : null,
          forecastEnrollment: !item.isActual ? item.enrollment : null,
          lowerBound: item.lowerBound,
          upperBound: item.upperBound,
        }));
        
        setEnrollmentData(transformedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [courseCode]); // Add courseCode as dependency

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  const yearRange = `${enrollmentData[0]?.year} - ${enrollmentData[enrollmentData.length - 1]?.year}`;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Yearly Enrollment Trend</CardTitle>
        <CardDescription>{yearRange}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-64 w-full" config={chartConfig}>
          <LineChart
            data={enrollmentData}
            margin={{
              left: 20,
              right: 20,
              top: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
            />
            {/* Historical data line */}
            <Line
              dataKey="actualEnrollment"
              name="Actual"
              stroke="var(--color-actual)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-actual)",
                r: 4,
              }}
              activeDot={{
                r: 6,
              }}
            />
            {/* Forecast line */}
            <Line
              dataKey="forecastEnrollment"
              name="Forecast"
              stroke="var(--color-forecast)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{
                fill: "var(--color-forecast)",
                r: 4,
              }}
            />
            {/* Confidence bounds */}
            <Line
              dataKey="upperBound"
              name="Upper Bound"
              stroke="var(--color-bounds)"
              strokeWidth={1}
              dot={false}
              strokeDasharray="3 3"
              opacity={0.5}
            />
            <Line
              dataKey="lowerBound"
              name="Lower Bound"
              stroke="var(--color-bounds)"
              strokeWidth={1}
              dot={false}
              strokeDasharray="3 3"
              opacity={0.5}
            />
            <Legend />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Enrollment Trend Analysis <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing historical data and forecasted values with confidence bounds
        </div>
      </CardFooter>
    </Card>
  );
}
