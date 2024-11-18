import random
import csv

def generate_random_emails(count=100):
    """Generate random Gmail addresses using combinations of first and last names."""
    first_names = [
        'james', 'john', 'robert', 'michael', 'william', 'david', 'richard', 'joseph',
        'thomas', 'charles', 'christopher', 'daniel', 'matthew', 'anthony', 'donald',
        'mary', 'patricia', 'jennifer', 'linda', 'elizabeth', 'barbara', 'susan',
        'jessica', 'sarah', 'karen', 'lisa', 'nancy', 'betty', 'margaret', 'sandra',
        'ashley', 'emma', 'olivia', 'ava', 'sophia', 'isabella', 'mia', 'charlotte',
        'amelia', 'harper', 'evelyn', 'abigail', 'emily', 'ella', 'elizabeth',
        'noah', 'liam', 'mason', 'jacob', 'william', 'ethan', 'oliver', 'lucas'
    ]
    
    last_names = [
        'smith', 'johnson', 'williams', 'brown', 'jones', 'garcia', 'miller', 'davis',
        'rodriguez', 'martinez', 'hernandez', 'lopez', 'gonzalez', 'wilson', 'anderson',
        'thomas', 'taylor', 'moore', 'jackson', 'martin', 'lee', 'perez', 'thompson',
        'white', 'harris', 'sanchez', 'clark', 'ramirez', 'lewis', 'robinson', 'walker',
        'young', 'allen', 'king', 'wright', 'scott', 'torres', 'nguyen', 'hill', 'flores',
        'green', 'adams', 'nelson', 'baker', 'hall', 'rivera', 'campbell', 'mitchell'
    ]
    
    emails = set()
    while len(emails) < count:
        first = random.choice(first_names)
        last = random.choice(last_names)
        
        pattern = random.randint(1, 3)
        if pattern == 1:
            email = f"{first}.{last}@gmail.com"
        elif pattern == 2:
            email = f"{first[0]}.{last}@gmail.com"
        else:
            email = f"{first}.{last}{random.randint(1, 999)}@gmail.com"
        
        emails.add(email.lower())
    
    return sorted(list(emails))

