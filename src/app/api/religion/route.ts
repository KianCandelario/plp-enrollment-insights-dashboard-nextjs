import { getPool } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const college = searchParams.get('college');
    const pool = getPool();

    let query = `
      SELECT religion, COUNT(*) as population
      FROM "EnrollmentDashboard"
      WHERE religion IS NOT NULL
    `;

    let result;
    
    if (college && college !== 'All Colleges') {
      query += ` AND course LIKE $1`;
      query += ` GROUP BY religion ORDER BY population DESC`;
      result = await pool.query(query, [`${college}%`]);
    } else {
      query += ` GROUP BY religion ORDER BY population DESC`;
      result = await pool.query(query);
    }

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching religion data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch religion data' },
      { status: 500 }
    );
  }
}