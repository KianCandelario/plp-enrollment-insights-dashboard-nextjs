import { NextRequest, NextResponse } from 'next/server';
import { supabase, ApplicantEnrolleeCorrelation } from '@/lib/db';
import { parse } from 'csv-parse';
import { Readable } from 'stream';

async function parseCSV(csvData: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const records: any[] = [];
    const parser = parse({
      columns: true,
      skip_empty_lines: true
    });

    parser.on('readable', function() {
      let record;
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

// api/applicant-enrollee/route.ts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseCode = searchParams.get('courseCode');

    if (courseCode === "All Colleges") {
      // Fetch data for all colleges, aggregating by academic year
      const { data, error } = await supabase
        .from('ApplicantEnrolleeCorrelation')
        .select('academic_year, applicant_count, enrollee_count')
        .order('academic_year');

      if (error) throw error;

      if (!data || data.length === 0) {
        console.warn('No data found for all colleges');
        return NextResponse.json({
          applicantEnrolleeData: [] // Respond with an empty array if no data is found
        });
      }

      // Aggregate totals across all courses for each academic year
      const totals = data.reduce((acc, curr) => {
        if (!acc[curr.academic_year]) {
          acc[curr.academic_year] = {
            academic_year: curr.academic_year,
            applicant_count: 0,  // Align with ApplicantEnrolleeData structure
            enrollee_count: 0    // Align with ApplicantEnrolleeData structure
          };
        }
        acc[curr.academic_year].applicant_count += curr.applicant_count || 0;
        acc[curr.academic_year].enrollee_count += curr.enrollee_count || 0;
        return acc;
      }, {} as Record<string, { academic_year: string; applicant_count: number; enrollee_count: number }>);

      return NextResponse.json({
        applicantEnrolleeData: Object.values(totals)
      });
    }

    // If specific course is provided, fetch only that course's data
    const { data, error } = await supabase
      .from('ApplicantEnrolleeCorrelation')
      .select()
      .eq('course', courseCode || '')
      .order('academic_year');

    if (error) throw error;

    return NextResponse.json({ applicantEnrolleeData: data });

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
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const csvData = await file.text();
    const records = await parseCSV(csvData);

    let totalRecords = 0;

    for (const record of records) {
      const formattedRecord = {
        academic_year: record.academic_year,
        course: record.course,
        applicant_count: parseInt(record.applicant_count),
        enrollee_count: parseInt(record.enrollee_count),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: existingRecord, error: selectError } = await supabase
        .from('ApplicantEnrolleeCorrelation')
        .select('*')
        .eq('academic_year', formattedRecord.academic_year)
        .eq('course', formattedRecord.course)
        .limit(1)
        .single();

      if (selectError) {
        if (selectError.code === 'PGRST116') {
          // Handle the case where no rows are returned
          const { error: insertError } = await supabase
            .from('ApplicantEnrolleeCorrelation')
            .insert(formattedRecord);

          if (insertError) {
            throw insertError;
          }
        } else {
          throw selectError;
        }
      } else if (existingRecord) {
        // Update the existing record
        const { error: updateError } = await supabase
          .from('ApplicantEnrolleeCorrelation')
          .update(formattedRecord)
          .eq('academic_year', formattedRecord.academic_year)
          .eq('course', formattedRecord.course);

        if (updateError) {
          throw updateError;
        }
      } else {
        // Insert the new record
        const { error: insertError } = await supabase
          .from('ApplicantEnrolleeCorrelation')
          .insert(formattedRecord);

        if (insertError) {
          throw insertError;
        }
      }

      totalRecords++;
    }

    return NextResponse.json({
      message: 'Data uploaded successfully',
      recordCount: totalRecords
    });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process upload' },
      { status: 500 }
    );
  }
}


export async function DELETE() {
  try {
    const { error } = await supabase
      .from('ApplicantEnrolleeCorrelation')
      .delete()
      .neq('id', 0);

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

export const dynamic = 'force-static';