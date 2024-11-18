"use client"

import { useEffect, useState } from 'react'
import { BarChart2Icon, Loader2 } from "lucide-react"
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
        
        const queryParams = new URLSearchParams();
        // Now we always fetch all data, regardless of selected college
        
        const response = await fetch(`/api/enrollment-data?${queryParams.toString()}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received');
        }

        // Process the data to count enrollees per program
        const programCounts: { [key: string]: number } = {};
        data.forEach((student: { curricularProgram: string }) => {
          if (student?.curricularProgram) {
            programCounts[student.curricularProgram] = (programCounts[student.curricularProgram] || 0) + 1;
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
  }, []); // Remove selectedCollege dependency since we always fetch all data

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Number of Enrollment per Curricular Program</CardTitle>
        </CardHeader>
        <CardContent className="h-72 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
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
    // If no college is selected or "All Colleges" is selected, show all bars in primary color
    if (!selectedCollege || selectedCollege === "All Colleges") {
      return "hsl(var(--primary))";
    }
    
    // Highlight bars of selected college with primary color, others with muted color
    return program.startsWith(selectedCollege)
      ? "hsl(var(--primary))"
      : "hsl(var(--muted-foreground) / 0.2)"; // More subtle color for non-selected programs
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Number of Enrollment per Curricular Program</CardTitle>
        <CardDescription className="flex items-center">
          <BarChart2Icon className="h-4 w-4 mr-1" /> 
          {selectedCollege === "All Colleges" 
            ? "Enrollees for Every Curricular Program"
            : `Highlighting Programs for ${selectedCollege}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-80 w-full" config={chartConfig}>
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
              angle={-45}
              textAnchor="end"
              height={60}
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