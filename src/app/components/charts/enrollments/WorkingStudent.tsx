import { useEffect, useState } from "react";
import { Pie, PieChart, Legend } from "recharts";

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
} from "@/components/ui/chart";

interface ChartDataItem {
  status: string;
  count: number;
  fill: string;
}

const chartConfig = {
  count: {
    label: "Students",
  },
  Yes: {
    label: "Working Students",
    color: "hsl(var(--chart-1))",
  },
  No: {
    label: "Non-Working Students",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface WorkingStudentProps {
  selectedCollege: string;
}

// Custom tooltip content component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const status = data.status === 'Yes' ? 'Working' : 'Non-Working';
    const count = data.count;
    return (
      <div className="bg-background/95 p-2 rounded-md border shadow-sm">
        <p className="text-sm font-medium">{status}</p>
        <p className="text-sm text-muted-foreground">{count} students</p>
      </div>
    );
  }
  return null;
};

export function WorkingStudent({ selectedCollege }: WorkingStudentProps) {
  const [data, setData] = useState<ChartDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/working-student?college=${encodeURIComponent(selectedCollege)}`
        );
        if (!response.ok) throw new Error('Failed to fetch data');
        const chartData = await response.json();
        setData(chartData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCollege]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Working Student Distribution</CardTitle>
        <CardDescription>
          {selectedCollege === 'All Colleges' 
            ? 'All Colleges' 
            : `College of ${selectedCollege}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] px-0"
        >
          <PieChart>
            <ChartTooltip content={<CustomTooltip />} />
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              labelLine={false}
              label={({ payload, ...props }: any) => {
                if (!payload || !payload.count) return null;
                const percentage = ((payload.count / total) * 100).toFixed(1);
                return (
                  <text
                    cx={props.cx}
                    cy={props.cy}
                    x={props.x}
                    y={props.y}
                    textAnchor={props.textAnchor}
                    dominantBaseline={props.dominantBaseline}
                    fill="hsla(var(--foreground))"
                    fontSize="12"
                  >
                    {`${percentage}%`}
                  </text>
                );
              }}
            />
            <Legend 
              formatter={(value) => (value === 'Yes' ? 'Working' : 'Non-Working')}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Total Students: {total}
        </div>
      </CardFooter>
    </Card>
  );
}

export default WorkingStudent;