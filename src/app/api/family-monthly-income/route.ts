import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

interface IncomeData {
  month: string;
  students: number;
}

const incomeBrackets = [
  'Less than Php9,520',
  'Between Php9,520 to Php21,194',
  'Between Php21,195 to Php43,838',
  'Between Php43,839 to Php76,669',
  'Between Php76,670 to Php131,484',
  'Between Php131,485 to Php219,140',
  'From Php219,140 and up'
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
      .from('Dashboard')
      .select('familyMonthlyIncome, curricularProgram');

    if (selectedCollege && selectedCollege !== 'All Colleges') {
      query = query.like('curricularProgram', `${selectedCollege}%`);
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
        row.familyMonthlyIncome === bracket
      ).length;
      return { month: bracket, students };
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