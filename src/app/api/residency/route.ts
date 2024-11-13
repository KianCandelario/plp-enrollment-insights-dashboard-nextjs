// app/api/residency/route.ts
import { NextResponse } from 'next/server'
import { fetchResidencyData } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const college = searchParams.get('college');
    
    const data = await fetchResidencyData(college || undefined);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch residency data',
        message: error instanceof Error ? error.message : 'Unknown error',
        data: [
          { residency: 'Pasig', population: 0 },
          { residency: 'Non-Pasig', population: 0 }
        ]
      },
      { status: 500 }
    );
  }
}