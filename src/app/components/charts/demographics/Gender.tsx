import { useEffect, useState } from "react"
import { PieChartIcon } from "lucide-react"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
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
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface GenderProps {
  selectedCollege: string
}

const chartConfig = {
  female: {
    label: "Female",
    color: "hsl(var(--chart-1))",
  },
  male: {
    label: "Male",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

// Custom legend component
const CustomLegend = ({ payload }: any) => {
  if (!payload || payload.length === 0) return null;

  const data = payload[0].payload;
  const total = data.female + data.male;
  const femalePercentage = ((data.female / total) * 100).toFixed(1);
  const malePercentage = ((data.male / total) * 100).toFixed(1);

  return (
    <div className="flex flex-col gap-2 text-sm mt-4">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "hsl(var(--chart-1))" }} />
          <span>Female</span>
        </div>
        <div className="flex gap-2">
          <span className="font-medium">{data.female.toLocaleString()}</span>
          <span className="text-muted-foreground">({femalePercentage}%)</span>
        </div>
      </div>
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "hsl(var(--chart-2))" }} />
          <span>Male</span>
        </div>
        <div className="flex gap-2">
          <span className="font-medium">{data.male.toLocaleString()}</span>
          <span className="text-muted-foreground">({malePercentage}%)</span>
        </div>
      </div>
    </div>
  );
};

export function Gender({ selectedCollege }: GenderProps) {
  const [chartData, setChartData] = useState([{ female: 0, male: 0 }])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchGenderData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/gender?college=${encodeURIComponent(selectedCollege)}`)
        const data = await response.json()
        setChartData(data)
      } catch (error) {
        console.error('Error fetching gender data:', error)
      }
      setIsLoading(false)
    }

    fetchGenderData()
  }, [selectedCollege])

  const totalPopulation = chartData[0].female + chartData[0].male

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Sex</CardTitle>
        <CardDescription className="flex items-center">
          <PieChartIcon className="mr-1 h-4 w-4" />Male-to-Female Ratio
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col items-center pb-4">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[295px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {isLoading ? "..." : totalPopulation.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          Population
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="female"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-female)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="male"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-male)"
              className="stroke-transparent stroke-2"
            />
            <ChartLegend content={<CustomLegend />} />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default Gender