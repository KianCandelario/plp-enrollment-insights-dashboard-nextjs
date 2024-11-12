// app/api/civil-status/route.ts
import { getPool } from '@/lib/db';
import { NextResponse } from 'next/server';

export const config = {
  dynamic: 'force-dynamic',
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const college = searchParams.get('college');
  
  const pool = getPool();

  try {
    let query = `
      SELECT 
        "civilStatus" as civil_status,
        COUNT(*) as population
      FROM "EnrollmentDashboard"
      WHERE 1=1
    `;

    const values = [];

    if (college && college !== 'All Colleges') {
      query += ` AND course LIKE $1`;
      values.push(`${college}%`);
    }

    query += `
      GROUP BY "civilStatus"
      ORDER BY "civilStatus"
    `;

    const result = await pool.query(query, values);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching civil status data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}