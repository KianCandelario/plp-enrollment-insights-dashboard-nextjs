// src/app/api/cleaned-data/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { parse as parseCSVLib } from 'csv-parse';
import { Readable } from 'stream';

export const dynamic = 'force-static';

const pool = getPool();

// Define the set of Pasigueno barangays
const pasiguenoBarangays = new Set([
  'Bagong Ilog', 'Bagong Katipunan', 'Bambang', 'Buting', 'Caniogan', 'Dela Paz', 
  'Kalawaan', 'Kapasigan', 'Kapitolyo', 'Malinao', 'Manggahan', 'Maybunga', 
  'Oranbo', 'Palatiw', 'Pineda', 'Rosario', 'Sagad', 'San Antonio', 'San Joaquin', 
  'San Jose', 'San Miguel', 'Santa Cruz', 'Santa Lucia', 'Santa Rosa', 
  'Santo Tomas', 'Santolan', 'Sumilang', 'Ugong', 'San Nicolas', 'Pinagbuhatan'
]);

// Helper function to parse CSV data with error handling
async function parseCSV(csvData: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const records: any[] = [];
    const parser = parseCSVLib({
      columns: true,
      skip_empty_lines: true,
      trim: true, // Add trim to handle whitespace
      skipRecordsWithError: true, // Skip records with parsing errors
    });

    parser.on('readable', () => {
      let record;
      while ((record = parser.read()) !== null) {
        records.push(record);
      }
    });

    parser.on('error', (err) => {
      console.error('CSV Parse Error:', err);
      reject(err);
    });

    parser.on('end', () => resolve(records));

    // Use try-catch for stream handling
    try {
      const stream = new Readable();
      stream.push(csvData);
      stream.push(null);
      stream.pipe(parser);
    } catch (error) {
      reject(error);
    }
  });
}

// POST: Upload cleaned data CSV and insert into database
export async function POST(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    // Explicitly set the expected content type
    if (!request.headers.get('content-type')?.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'Content type must be multipart/form-data' },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'Invalid or missing file in request' },
        { status: 400 }
      );
    }

    // Verify file size (example: 10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds maximum limit of 10MB' },
        { status: 400 }
      );
    }

    // Verify file type
    if (!file.type.includes('csv') && !file.name.endsWith('.csv')) {
      return NextResponse.json(
        { error: 'Only CSV files are allowed' },
        { status: 400 }
      );
    }

    const csvData = await file.text();
    if (!csvData.trim()) {
      return NextResponse.json(
        { error: 'CSV file is empty' },
        { status: 400 }
      );
    }

    const records = await parseCSV(csvData);
    if (!records.length) {
      return NextResponse.json(
        { error: 'No valid records found in CSV' },
        { status: 400 }
      );
    }

    await client.query('BEGIN');

    let totalRecords = 0;
    const batchSize = 1000; // Process records in batches
    const recordBatches = [];

    // Split records into batches
    for (let i = 0; i < records.length; i += batchSize) {
      recordBatches.push(records.slice(i, i + batchSize));
    }

    // Process each batch
    for (const batch of recordBatches) {
      const values = batch.map((record) => {
        const isPasigueno = pasiguenoBarangays.has(record.barangay);
        return [
          record.studentID,
          record.gender,
          parseInt(record.age) || 0,
          record.civilStatus,
          record.religion,
          record.course,
          record.barangay,
          isPasigueno,
          parseFloat(record.familyMonthlyIncome) || 0,
          record.feederSchoolType,
          new Date().toISOString(),
          new Date().toISOString(),
        ];
      });

      // Use prepared statement for better performance
      const query = `
        INSERT INTO "EnrollmentDashboard" 
        ("studentID", "gender", "age", "civilStatus", "religion", "course", 
         "barangay", "isPasigueno", "familyMonthlyIncome", "feederSchoolType", 
         "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT ("studentID") DO UPDATE SET
          "gender" = EXCLUDED."gender",
          "age" = EXCLUDED."age",
          "civilStatus" = EXCLUDED."civilStatus",
          "religion" = EXCLUDED."religion",
          "course" = EXCLUDED."course",
          "barangay" = EXCLUDED."barangay",
          "isPasigueno" = EXCLUDED."isPasigueno",
          "familyMonthlyIncome" = EXCLUDED."familyMonthlyIncome",
          "feederSchoolType" = EXCLUDED."feederSchoolType",
          "updatedAt" = EXCLUDED."updatedAt"
      `;

      for (const value of values) {
        await client.query(query, value);
        totalRecords++;
      }
    }

    await client.query('COMMIT');
    
    return NextResponse.json({
      message: 'Data uploaded successfully',
      recordCount: totalRecords,
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Upload Error:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to process upload',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );

  } finally {
    client.release();
  }
}

export async function DELETE(_request: NextRequest) {
  try {
    const pool = getPool();
    const client = await pool.connect();

    try {
      await client.query('BEGIN');
      await client.query(`DELETE FROM "EnrollmentDashboard"`);
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