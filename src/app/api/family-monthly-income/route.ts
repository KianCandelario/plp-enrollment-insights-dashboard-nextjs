import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

interface IncomeData {
  month: string;
  students: number;
}

const incomeBrackets = [
  { label: 'Less than 9,520', min: -Infinity, max: 9519 },
  { label: 'Between 9,520 to 21,194', min: 9520, max: 21194 },
  { label: 'Between 21,195 to 43,838', min: 21195, max: 43838 },
  { label: 'Between 43,839 to 76,669', min: 43839, max: 76669 },
  { label: 'Between 76,670 to 131,484', min: 76670, max: 131484 },
  { label: '131,485 and up', min: 131485, max: Infinity },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const selectedCollege = searchParams.get('college');

    const batchSize = 1000;
    let allData: any[] = [];
    let start = 0;
    let end = batchSize - 1;

    let query = supabase
      .from('EnrollmentDashboard')
      .select('familyMonthlyIncome, course');

    if (selectedCollege && selectedCollege !== 'All Colleges') {
      query = query.like('course', `${selectedCollege}%`);
    }

    while (true) {
      const { data, error } = await query.range(start, end);
      if (error) throw error;
      if (!data || data.length === 0) break;

      allData = allData.concat(data);
      start += batchSize;
      end += batchSize;
    }

    const counts = incomeBrackets.map((bracket) => {
      const students = allData.filter((row) =>
        row.familyMonthlyIncome >= bracket.min && row.familyMonthlyIncome <= bracket.max
      ).length;
      return { month: bracket.label, students };
    });

    return NextResponse.json({ success: true, data: counts });
  } catch (error) {
    console.error('Error fetching family monthly income data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch family monthly income data' },
      { status: 500 }
    );
  }
}
