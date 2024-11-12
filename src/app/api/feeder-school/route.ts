// api/feeder-school/route.ts
import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const course = searchParams.get('course');  // Use "course" instead of "college"

  try {
    const pool = getPool();
    let query = '';
    let values: any[] = [];

    if (course && course !== 'All Colleges') {
      query = `
        SELECT 
          "feederSchoolType",
          COUNT(*) as students
        FROM "EnrollmentDashboard"
        WHERE course = $1 
        GROUP BY "feederSchoolType"
      `;
      values = [course];
    } else {
      query = `
        SELECT 
          "feederSchoolType",
          COUNT(*) as students
        FROM "EnrollmentDashboard"
        GROUP BY "feederSchoolType"
      `;
    }

    const result = await pool.query(query, values);
    
    // Transform the data to match the chart format
    const chartData = result.rows.map(row => ({
      browser: row.feederSchoolType.toLowerCase(),
      students: parseInt(row.students),
      fill: row.feederSchoolType.toLowerCase() === 'public' 
        ? 'var(--color-public)' 
        : 'var(--color-private)'
    }));

    return NextResponse.json(chartData);
  } catch (error) {
    console.error('Error fetching feeder school data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feeder school data' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-static';