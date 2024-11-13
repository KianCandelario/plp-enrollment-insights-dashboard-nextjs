import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

// Types based on your schema
export interface EnrollmentData {
  id: number;
  year: number;
  courseCode: string;
  enrollment: number;
  isActual: boolean;
  lowerBound: number;
  upperBound: number;
  created_at: string;
  updated_at: string;
}

export interface EnrollmentDashboard {
  studentID: string;
  gender: string;
  age: number;
  civilStatus: string;
  religion: string;
  course: string;
  barangay: string;
  isPasigueno: boolean;
  familyMonthlyIncome: number;
  feederSchoolType: string;
  created_at: string;
  updated_at: string;
}

export interface ApplicantEnrolleeCorrelation {
  id: number;
  academic_year: string;
  course: string;
  applicant_count: number;
  enrollee_count: number;
  created_at: string;
  updated_at: string;
}

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  }
});

// Helper function to check if we're running on the server side
export const isServer = () => typeof window === 'undefined';

interface ResidencyData {
  residency: string;
  population: number;
}

interface BarangayData {
  barangay: string;
  students: number;
}

export async function fetchResidencyData(college?: string): Promise<ResidencyData[]> {
  try {
    const batchSize = 1000;
    let allData: any[] = [];
    let start = 0;
    let end = batchSize - 1;
    let query = supabase.from('EnrollmentDashboard').select('isPasigueno');

    // Add college filter if specified
    if (college && college !== 'All Colleges') {
      query = query.eq('course', college);
    }

    // Loop to fetch all data in batches
    while (true) {
      const { data, error } = await query.range(start, end);

      if (error) {
        console.error('Supabase Error:', error);
        throw new Error(`Failed to fetch residency data: ${error.message}`);
      }

      if (data.length === 0) break; // Exit when no more records are returned

      allData = allData.concat(data); // Accumulate fetched data
      start += batchSize;
      end += batchSize;
    }

    // Count the occurrences manually
    const counts = allData.reduce((acc, row) => {
      if (row.isPasigueno) {
        acc.pasig = (acc.pasig || 0) + 1;
      } else {
        acc.nonpasig = (acc.nonpasig || 0) + 1;
      }
      return acc;
    }, { pasig: 0, nonpasig: 0 });

    const formattedData: ResidencyData[] = [
      { residency: 'pasig', population: counts.pasig },
      { residency: 'nonpasig', population: counts.nonpasig }
    ];

    console.log('Formatted Data:', formattedData);
    return formattedData;

  } catch (error) {
    console.error('Error:', error);
    throw new Error(`Failed to fetch residency data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}


interface BarangayData {
  barangay: string;
  students: number;
}

export async function fetchPasigBarangayData(college?: string): Promise<BarangayData[]> {
  try {
    const batchSize = 1000;
    let allData: any[] = [];
    let start = 0;
    let end = batchSize - 1;
    let query = supabase.from('EnrollmentDashboard').select('barangay').eq('isPasigueno', true);

    if (college && college !== 'All Colleges') {
      query = query.eq('course', college);
    }

    // Loop to fetch all data in batches
    while (true) {
      const { data, error } = await query.range(start, end);
      if (error) throw new Error(`Failed to fetch Pasig barangay data: ${error.message}`);
      if (!data || data.length === 0) break;

      allData = allData.concat(data);
      start += batchSize;
      end += batchSize;
    }

    // Group and count data manually
    const barangayCounts = allData.reduce((acc: Record<string, number>, row) => {
      const barangay = row.barangay || 'Unknown';
      acc[barangay] = (acc[barangay] || 0) + 1;
      return acc;
    }, {});

    // Convert to array and sort by student count
    const formattedData: BarangayData[] = Object.entries(barangayCounts)
      .map(([barangay, students]) => ({ barangay, students }))
      .sort((a, b) => b.students - a.students);

    return formattedData;

  } catch (error) {
    console.error('Error:', error);
    throw new Error(`Failed to fetch Pasig barangay data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}


export async function fetchNonPasigResidentsData(college?: string): Promise<BarangayData[]> {
  try {
    const batchSize = 1000;
    let allData: any[] = [];
    let start = 0;
    let end = batchSize - 1;
    let query = supabase.from('EnrollmentDashboard').select('barangay').eq('isPasigueno', false);

    if (college && college !== 'All Colleges') {
      query = query.eq('course', college);
    }

    // Loop to fetch all data in batches
    while (true) {
      const { data, error } = await query.range(start, end);
      if (error) throw new Error(`Failed to fetch non-Pasig residents data: ${error.message}`);
      if (!data || data.length === 0) break;

      allData = allData.concat(data);
      start += batchSize;
      end += batchSize;
    }

    // Group and count data manually
    const barangayCounts = allData.reduce((acc: Record<string, number>, row) => {
      const barangay = row.barangay || 'Unknown';
      acc[barangay] = (acc[barangay] || 0) + 1;
      return acc;
    }, {});

    // Convert to array and sort by student count
    const formattedData: BarangayData[] = Object.entries(barangayCounts)
      .map(([barangay, students]) => ({ barangay, students }))
      .sort((a, b) => b.students - a.students);

    return formattedData;

  } catch (error) {
    console.error('Error:', error);
    throw new Error(`Failed to fetch non-Pasig residents data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}


// Helper function to process barangay data (can be used by both functions)
export function processBarangayData(data: any[]): BarangayData[] {
  if (!data || data.length === 0) {
    return [{ barangay: 'No Data', students: 0 }];
  }

  const barangayCounts = data.reduce((acc: Record<string, number>, row) => {
    const barangay = row.barangay || 'Unknown';
    acc[barangay] = (acc[barangay] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(barangayCounts)
    .map(([barangay, students]) => ({
      barangay,
      students
    }))
    .sort((a, b) => b.students - a.students);
}

interface AgeData {
  ageGroup: string;
  students: number;
}

const AGE_GROUPS = [
  'Less than 18 years old',
  '18-22 years old',
  '23 years old and above'
] as const;

export async function fetchAgeDistribution(college?: string): Promise<AgeData[]> {
  try {
    const batchSize = 1000;
    let allData: any[] = [];
    let start = 0;
    let end = batchSize - 1;
    let query = supabase.from('EnrollmentDashboard').select('age');

    if (college && college !== 'All Colleges') {
      query = query.eq('course', college);
    }

    // Loop to fetch all data in batches
    while (true) {
      const { data, error } = await query.range(start, end);
      if (error) throw new Error(`Failed to fetch age distribution: ${error.message}`);
      if (!data || data.length === 0) break;

      allData = allData.concat(data);
      start += batchSize;
      end += batchSize;
    }

    // Process age groups
    const ageGroups = allData.reduce((acc: Record<string, number>, row) => {
      let ageGroup: string;
      
      if (row.age < 18) {
        ageGroup = 'Less than 18 years old';
      } else if (row.age >= 18 && row.age <= 22) {
        ageGroup = '18-22 years old';
      } else {
        ageGroup = '23 years old and above';
      }

      acc[ageGroup] = (acc[ageGroup] || 0) + 1;
      return acc;
    }, {});

    // Ensure all age groups are present with at least 0 students
    const formattedData: AgeData[] = AGE_GROUPS.map(ageGroup => ({
      ageGroup,
      students: ageGroups[ageGroup] || 0
    }));

    return formattedData;

  } catch (error) {
    console.error('Error:', error);
    throw new Error(`Failed to fetch age distribution: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}


// Helper function to get the total number of students
export function getTotalStudents(data: AgeData[]): number {
  return data.reduce((total, group) => total + group.students, 0);
}

// Helper function to calculate percentages
export function calculateAgePercentages(data: AgeData[]): (AgeData & { percentage: number })[] {
  const total = getTotalStudents(data);
  return data.map(group => ({
    ...group,
    percentage: total > 0 ? (group.students / total) * 100 : 0
  }));
}

// Helper function to get age group for a given age
export function getAgeGroup(age: number): string {
  if (age < 18) return 'Less than 18 years old';
  if (age <= 22) return '18-22 years old';
  return '23 years old and above';
}