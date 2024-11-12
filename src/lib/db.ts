// db.ts
import { Pool } from 'pg';

// Create a singleton pool instance
let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      user: process.env.POSTGRES_USER,
      host: process.env.POSTGRES_HOST || 'localhost',
      database: process.env.POSTGRES_DATABASE,
      password: process.env.POSTGRES_PASSWORD,
      port: 5432,
    });

    // Add connection error handling
    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      process.exit(-1);
    });
  }
  return pool;
}

interface ResidencyData {
  residency: string;
  population: number;
}

interface BarangayData {
  barangay: string;
  students: number;
}

export async function fetchResidencyData(college?: string): Promise<ResidencyData[]> {
  const pool = getPool();
  try {
    const query = college && college !== 'All Colleges' 
      ? `
        SELECT 
          COALESCE("isPasigueno", false) as "isPasigueno",
          COUNT(*) as count
        FROM "EnrollmentDashboard"
        WHERE course = $1
        GROUP BY "isPasigueno"
      `
      : `
        SELECT 
          COALESCE("isPasigueno", false) as "isPasigueno",
          COUNT(*) as count
        FROM "EnrollmentDashboard"
        GROUP BY "isPasigueno"
      `;

    const values = college && college !== 'All Colleges' ? [college] : [];
    
    const result = await pool.query(query, values);
    
    // Ensure we have both Pasig and Non-Pasig entries
    let pasig = 0;
    let nonpasig = 0;

    result.rows.forEach(row => {
      if (row.isPasigueno === true) {
        pasig = parseInt(row.count);
      } else {
        nonpasig = parseInt(row.count);
      }
    });

    const formattedData: ResidencyData[] = [
      { residency: 'pasig', population: pasig },
      { residency: 'nonpasig', population: nonpasig }
    ];
    
    console.log('Formatted Data:', formattedData);
    return formattedData;
    
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch residency data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function fetchPasigBarangayData(college?: string): Promise<BarangayData[]> {
  const pool = getPool();
  try {
    const query = college && college !== 'All Colleges'
      ? `
        SELECT 
          COALESCE(barangay, 'Unknown') as barangay,
          COUNT(*) as students
        FROM "EnrollmentDashboard"
        WHERE "isPasigueno" = true AND course = $1
        GROUP BY barangay
        ORDER BY students DESC
      `
      : `
        SELECT 
          COALESCE(barangay, 'Unknown') as barangay,
          COUNT(*) as students
        FROM "EnrollmentDashboard"
        WHERE "isPasigueno" = true
        GROUP BY barangay
        ORDER BY students DESC
      `;

    const values = college && college !== 'All Colleges' ? [college] : [];
    
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return [{ barangay: 'No Data', students: 0 }];
    }
    
    return result.rows.map(row => ({
      barangay: row.barangay || 'Unknown',
      students: parseInt(row.students)
    }));
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch Pasig barangay data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function fetchNonPasigResidentsData(college?: string): Promise<BarangayData[]> {
  const pool = getPool();
  try {
    const query = college && college !== 'All Colleges'
      ? `
        SELECT 
          COALESCE(barangay, 'Unknown') as barangay,
          COUNT(*) as students
        FROM "EnrollmentDashboard"
        WHERE "isPasigueno" = false AND course = $1
        GROUP BY barangay
        ORDER BY students DESC
      `
      : `
        SELECT 
          COALESCE(barangay, 'Unknown') as barangay,
          COUNT(*) as students
        FROM "EnrollmentDashboard"
        WHERE "isPasigueno" = false
        GROUP BY barangay
        ORDER BY students DESC
      `;

    const values = college && college !== 'All Colleges' ? [college] : [];
    
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return [{ barangay: 'No Data', students: 0 }];
    }
    
    return result.rows.map(row => ({
      barangay: row.barangay || 'Unknown',
      students: parseInt(row.students)
    }));
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch non-Pasig residents data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

interface AgeData {
  ageGroup: string;
  students: number;
}


export async function fetchAgeDistribution(college?: string): Promise<AgeData[]> {
  const pool = getPool();
  try {
    const query = college && college !== 'All Colleges'
      ? `
        WITH age_groups AS (
          SELECT 
            CASE 
              WHEN age < 18 THEN 'Less than 18 years old'
              WHEN age BETWEEN 18 AND 22 THEN '18-22 years old'
              ELSE '23 years old and above'
            END as age_group
          FROM "EnrollmentDashboard"
          WHERE course = $1
        )
        SELECT age_group, COUNT(*) as students
        FROM age_groups
        GROUP BY age_group
        ORDER BY 
          CASE age_group
            WHEN 'Less than 18 years old' THEN 1
            WHEN '18-22 years old' THEN 2
            ELSE 3
          END;
      `
      : `
        WITH age_groups AS (
          SELECT 
            CASE 
              WHEN age < 18 THEN 'Less than 18 years old'
              WHEN age BETWEEN 18 AND 22 THEN '18-22 years old'
              ELSE '23 years old and above'
            END as age_group
          FROM "EnrollmentDashboard"
        )
        SELECT age_group, COUNT(*) as students
        FROM age_groups
        GROUP BY age_group
        ORDER BY 
          CASE age_group
            WHEN 'Less than 18 years old' THEN 1
            WHEN '18-22 years old' THEN 2
            ELSE 3
          END;
      `;

    const values = college && college !== 'All Colleges' ? [college] : [];
    
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return [
        { ageGroup: 'Less than 18 years old', students: 0 },
        { ageGroup: '18-22 years old', students: 0 },
        { ageGroup: '23 years old and above', students: 0 }
      ];
    }

    return result.rows.map(row => ({
      ageGroup: row.age_group,
      students: parseInt(row.students)
    }));
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch age distribution: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}