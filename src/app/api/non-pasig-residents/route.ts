// app/api/non-pasig-residents/route.ts
import { NextResponse } from 'next/server'
import { fetchNonPasigResidentsData } from '@/lib/db'


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const college = searchParams.get('college');
    
    const data = await fetchNonPasigResidentsData(college || undefined);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch non-Pasig residents data',
        message: error instanceof Error ? error.message : 'Unknown error',
        data: [{ barangay: 'Error', students: 0 }]
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';