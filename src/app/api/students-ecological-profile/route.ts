// app/api/students-ecological-profile

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { parse as parseCSVLib } from 'csv-parse';
import { Readable } from 'stream';

export const dynamic = 'force-dynamic'

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

// /api/dashboard/route.ts
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

    const maxSize = 10 * 1024 * 1024; // 10MB
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
      email: record.email?.toLowerCase() || '',
      sex: record.sex || '',
      isLGBTQIA: record.isLGBTQIA || 'false',
      age: record.age || '0',
      civilStatus: record.civilStatus || '',
      isPasigueno: record.isPasigueno || 'false',
      yearsInPasig: record.yearsInPasig || '0',
      barangay: record.barangay || '',
      familyMonthlyIncome: record.familyMonthlyIncome || '0',
      religion: record.religion || '',
      curricularProgram: record.curricularProgram || '',
      academicStatus: record.academicStatus || '',
      workingStudent: record.workingStudent || 'false',
      deansLister: record.deansLister || 'false',
      presidentsLister: record.presidentsLister || 'false',
      feederSchool: record.feederSchool || '',
      strandInSHS: record.strandInSHS || '',
      isPWD: record.isPWD || 'false',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('Dashboard')
      .upsert(formattedRecords, {
        onConflict: 'email'
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

export const maxDuration = 60;

export async function DELETE(_request: NextRequest) {
  try {
    const { error } = await supabase
      .from('Dashboard')
      .delete()
      .neq('email', ''); // Delete all records

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