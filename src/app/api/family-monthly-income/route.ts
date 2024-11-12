import { getPool } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

interface IncomeData {
  month: string;
  students: number;
}

interface QueryResult {
  month: string;
  students: string; // PostgreSQL COUNT returns string
}

interface ApiResponse {
  success: boolean;
  data?: IncomeData[];
  error?: string;
}

export const config = {
  dynamic: 'force-dynamic',
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const selectedCollege = searchParams.get('college');

    const pool = getPool();

    let query = `
      WITH income_categories AS (
        SELECT 
          CASE
            WHEN "familyMonthlyIncome" < 9520 THEN 'Less than 9,520'
            WHEN "familyMonthlyIncome" BETWEEN 9520 AND 21194 THEN 'Between 9,520 to 21,194'
            WHEN "familyMonthlyIncome" BETWEEN 21195 AND 43838 THEN 'Between 21,195 to 43,838'
            WHEN "familyMonthlyIncome" BETWEEN 43839 AND 76669 THEN 'Between 43,839 to 76,669'
            WHEN "familyMonthlyIncome" BETWEEN 76670 AND 131484 THEN 'Between 76,670 to 131,484'
            ELSE '131,485 and up'
          END as bracket,
          COUNT(*) as count
        FROM "EnrollmentDashboard"
        WHERE 1=1
    `;

    const queryParams: string[] = [];
    let paramCount = 1;

    if (selectedCollege && selectedCollege !== 'All Colleges') {
      query += ` AND course LIKE $${paramCount}`;
      queryParams.push(`${selectedCollege}%`);
      paramCount++;
    }

    query += `
      GROUP BY bracket
    )
    SELECT 
      bracket as month,
      count as students
    FROM income_categories
    ORDER BY 
      CASE bracket
        WHEN 'Less than 9,520' THEN 1
        WHEN 'Between 9,520 to 21,194' THEN 2
        WHEN 'Between 21,195 to 43,838' THEN 3
        WHEN 'Between 43,839 to 76,669' THEN 4
        WHEN 'Between 76,670 to 131,484' THEN 5
        WHEN '131,485 and up' THEN 6
      END
    `;

    const result = await pool.query<QueryResult>(query, queryParams);

    // Define all possible income brackets for complete data
    const incomeBrackets = [
      'Less than 9,520',
      'Between 9,520 to 21,194',
      'Between 21,195 to 43,838',
      'Between 43,839 to 76,669',
      'Between 76,670 to 131,484',
      '131,485 and up'
    ] as const;

    // Ensure all brackets are represented, even if they have 0 students
    const finalData: IncomeData[] = incomeBrackets.map(bracket => {
      const existingData = result.rows.find(row => row.month === bracket);
      return existingData 
        ? { month: existingData.month, students: parseInt(existingData.students) }
        : { month: bracket, students: 0 };
    });

    return NextResponse.json({
      success: true,
      data: finalData
    } satisfies ApiResponse);

  } catch (error) {
    console.error('Error fetching family monthly income data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch family monthly income data' 
      } satisfies ApiResponse,
      { status: 500 }
    );
  }
}