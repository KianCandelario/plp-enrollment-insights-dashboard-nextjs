import pandas as pd
import os
from dotenv import load_dotenv
from supabase.client import create_client, Client

from .model import forecast_all_courses, load_and_prepare_data

# Load environment variables
load_dotenv()

def get_supabase_client() -> Client:
    """Create a Supabase client"""
    url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
    key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    
    if not url or not key:
        raise ValueError("Missing Supabase credentials in environment variables")
        
    return create_client(url, key)

def save_enrollment_data(supabase: Client, course_code: str, year: int, enrollment: float, 
                        is_actual: bool, lower_bound: float = None, upper_bound: float = None):
    """Save a single enrollment record to Supabase"""
    try:
        data = {
            "courseCode": course_code,
            "year": year,
            "enrollment": float(enrollment),  # Convert numpy float to Python float
            "isActual": is_actual,
            "lowerBound": float(lower_bound) if lower_bound is not None else None,
            "upperBound": float(upper_bound) if upper_bound is not None else None
        }
        
        # First try to update existing record
        result = supabase.table('EnrollmentData')\
            .update(data)\
            .eq('courseCode', course_code)\
            .eq('year', year)\
            .execute()
            
        # If no rows were updated (record doesn't exist), insert new record
        if not result.data:
            result = supabase.table('EnrollmentData')\
                .insert(data)\
                .execute()
        
        if hasattr(result, 'error') and result.error:
            raise Exception(f"Error saving data: {result.error}")
            
        return result.data
        
    except Exception as e:
        print(f"Error saving enrollment data for course {course_code}, year {year}: {str(e)}")
        raise

def save_forecast_to_db(forecasts: dict, actual_data: pd.DataFrame):
    """Save all forecasts and historical data to Supabase"""
    supabase = get_supabase_client()
    
    try:
        # Save historical data with error handling for each record
        for _, row in actual_data.iterrows():
            try:
                save_enrollment_data(
                    supabase=supabase,
                    course_code=row['Course Code'],
                    year=row['Original_Year'],
                    enrollment=row['Enrollment'],
                    is_actual=True
                )
            except Exception as e:
                print(f"Failed to save historical data for {row['Course Code']}: {str(e)}")
                continue
        
        # Save forecast data with error handling for each record
        for course, forecast in forecasts.items():
            future_data = forecast[forecast['year'] > actual_data['Original_Year'].max()]
            
            for _, row in future_data.iterrows():
                try:
                    save_enrollment_data(
                        supabase=supabase,
                        course_code=course,
                        year=int(row['year']),
                        enrollment=row['yhat'],
                        is_actual=False,
                        lower_bound=row['yhat_lower'],
                        upper_bound=row['yhat_upper']
                    )
                except Exception as e:
                    print(f"Failed to save forecast data for {course}: {str(e)}")
                    continue
                
    except Exception as e:
        print(f"Error in save_forecast_to_db: {str(e)}")
        raise

def main():
    try:
        excel_path = r'C:\Users\acer\Desktop\plp-enrollment-insights-dashboardd\src\lib\ml\data\EnrollmentData.csv'
        df = load_and_prepare_data(excel_path)
        forecasts = forecast_all_courses(df)
        
        # Save the data to Supabase
        save_forecast_to_db(forecasts, df)
        print("Successfully saved forecasts to Supabase")
        
    except Exception as e:
        print(f"Error in main function: {str(e)}")
        raise

if __name__ == "__main__":
    main()