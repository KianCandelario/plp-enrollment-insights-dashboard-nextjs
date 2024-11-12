// src/app/api/enrollment-data/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

const pool = getPool();

export async function GET(_request: NextRequest) {
  const client = await pool.connect();
  
  try {
    // Get all enrollment data regardless of selected college
    const query = `SELECT "studentID", "course" FROM "EnrollmentDashboard"`;
    const result = await client.query(query);
    
    return NextResponse.json(result.rows);

  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to fetch enrollment data',
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export const dynamic = 'force-static';