import pandas as pd
import numpy as np
from prophet import Prophet
import psycopg2
from psycopg2.extras import execute_batch
from datetime import datetime

from .model import forecast_all_courses, load_and_prepare_data

def get_db_connection():
    """Create a database connection"""
    return psycopg2.connect(
        dbname="enrollment_dashboard_db",
        user="postgres",
        password="master-123",
        host="localhost",
        port="5432"
    )

def save_enrollment_data(conn, course_code, year, enrollment, is_actual, lower_bound=None, upper_bound=None):
    """Save a single enrollment record to the database"""
    cur = conn.cursor()
    
    query = """
    INSERT INTO "EnrollmentData" ("courseCode", "year", "enrollment", "isActual", "lowerBound", "upperBound", "createdAt", "updatedAt")
    VALUES (%s, %s, %s, %s, %s, %s, NOW(), NOW())
    ON CONFLICT ("courseCode", "year") 
    DO UPDATE SET 
        "enrollment" = EXCLUDED."enrollment",
        "isActual" = EXCLUDED."isActual",
        "lowerBound" = EXCLUDED."lowerBound",
        "upperBound" = EXCLUDED."upperBound",
        "updatedAt" = NOW();
    """
    
    cur.execute(query, (
        course_code,
        year,
        enrollment,
        is_actual,
        lower_bound,
        upper_bound
    ))
    conn.commit()
    cur.close()

def save_forecast_to_db(forecasts, actual_data):
    """Save all forecasts and historical data to the database"""
    conn = get_db_connection()
    
    try:
        # Save historical data
        for _, row in actual_data.iterrows():
            save_enrollment_data(
                conn=conn,
                course_code=row['Course Code'],
                year=row['Original_Year'],
                enrollment=row['Enrollment'],
                is_actual=True
            )
        
        # Save forecast data
        for course, forecast in forecasts.items():
            future_data = forecast[forecast['year'] > actual_data['Original_Year'].max()]
            
            for _, row in future_data.iterrows():
                save_enrollment_data(
                    conn=conn,
                    course_code=course,
                    year=int(row['year']),
                    enrollment=row['yhat'],
                    is_actual=False,
                    lower_bound=row['yhat_lower'],
                    upper_bound=row['yhat_upper']
                )
                
    finally:
        conn.close()

def main():
    # Your existing code...
    excel_path = r'C:\Users\acer\Desktop\plp-enrollment-insights-dashboardd\src\lib\ml\data\EnrollmentData.csv'
    df = load_and_prepare_data(excel_path)
    forecasts = forecast_all_courses(df)
    
    # Save the data to database
    save_forecast_to_db(forecasts, df)

if __name__ == "__main__":
    main()