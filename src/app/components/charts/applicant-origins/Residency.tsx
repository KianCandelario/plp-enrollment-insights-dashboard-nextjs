import * as React from "react"
import { PieChartIcon } from "lucide-react"
import { Label, Pie, PieChart, Cell } from "recharts"

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

interface ResidencyData {
  population: number
  residency: string
}

// Define the chart configuration type with an index signature
type ResidencyChartConfig = {
  [key: string]: {
    label: string;
    color?: string;
  };
}

const chartConfig: ResidencyChartConfig = {
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
}

interface ResidencyProps {
  selectedCollege: string;
}

export function Residency({ selectedCollege }: ResidencyProps) {
  const [chartData, setChartData] = React.useState<ResidencyData[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/residency?college=${encodeURIComponent(selectedCollege)}`)
        if (!response.ok) throw new Error('Failed to fetch data')
        const data: ResidencyData[] = await response.json()
        setChartData(data)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError("An unexpected error occurred")
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [selectedCollege])

  const totalpopulation = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.population, 0)
  }, [chartData])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading data: {error}</div>

  return (
    <Card className="flex flex-col w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Residency</CardTitle>
        <CardDescription className="flex items-center">
          <PieChartIcon className="mr-1 h-4 w-4" /> Pasigueno or Non-Pasigueno
        </CardDescription>
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
              {chartData.map((entry) => (
                <Cell
                  key={entry.residency}
                  fill={chartConfig[entry.residency.toLowerCase()]?.color || "gray"}
                />
              ))}
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
        <div className="flex justify-center mt-1">
          <div className="flex items-center mr-4 text-sm text-black_">
            <div className="w-4 h-4 mr-2 bg-[hsl(var(--chart-1))] rounded"></div>
            <span>Pasig</span> 
          </div>
          <div className="flex items-center text-sm text-black_">
            <div className="w-4 h-4 mr-2 bg-[hsl(var(--chart-2))] rounded"></div>
            <span>Non-Pasig</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default Residency;