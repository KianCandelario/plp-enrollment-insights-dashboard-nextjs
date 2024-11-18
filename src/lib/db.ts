import { createClient } from '@supabase/supabase-js';
import { Database } from './type';

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

export interface ApplicantEnrolleeCorrelation {
  id: number;
  academic_year: string;
  course: string;
  applicant_count: number;
  enrollee_count: number;
  created_at: string;
  updated_at: string;
}

export interface Dashboard {
  email: string;
  sex: string;
  isLGBTQIA: string;
  age: string;
  civilStatus: string;
  isPasigueno: string;
  yearsInPasig: string;
  barangay: string;
  familyMonthlyIncome: string;
  religion: string;
  curricularProgram: string;
  academicStatus: string;
  workingStudent: string;
  deansLister: string;
  presidentsLister: string;
  feederSchool: string;
  strandInSHS: string;
  isPWD: string;
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

export async function fetchResidencyData(curricularProgram?: string): Promise<ResidencyData[]> {
  try {
    const batchSize = 1000;
    let allData: any[] = [];
    let start = 0;
    let end = batchSize - 1;
    let query = supabase.from('Dashboard').select('isPasigueno');

    // Add curricular program filter if specified
    if (curricularProgram && curricularProgram !== 'All Colleges') {
      query = query.eq('curricularProgram', curricularProgram);
    }

    // Loop to fetch all data in batches
    while (true) {
      const { data, error } = await query.range(start, end);

      if (error) {
        console.error('Supabase Error:', error);
        throw new Error(`Failed to fetch residency data: ${error.message}`);
      }

      if (data.length === 0) break;

      allData = allData.concat(data);
      start += batchSize;
      end += batchSize;
    }

    // Count the occurrences manually
    const counts = allData.reduce((acc, row) => {
      if (row.isPasigueno === 'Yes') {
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

export async function fetchPasigBarangayData(curricularProgram?: string): Promise<BarangayData[]> {
  try {
    const batchSize = 1000;
    let allData: any[] = [];
    let start = 0;
    let end = batchSize - 1;
    let query = supabase.from('Dashboard').select('barangay').eq('isPasigueno', 'Yes');

    if (curricularProgram && curricularProgram !== 'All Colleges') {
      query = query.eq('curricularProgram', curricularProgram);
    }

    while (true) {
      const { data, error } = await query.range(start, end);
      if (error) throw new Error(`Failed to fetch Pasig barangay data: ${error.message}`);
      if (!data || data.length === 0) break;

      allData = allData.concat(data);
      start += batchSize;
      end += batchSize;
    }

    return processBarangayData(allData);

  } catch (error) {
    console.error('Error:', error);
    throw new Error(`Failed to fetch Pasig barangay data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}


export async function fetchNonPasigResidentsData(curricularProgram?: string): Promise<BarangayData[]> {
  try {
    const batchSize = 1000;
    let allData: any[] = [];
    let start = 0;
    let end = batchSize - 1;
    let query = supabase.from('Dashboard').select('barangay').eq('isPasigueno', 'No');

    if (curricularProgram && curricularProgram !== 'All Colleges') {
      query = query.eq('curricularProgram', curricularProgram);
    }

    while (true) {
      const { data, error } = await query.range(start, end);
      if (error) throw new Error(`Failed to fetch non-Pasig residents data: ${error.message}`);
      if (!data || data.length === 0) break;

      allData = allData.concat(data);
      start += batchSize;
      end += batchSize;
    }

    return processBarangayData(allData);

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

// Updated age groups constant
const AGE_GROUPS = [
  'below 18 years old',
  '18-24 years old',
  '25 years old and above'
] as const;

export async function fetchAgeDistribution(curricularProgram?: string): Promise<AgeData[]> {
  try {
    const batchSize = 1000;
    let allData: any[] = [];
    let start = 0;
    let end = batchSize - 1;
    let query = supabase.from('Dashboard').select('age');

    if (curricularProgram && curricularProgram !== 'All Colleges') {
      query = query.eq('curricularProgram', curricularProgram);
    }

    while (true) {
      const { data, error } = await query.range(start, end);
      if (error) throw new Error(`Failed to fetch age distribution: ${error.message}`);
      if (!data || data.length === 0) break;

      allData = allData.concat(data);
      start += batchSize;
      end += batchSize;
    }

    // Process age groups with new grouping logic
    const ageGroups = allData.reduce((acc: Record<string, number>, row) => {
      let ageGroup: string;
      
      if (row.age === 'below 18 years old') {
        ageGroup = 'below 18 years old';
      } else if (['18 years old', '19 years old', '20 years old', '21 years old', 
                  '22 years old', '23 years old', '24 years old'].includes(row.age)) {
        ageGroup = '18-24 years old';
      } else {
        ageGroup = '25 years old and above';
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
export function getAgeGroup(age: string): string {
  if (age === 'below 18 years old') return 'below 18 years old';
  if (['18 years old', '19 years old', '20 years old', '21 years old', 
       '22 years old', '23 years old', '24 years old'].includes(age)) {
    return '18-24 years old';
  }
  return '25 years old and above';
}