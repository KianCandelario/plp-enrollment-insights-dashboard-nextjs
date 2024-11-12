"use client"

import { useEffect, useState } from 'react'
import { BarChart2Icon } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, Cell } from "recharts"

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

interface EnrollmentData {
  program: string;
  enrollees: number;
}

interface AcademicProgramEnrollmentProps {
  selectedCollege: string;
}

const chartConfig = {
  enrollees: {
    label: "Enrollees",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function AcademicProgramEnrollment({ selectedCollege }: AcademicProgramEnrollmentProps) {
  const [chartData, setChartData] = useState<EnrollmentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/enrollment-data${selectedCollege !== "All Colleges" ? `?college=${encodeURIComponent(selectedCollege)}` : ''}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received');
        }

        // Process the data to count enrollees per program
        const programCounts: { [key: string]: number } = {};
        data.forEach((student: any) => {
          if (student?.course) {
            programCounts[student.course] = (programCounts[student.course] || 0) + 1;
          }
        });

        // Convert to chart format and sort by enrollee count
        const formattedData = Object.entries(programCounts)
          .map(([program, count]) => ({
            program,
            enrollees: count
          }))
          .sort((a, b) => b.enrollees - a.enrollees);

        setChartData(formattedData);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Remove selectedCollege dependency since we're always fetching all data

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Number of Enrollment per Curricular Program</CardTitle>
        </CardHeader>
        <CardContent className="h-72 flex items-center justify-center">
          <span className="text-muted-foreground">Loading data...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Number of Enrollment per Curricular Program</CardTitle>
        </CardHeader>
        <CardContent className="h-72 flex items-center justify-center">
          <span className="text-destructive">Error: {error}</span>
        </CardContent>
      </Card>
    );
  }

  if (!chartData.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Number of Enrollment per Curricular Program</CardTitle>
        </CardHeader>
        <CardContent className="h-72 flex items-center justify-center">
          <span className="text-muted-foreground">No data available</span>
        </CardContent>
      </Card>
    );
  }

  const getBarColor = (program: string) => {
    return program === selectedCollege 
      ? "hsl(var(--primary))" // Highlight color for selected college
      : "hsl(var(--primary) / 0.5)" // Muted color for other colleges
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Number of Enrollment per Curricular Program</CardTitle>
        <CardDescription className="flex items-center">
          <BarChart2Icon className="h-4 w-4 mr-1" /> 
          Enrollees for Every Curricular Program
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-72 w-full" config={chartConfig}>
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="program"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              interval={0}
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(value) => value.slice(0, 15) + (value.length > 15 ? '...' : '')}
            />
            <ChartTooltip
              cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Program
                          </span>
                          <span className="font-bold text-sm">
                            {payload[0].payload.program}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Enrollees
                          </span>
                          <span className="font-bold text-sm">
                            {payload[0].value}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar 
              dataKey="enrollees" 
              radius={[4, 4, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getBarColor(entry.program)}
                />
              ))}
              <LabelList
                dataKey="enrollees"
                position="top"
                offset={5}
                fill="hsl(var(--foreground))"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default AcademicProgramEnrollment;