import pandas as pd
import random
import datetime

# Define the courses and the year ABPSYCH starts accepting applicants
courses = ['BSCS', 'BSIT', 'BSA', 'BSBA', 'BEED', 'BSED-FIL', 'BSED-ENG', 'BSED-MATH', 'BSN', 'BSECE', 'BSHM', 'ABPSYCH']
abpsych_start_year = 2022

# Create the data
data = []
for year in range(2020, 2026):
    for course in courses:
        if course == 'ABPSYCH' and year < abpsych_start_year:
            continue
        applicant_count = random.randint(100, 500)
        enrollee_count = random.randint(50, 300)
        data.append({
            'academic_year': f"{year}-{year+1}",
            'course': course,
            'applicant_count': applicant_count,
            'enrollee_count': enrollee_count
        })

df = pd.DataFrame(data)
df.to_csv('applicant_enrollee_data.csv', index=False)
print("Data saved to 'applicant_enrollee_data.csv'")