def generate_user_data(count=100):
    """
    Generate comprehensive student data including email, demographics, location,
    education, financial information, and academic status.
    """
    emails = generate_random_emails(count)
    
    # Basic Demographics
    age_ranges = [
        'below 18 years old', '18 years old', '19 years old', '20 years old',
        '21 years old', '22 years old', '23 years old', '24 years old',
        '25 years old and above'
    ]
    
    civil_status_options = [
        'Single', 'Married', 'Widower', 'Separated', 'Single Parent',
        'Living with Partner'
    ]
    
    years_in_pasig_ranges = [
        'less than 1 year', '1 - 5 years', '6 - 10 years', '11 - 15 years',
        '16 - 20 years', '21 - 25 years', '26 years and above'
    ]
    
    # Define Pasig barangays
    pasig_barangays = [
        'Bagong Ilog', 'Bagong Katipunan', 'Bambang', 'Buting', 'Caniogan',
        'Dela Paz', 'Kalawaan', 'Kapasigan', 'Kapitolyo', 'Malinao',
        'Manggahan', 'Maybunga', 'Oranbo', 'Palatiw', 'Pinagbuhatan', 'Pineda',
        'Rosario', 'Sagad', 'San Antonio', 'San Joaquin', 'San Jose', 'San Miguel',
        'San Nicolas', 'Santa Cruz', 'Santa Lucia', 'Santa Rosa', 'Santo Tomas',
        'Santolan', 'Sumilang', 'Ugong'
    ]
    
    # Non-Pasig locations
    other_locations = [
        'Cainta', 'Taytay', 'Taguig City', 'Pateros', 'Antipolo', 'Marikina City',
        'Binangonan', 'Mandaluyong City', 'Montalban, Rizal', 'Quezon City',
        'Bulacan', 'Catanduanes', 'Cavite', 'Teresa'
    ]

    income_ranges = [
        'Less than Php9,520',
        'Between Php9,520 to Php21,194',
        'Between Php21,195 to Php43,838',
        'Between Php43,839 to Php76,669',
        'Between Php76,670 to Php131,484',
        'Between Php131,485 to Php219,140',
        'From Php219,140 and up'
    ]

    religions = [
        'Roman Catholic', 'Born - Again Christian', 'Iglesia Ni Cristo', 'Islam',
        'Jehovah\'s Witness', 'Baptist', 'Seventh-Day Adventist',
        'Members Church of God International', 'Protestant/Pentecostal', 'Methodist',
        'LDS Mormon', 'Aglipay', 'Atheist', 'No Religion',
        'The Church of Jesus Christ of Latter-Day Saints', 'Agnostic',
        'World Mission Society Church of God', 'Undetermined'
    ]

    curricular_programs = [
        'BSCS', 'BSIT', 'BSA', 'BSBA', 'BEED', 'BSED-FIL', 'BSED-ENG',
        'BSED-MATH', 'BSN', 'BSECE', 'BSHM', 'ABPSYCH'
    ]

    shs_strands = ['ABM', 'STEM', 'HUMSS', 'GAS', 'Sports Track', 'TVL Track']
    
    probabilities = {
        'lgbtqia': 0.1,
        'pasigueno': 0.7,
        'irregular': 0.3,
        'working_student': 0.25,
        'deans_lister': 0.15,
        'presidents_lister': 0.05,
        'private_school': 0.4,
        'pwd': 0.05
    }
    
    users = []
    
    for email in emails:
        sex = random.choice(['Male', 'Female'])
        is_lgbtqia = 'Yes' if random.random() < probabilities['lgbtqia'] else 'No'
        age = random.choice(age_ranges)
        civil_status = random.choice(civil_status_options)
        
        # First determine if they should be a Pasigueno based on probability
        initial_is_pasigueno = 'Yes' if random.random() < probabilities['pasigueno'] else 'No'
        
        # Select barangay based on Pasigueno status
        if initial_is_pasigueno == 'Yes':
            barangay = random.choice(pasig_barangays)
            is_pasigueno = 'Yes'  # This is definitely a Pasig resident
            years_in_pasig = random.choice(years_in_pasig_ranges)
        else:
            barangay = random.choice(other_locations)
            is_pasigueno = 'No'  # This is definitely not a Pasig resident
            years_in_pasig = 'less than 1 year'
        
        family_monthly_income = random.choice(income_ranges)
        religion = random.choice(religions)
        curricular_program = random.choice(curricular_programs)
        academic_status = 'Irregular' if random.random() < probabilities['irregular'] else 'Regular'
        working_student = 'Yes' if random.random() < probabilities['working_student'] else 'No'
        
        random_val = random.random()
        deans_lister = 'No'
        presidents_lister = 'No'
        if random_val < probabilities['presidents_lister']:
            presidents_lister = 'Yes'
        elif random_val < probabilities['presidents_lister'] + probabilities['deans_lister']:
            deans_lister = 'Yes'
        
        feeder_school = 'Private' if random.random() < probabilities['private_school'] else 'Public'
        strand_in_shs = random.choice(shs_strands)
        is_pwd = 'Yes' if random.random() < probabilities['pwd'] else 'No'
        
        user = {
            'email': email,
            'sex': sex,
            'isLGBTQIA': is_lgbtqia,
            'age': age,
            'civilStatus': civil_status,
            'isPasigueno': is_pasigueno,
            'yearsInPasig': years_in_pasig,
            'barangay': barangay,
            'familyMonthlyIncome': family_monthly_income,
            'religion': religion,
            'curricularProgram': curricular_program,
            'academicStatus': academic_status,
            'workingStudent': working_student,
            'deansLister': deans_lister,
            'presidentsLister': presidents_lister,
            'feederSchool': feeder_school,
            'strandInSHS': strand_in_shs,
            'isPWD': is_pwd
        }
        users.append(user)
    
    return users

if __name__ == "__main__":
    # Generate 2534 users
    users = generate_user_data(2534)
    
    # Define the CSV filename
    filename = "students_ecological_profile_sample.csv"
    
    # Write to CSV file
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        # Get the headers from the first user dictionary
        headers = list(users[0].keys())
        
        # Create CSV writer
        writer = csv.DictWriter(csvfile, fieldnames=headers)
        
        # Write the headers
        writer.writeheader()
        
        # Write all user data
        writer.writerows(users)
    
    print(f"Successfully generated {len(users)} student records and saved to {filename}")