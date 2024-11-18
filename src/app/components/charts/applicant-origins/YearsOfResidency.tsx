"use client"

import { useEffect, useState } from "react"
import { BarChart2Icon } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface YearsData {
  category: string
  count: number
}

const chartConfig = {
  count: {
    label: "Count",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

interface YearsOfResidencyProps {
  selectedCollege: string
}

export function YearsOfResidency({ selectedCollege }: YearsOfResidencyProps) {
  const [data, setData] = useState<YearsData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(
          `/api/years-of-residency?college=${encodeURIComponent(selectedCollege)}`
        )
        const yearsData = await response.json()
        setData(yearsData)
      } catch (error) {
        console.error("Error fetching years in Pasig data:", error)
      }
      setIsLoading(false)
    }

    fetchData()
  }, [selectedCollege])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Years of Residency in Pasig</CardTitle>
        <CardDescription className="flex items-center">
        <BarChart2Icon className="w-4 h-4 mr-1" /> <span>Distribution for {selectedCollege || "All Colleges"}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[280px] w-full" config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              top: 20,
              right: 20,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={10}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Bar dataKey="count" fill="var(--color-count)" radius={[8, 8, 0, 0]}>
              <LabelList
                dataKey="count"
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing distribution of years of residency in Pasig
        </div>
      </CardFooter>
    </Card>
  )
}