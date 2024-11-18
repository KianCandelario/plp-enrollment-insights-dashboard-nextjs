// app/api/presidents-lister/route.ts
import { supabase } from '@/lib/db'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const college = searchParams.get('college')

    const batchSize = 1000
    let allData: any[] = []
    let start = 0
    let end = batchSize - 1

    let query = supabase
      .from('Dashboard')
      .select('curricularProgram, presidentsLister')

    if (college && college !== 'All Colleges') {
      query = query.like('curricularProgram', `${college}%`)
    }

    // Fetch data in batches
    while (true) {
      const { data, error } = await query.range(start, end)
      if (error) throw error
      if (!data || data.length === 0) break

      allData = allData.concat(data)
      start += batchSize
      end += batchSize
    }

    // Calculate counts
    const statusCounts: { [key: string]: number } = {
      'Yes': 0,
      'No': 0
    }

    allData.forEach((student: { presidentsLister: string }) => {
      const { presidentsLister } = student
      if (presidentsLister === 'Yes' || presidentsLister === 'No') {
        statusCounts[presidentsLister]++
      }
    })

    // Format data for the chart
    const chartData = [
      {
        status: "President's Lister",
        count: statusCounts['Yes'],
        fill: "hsl(var(--chart-1))"
      },
      {
        status: "Non-President's Lister",
        count: statusCounts['No'],
        fill: "hsl(var(--chart-2))"
      }
    ]

    return NextResponse.json(chartData)
  } catch (error) {
    console.error('Error fetching presidents lister data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    )
  }
}