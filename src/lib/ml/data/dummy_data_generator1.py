import random
import pandas as pd

def generate_numbers():
    # Initialize empty list to store the formatted numbers
    numbers = []
    
    # Generate numbers from 1 to 3500
    for i in range(1, 3501):
        # Format the number with leading zeros
        formatted_number = f"21-{str(i).zfill(5)}"
        numbers.append(formatted_number)
    
    return numbers

def generate_student_data(num_students):
    # Generate random genders and ages
    student_ids = generate_numbers()
    student_genders = ['Male' if random.random() < 0.5 else 'Female' for _ in range(num_students)]
    student_ages = [random.randint(16, 35) for _ in range(num_students)]

    # Define the list of courses
    courses = ['BSCS', 'BSIT', 'BSA', 'BSBA', 'BEED', 'BSED-FIL', 'BSED-ENG', 'BSED-MATH', 'BSN', 'BSECE', 'BSHM', 'ABPSYCH']

    # Generate random courses
    student_courses = [random.choice(courses) for _ in range(num_students)]

    # Generate random feeder school types
    feeder_school_types = ['Public', 'Private']
    student_feeder_school_types = [random.choice(feeder_school_types) for _ in range(num_students)]

    # Generate random civil status
    civil_status_options = ['Living with Partner', 'Married', 'Separated', 'Single', 'Single Parent', 'Widower']
    student_civil_status = [random.choice(civil_status_options) for _ in range(num_students)]

    # Generate random family monthly income
    student_family_monthly_income = [random.randint(8000, 140000) for _ in range(num_students)]

    # Generate random religion
    religion_options = ['Roman Catholic', 'Born - Again Christian', 'Iglesia Ni Cristo', 'Islam', 'Jehovah\'s Witness', 'Baptist', 'Seventh-Day Adventist', 'Members Church of God International', 'Protestant/Pentecostal', 'Methodist', 'LDS Mormon', 'Aglipay', 'Atheist', 'No Religion', 'The Church of Jesus Christ of Latter-Day Saints', 'Agnostic', 'World Mission Society Church of God', 'Undetermined']
    student_religion = [random.choice(religion_options) for _ in range(num_students)]

    # Generate random barangay
    barangay_options = ['Bagong Ilog', 'Bagong Katipunan', 'Bambang', 'Buting', 'Caniogan', 'Dela Paz', 'Kalawaan', 'Kapasigan', 'Kapitolyo', 'Malinao', 'Manggahan', 'Maybunga', 'Oranbo', 'Palatiw', 'Pineda', 'Rosario', 'Sagad', 'San Antonio', 'San Joaquin', 'San Jose', 'San Miguel', 'Santa Cruz', 'Santa Lucia', 'Santa Rosa', 'Santo Tomas', 'Santolan', 'Sumilang', 'Ugong', 'San Nicolas', 'Pinagbuhatan', 'Cainta', 'Taytay', 'Taguig City', 'Pateros', 'Antipolo', 'Marikina City', 'Binangonan', 'Mandaluyong City', 'Montalban, Rizal', 'Quezon City', 'Bulacan', 'Catanduanes', 'Cavite', 'Teresa']
    student_barangay = [random.choice(barangay_options) for _ in range(num_students)]

    return student_ids, student_genders, student_ages, student_courses, student_feeder_school_types, student_civil_status, student_family_monthly_income, student_religion, student_barangay

# Example usage
student_ids, student_genders, student_ages, student_courses, student_feeder_school_types, student_civil_status, student_family_monthly_income, student_religion, student_barangay = generate_student_data(3500)

# Create the DataFrame
data = {
    'studentID': student_ids,
    'gender': student_genders,
    'age': student_ages,
    'course': student_courses,
    'feederSchoolType': student_feeder_school_types,
    'civilStatus': student_civil_status,
    'familyMonthlyIncome': student_family_monthly_income,
    'religion': student_religion,
    'barangay': student_barangay,
}
df = pd.DataFrame(data)

# Save the DataFrame to a CSV file
df.to_csv('cleaned_data_sample.csv', index=False)