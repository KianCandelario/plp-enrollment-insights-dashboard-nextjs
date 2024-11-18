import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

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

interface StrandData {
  strand: string
  count: number
}

interface StrandInSHSProps {
  selectedCollege: string
}

export function StrandInSHS({ selectedCollege }: StrandInSHSProps) {
  const [data, setData] = useState<StrandData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/shs-strand?college=${encodeURIComponent(selectedCollege)}`)
        if (!response.ok) throw new Error('Failed to fetch data')
        const newData = await response.json()
        setData(newData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedCollege])

  const chartConfig = {
    count: {
      label: "Count",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig

  if (loading) return <Card className="h-[400px] flex items-center justify-center">Loading...</Card>
  if (error) return <Card className="h-[400px] flex items-center justify-center text-red-500">{error}</Card>

  return (
    <Card>
      <CardHeader>
        <CardTitle>SHS Strand Distribution</CardTitle>
        <CardDescription>
          {selectedCollege === 'All Colleges' ? 'All Colleges' : `${selectedCollege} College`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 30,
              bottom: 60
            }}
            height={400}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="strand"
              tickLine={false}
              tickMargin={10}
              angle={-45}
              textAnchor="end"
              interval={0}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Bar dataKey="count" fill="var(--color-count)" radius={8}>
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
          Showing distribution of SHS strands among students
        </div>
      </CardFooter>
    </Card>
  )
}