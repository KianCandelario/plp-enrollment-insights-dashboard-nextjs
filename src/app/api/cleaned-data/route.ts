import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { parse as parseCSVLib } from 'csv-parse';
import { Readable } from 'stream';

const pasiguenoBarangays = new Set([
  'Bagong Ilog', 'Bagong Katipunan', 'Bambang', 'Buting', 'Caniogan', 'Dela Paz', 
  'Kalawaan', 'Kapasigan', 'Kapitolyo', 'Malinao', 'Manggahan', 'Maybunga', 
  'Oranbo', 'Palatiw', 'Pineda', 'Rosario', 'Sagad', 'San Antonio', 'San Joaquin', 
  'San Jose', 'San Miguel', 'Santa Cruz', 'Santa Lucia', 'Santa Rosa', 
  'Santo Tomas', 'Santolan', 'Sumilang', 'Ugong', 'San Nicolas', 'Pinagbuhatan'
]);

async function parseCSV(csvData: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const records: any[] = [];
    const parser = parseCSVLib({
      columns: true,
      skip_empty_lines: true,
      trim: true,
      skipRecordsWithError: true,
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

// /api/cleaned-csv/route.ts
export async function POST(request: NextRequest) {
  try {
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

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds maximum limit of 10MB' },
        { status: 400 }
      );
    }

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

    const formattedRecords = records.map(record => ({
      studentID: record.studentID,
      gender: record.gender,
      age: parseInt(record.age) || 0,
      civilStatus: record.civilStatus,
      religion: record.religion,
      course: record.course,
      barangay: record.barangay,
      isPasigueno: pasiguenoBarangays.has(record.barangay),
      familyMonthlyIncome: parseFloat(record.familyMonthlyIncome) || 0,
      feederSchoolType: record.feederSchoolType,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('EnrollmentDashboard')
      .upsert(formattedRecords, {
        onConflict: 'studentID'
      });

    if (error) throw error;

    return NextResponse.json({
      message: 'Data uploaded successfully',
      recordCount: formattedRecords.length
    });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to process upload',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest) {
  try {
    const { error } = await supabase
      .from('EnrollmentDashboard')
      .delete()
      .neq('studentID', ''); // Delete all records

    if (error) throw error;

    return NextResponse.json({ message: 'All data cleared successfully' });
  } catch (error) {
    console.error('Clear Data Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to clear data' },
      { status: 500 }
    );
  }
}