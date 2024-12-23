export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ApplicantEnrolleeCorrelation: {
        Row: {
          academic_year: string
          applicant_count: number
          course: string
          created_at: string
          enrollee_count: number
          id: number
          updated_at: string
        }
        Insert: {
          academic_year: string
          applicant_count: number
          course: string
          created_at?: string
          enrollee_count: number
          id?: number
          updated_at?: string
        }
        Update: {
          academic_year?: string
          applicant_count?: number
          course?: string
          created_at?: string
          enrollee_count?: number
          id?: number
          updated_at?: string
        }
        Relationships: []
      }
      Dashboard: {
        Row: {
          academicStatus: string
          age: string
          barangay: string
          civilStatus: string
          created_at: string
          curricularProgram: string
          deansLister: string
          email: string
          familyMonthlyIncome: string
          feederSchool: string
          isLGBTQIA: string
          isPasigueno: string
          isPWD: string
          presidentsLister: string
          religion: string
          sex: string
          strandInSHS: string
          updated_at: string
          workingStudent: string
          yearsInPasig: string
        }
        Insert: {
          academicStatus: string
          age: string
          barangay: string
          civilStatus: string
          created_at?: string
          curricularProgram: string
          deansLister: string
          email: string
          familyMonthlyIncome: string
          feederSchool: string
          isLGBTQIA: string
          isPasigueno: string
          isPWD: string
          presidentsLister: string
          religion: string
          sex: string
          strandInSHS: string
          updated_at?: string
          workingStudent: string
          yearsInPasig: string
        }
        Update: {
          academicStatus?: string
          age?: string
          barangay?: string
          civilStatus?: string
          created_at?: string
          curricularProgram?: string
          deansLister?: string
          email?: string
          familyMonthlyIncome?: string
          feederSchool?: string
          isLGBTQIA?: string
          isPasigueno?: string
          isPWD?: string
          presidentsLister?: string
          religion?: string
          sex?: string
          strandInSHS?: string
          updated_at?: string
          workingStudent?: string
          yearsInPasig?: string
        }
        Relationships: []
      }
      EnrollmentDashboard: {
        Row: {
          age: number
          barangay: string
          civilStatus: string
          course: string
          created_at: string
          familyMonthlyIncome: number
          feederSchoolType: string
          gender: string
          isPasigueno: boolean
          religion: string
          studentID: string
          updated_at: string
        }
        Insert: {
          age: number
          barangay: string
          civilStatus: string
          course: string
          created_at?: string
          familyMonthlyIncome: number
          feederSchoolType: string
          gender: string
          isPasigueno: boolean
          religion: string
          studentID: string
          updated_at?: string
        }
        Update: {
          age?: number
          barangay?: string
          civilStatus?: string
          course?: string
          created_at?: string
          familyMonthlyIncome?: number
          feederSchoolType?: string
          gender?: string
          isPasigueno?: boolean
          religion?: string
          studentID?: string
          updated_at?: string
        }
        Relationships: []
      }
      EnrollmentData: {
        Row: {
          courseCode: string
          created_at: string
          enrollment: number
          id: number
          isActual: boolean
          lowerBound: number | null
          updated_at: string
          upperBound: number | null
          year: number
        }
        Insert: {
          courseCode: string
          created_at?: string
          enrollment: number
          id?: number
          isActual: boolean
          lowerBound?: number | null
          updated_at?: string
          upperBound?: number | null
          year: number
        }
        Update: {
          courseCode?: string
          created_at?: string
          enrollment?: number
          id?: number
          isActual?: boolean
          lowerBound?: number | null
          updated_at?: string
          upperBound?: number | null
          year?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
