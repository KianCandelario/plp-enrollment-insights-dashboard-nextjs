// src/app/api/applicant-enrollee/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { parse } from 'csv-parse';
import { Readable } from 'stream';

interface CSVRecord {
  academic_year: string;
  course: string;
  applicant_count: string;
  enrollee_count: string;
}

// Helper function to parse CSV data with proper typing
async function parseCSV(csvData: string): Promise<CSVRecord[]> {
  return new Promise((resolve, reject) => {
    const records: CSVRecord[] = [];
    const parser = parse({
      columns: true,
      skip_empty_lines: true
    });

    parser.on('readable', function() {
      let record: CSVRecord;
      while ((record = parser.read()) !== null) {
        records.push(record);
      }
    });

    parser.on('error', function(err) {
      reject(err);
    });

    parser.on('end', function() {
      resolve(records);
    });

    const stream = new Readable();
    stream.push(csvData);
    stream.push(null);
    stream.pipe(parser);
  });
}

export async function GET(request: NextRequest) {
  try {
    const pool = getPool();
    const { searchParams } = new URL(request.url);
    const courseCode = searchParams.get('courseCode');

    if (courseCode === "All Colleges") {
      // Query to get summed applicant and enrollee counts per academic year
      const result = await pool.query(
        `SELECT academic_year, 
                SUM(applicant_count) AS total_applicants, 
                SUM(enrollee_count) AS total_enrollment
         FROM "ApplicantEnrolleeCorrelation"
         GROUP BY academic_year
         ORDER BY academic_year ASC`
      );

      // Format the response data
      const applicantEnrolleeData = result.rows.map(row => ({
        academic_year: row.academic_year,
        applicant_count: row.total_applicants,
        enrollee_count: row.total_enrollment,
      }));

      return NextResponse.json({ applicantEnrolleeData });
    }

    const client = await pool.connect();
    try {
      // Query to fetch data for a specific course, ordered by academic year
      const result = await client.query(
        `SELECT academic_year, applicant_count, enrollee_count
         FROM "ApplicantEnrolleeCorrelation"
         WHERE course = $1
         ORDER BY academic_year ASC`,
        [courseCode]
      );

      return NextResponse.json({ applicantEnrolleeData: result.rows });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Fetch Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const pool = getPool();
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Read and parse the CSV file
    const csvData = await file.text();
    const records = await parseCSV(csvData);

    // Begin a transaction
    const client = await pool.connect();
    await client.query('BEGIN');

    try {
      let totalRecords = 0;
      for (const record of records) {
        const { rows } = await client.query(
          `SELECT 1 FROM "ApplicantEnrolleeCorrelation"
           WHERE "academic_year" = $1 AND "course" = $2`,
          [record.academic_year, record.course]
        );

        if (rows.length === 0) {
          await client.query(
            `INSERT INTO "ApplicantEnrolleeCorrelation"
             ("academic_year", "course", "applicant_count", "enrollee_count", "createdAt", "updatedAt")
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              record.academic_year,
              record.course,
              parseInt(record.applicant_count),
              parseInt(record.enrollee_count),
              new Date().toISOString(), // createdAt
              new Date().toISOString() // updatedAt
            ]
          );
        } else {
          await client.query(
            `UPDATE "ApplicantEnrolleeCorrelation"
             SET "applicant_count" = $3, "enrollee_count" = $4, "updatedAt" = $5
             WHERE "academic_year" = $1 AND "course" = $2`,
            [
              record.academic_year,
              record.course,
              parseInt(record.applicant_count),
              parseInt(record.enrollee_count),
              new Date().toISOString() // updatedAt
            ]
          );
        }

        totalRecords++;
      }

      await client.query('COMMIT');
      return NextResponse.json({
        message: 'Data uploaded successfully',
        recordCount: totalRecords
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process upload' },
      { status: 500 }
    );
  }
}


export async function DELETE(_request: NextRequest) {
  try {
    const pool = getPool();
    const client = await pool.connect();

    try {
      await client.query('BEGIN');
      await client.query(`DELETE FROM "ApplicantEnrolleeCorrelation"`);
      await client.query('COMMIT');

      return NextResponse.json({ message: 'All data cleared successfully' });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Clear Data Error:', error);
      return NextResponse.json(
        { error: 'Failed to clear data' },
        { status: 500 }
      );
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Connection Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to connect to database' },
      { status: 500 }
    );
  }
}