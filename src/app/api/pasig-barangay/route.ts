// app/api/pasig-residents/route.ts
import { NextResponse } from 'next/server';
import { fetchPasigBarangayData } from '@/lib/db';

export const config = {
  dynamic: 'force-dynamic',
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const college = searchParams.get('college');
    
    const data = await fetchPasigBarangayData(college || undefined);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch Pasig barangay data',
        message: error instanceof Error ? error.message : 'Unknown error',
        data: [{ barangay: 'Error', students: 0 }]
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';