import { getPool } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const college = searchParams.get('college');

    const pool = getPool();
    
    let query = `
      SELECT 
        course,
        gender,
        COUNT(*) as count
      FROM "EnrollmentDashboard"
      WHERE 1=1
    `;
    
    const values: any[] = [];
    
    if (college && college !== 'All Colleges') {
      query += ` AND course = $1`;
      values.push(college);
    }
    
    query += `
      GROUP BY course, gender
      ORDER BY course, gender
    `;

    const result = await pool.query(query, values);

    // Transform the data into the required format
    const genderData = {
      female: 0,
      male: 0
    };

    result.rows.forEach((row) => {
      if (row.gender.toLowerCase() === 'female') {
        genderData.female += Number(row.count);
      } else if (row.gender.toLowerCase() === 'male') {
        genderData.male += Number(row.count);
      }
    });

    return NextResponse.json([genderData]);

  } catch (error) {
    console.error('Error fetching gender data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gender data' },
      { status: 500 }
    );
  }
}