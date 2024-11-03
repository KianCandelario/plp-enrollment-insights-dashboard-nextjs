import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Create a connection pool
const pool = new Pool({
  // Your local PostgreSQL connection config
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

// Add connection error handling
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export async function GET(request: Request) {
  try {
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