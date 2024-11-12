import { NextResponse } from 'next/server';
import { fetchAgeDistribution } from '@/lib/db';

export const dynamic = 'force-static'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const college = searchParams.get('college');

    const data = await fetchAgeDistribution(college || undefined);
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch age distribution data' },
      { status: 500 }
    );
  }
}