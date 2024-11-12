import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export const config = {
  dynamic: 'force-dynamic',
};

export async function GET(request: Request) {
  try {
    const pool = getPool();
    const { searchParams } = new URL(request.url);
    let courseCode = searchParams.get('courseCode') || 'GRAND_TOTAL';

    if (courseCode === 'All Colleges') {
      courseCode = 'GRAND_TOTAL';
    }

    console.log('Fetching data for courseCode:', courseCode);

    const result = await pool.query(
      `SELECT 
        "year",
        "enrollment",
        "isActual",
        "lowerBound",
        "upperBound"
      FROM public."EnrollmentData" 
      WHERE "courseCode" = $1
      ORDER BY "year" ASC`,
      [courseCode]
    );

    if (result.rows.length === 0) {
      console.log('No data found for courseCode:', courseCode);
      return NextResponse.json([]);
    }

    console.log(`Found ${result.rows.length} records for courseCode:`, courseCode);
    return NextResponse.json(result.rows);
    
  } catch (error) {
    console.error('Database Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: errorMessage }, 
      { status: 500 }
    );
  }
}