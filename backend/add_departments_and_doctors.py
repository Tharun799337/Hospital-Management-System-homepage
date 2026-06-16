import sys
import os
import uuid
import random
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from hp_src.config.database import db

new_departments = [
    {"id": "DEPT013", "name": "Dermatology"},
    {"id": "DEPT014", "name": "Psychiatry"},
    {"id": "DEPT015", "name": "Urology"},
    {"id": "DEPT016", "name": "Endocrinology"},
    {"id": "DEPT017", "name": "Ophthalmology"},
    {"id": "DEPT018", "name": "Dentistry"}
]

new_doctors = [
    {
        "name": "Dr. Sophia Carter",
        "email": "sophia.carter@havedahospital.com",
        "phone": "+1-555-0201",
        "specialization": "Cosmetic Dermatology",
        "department_id": "DEPT013",
        "department": "Dermatology",
        "qualification": "MD, FAAD",
        "experience_years": 10,
        "license_number": "MD-DERM-1029",
        "rating": 4.9,
        "photo": "https://plus.unsplash.com/premium_photo-1661766718556-13c2efac1388?auto=format&fit=crop&q=80&w=800",
        "available_days": '["Monday", "Wednesday", "Friday"]',
        "timings": "09:00 AM - 04:00 PM",
        "consultation_fee": 160.00
    },
    {
        "name": "Dr. Liam O'Connor",
        "email": "liam.oconnor@havedahospital.com",
        "phone": "+1-555-0202",
        "specialization": "Adult Psychiatry",
        "department_id": "DEPT014",
        "department": "Psychiatry",
        "qualification": "MD, Board Certified",
        "experience_years": 15,
        "license_number": "MD-PSY-3456",
        "rating": 4.8,
        "photo": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=800",
        "available_days": '["Tuesday", "Thursday", "Saturday"]',
        "timings": "10:00 AM - 06:00 PM",
        "consultation_fee": 180.00
    },
    {
        "name": "Dr. William Zhang",
        "email": "william.zhang@havedahospital.com",
        "phone": "+1-555-0203",
        "specialization": "Urologic Oncology",
        "department_id": "DEPT015",
        "department": "Urology",
        "qualification": "MD, FACS",
        "experience_years": 20,
        "license_number": "MD-URO-7890",
        "rating": 4.7,
        "photo": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800",
        "available_days": '["Monday", "Thursday", "Friday"]',
        "timings": "08:00 AM - 03:00 PM",
        "consultation_fee": 200.00
    },
    {
        "name": "Dr. Chloe Martin",
        "email": "chloe.martin@havedahospital.com",
        "phone": "+1-555-0204",
        "specialization": "Diabetes & Metabolism",
        "department_id": "DEPT016",
        "department": "Endocrinology",
        "qualification": "MD, FACE",
        "experience_years": 12,
        "license_number": "MD-END-5678",
        "rating": 4.9,
        "photo": "https://images.unsplash.com/photo-1594824406564-cb410a5629c4?auto=format&fit=crop&q=80&w=800",
        "available_days": '["Wednesday", "Friday", "Saturday"]',
        "timings": "11:00 AM - 07:00 PM",
        "consultation_fee": 150.00
    },
    {
        "name": "Dr. Ethan Wright",
        "email": "ethan.wright@havedahospital.com",
        "phone": "+1-555-0205",
        "specialization": "Retina & Vitreous Surgery",
        "department_id": "DEPT017",
        "department": "Ophthalmology",
        "qualification": "MD, FAAO",
        "experience_years": 18,
        "license_number": "MD-OPH-1234",
        "rating": 5.0,
        "photo": "https://images.unsplash.com/photo-1582750433449-648ed127d09e?auto=format&fit=crop&q=80&w=800",
        "available_days": '["Tuesday", "Thursday"]',
        "timings": "09:00 AM - 05:00 PM",
        "consultation_fee": 170.00
    },
    {
        "name": "Dr. Ava Mitchell",
        "email": "ava.mitchell@havedahospital.com",
        "phone": "+1-555-0206",
        "specialization": "Orthodontics",
        "department_id": "DEPT018",
        "department": "Dentistry",
        "qualification": "DDS, MS",
        "experience_years": 9,
        "license_number": "DDS-DEN-9876",
        "rating": 4.8,
        "photo": "https://images.unsplash.com/photo-1527613426400-9ce99a8a46c6?auto=format&fit=crop&q=80&w=800",
        "available_days": '["Monday", "Wednesday", "Thursday"]',
        "timings": "08:30 AM - 04:30 PM",
        "consultation_fee": 120.00
    },
    {
        "name": "Dr. Lucas Rivera",
        "email": "lucas.rivera@havedahospital.com",
        "phone": "+1-555-0207",
        "specialization": "Pediatric Cardiology",
        "department_id": "DEPT001",
        "department": "Cardiology",
        "qualification": "MD, FACC",
        "experience_years": 14,
        "license_number": "MD-CARD-1122",
        "rating": 4.9,
        "photo": "https://plus.unsplash.com/premium_photo-1664475450083-5c9eef17a191?auto=format&fit=crop&q=80&w=800",
        "available_days": '["Monday", "Tuesday", "Wednesday"]',
        "timings": "09:00 AM - 05:00 PM",
        "consultation_fee": 180.00
    },
    {
        "name": "Dr. Grace Lee",
        "email": "grace.lee@havedahospital.com",
        "phone": "+1-555-0208",
        "specialization": "Sports Medicine",
        "department_id": "DEPT003",
        "department": "Orthopedics",
        "qualification": "MD, CAQSM",
        "experience_years": 11,
        "license_number": "MD-ORTHO-3344",
        "rating": 4.8,
        "photo": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800",
        "available_days": '["Thursday", "Friday", "Saturday"]',
        "timings": "10:00 AM - 06:00 PM",
        "consultation_fee": 160.00
    }
]

def add_departments_and_doctors():
    # Insert new departments
    for dept in new_departments:
        existing = db.execute_query("SELECT id FROM departments WHERE id = %s OR name = %s", (dept['id'], dept['name']), fetch_all=False)
        if not existing:
            query = "INSERT INTO departments (id, name, created_at, is_active) VALUES (%s, %s, CURRENT_TIMESTAMP, true)"
            db.execute_query(query, (dept['id'], dept['name']), fetch_all=False)
            print(f"Added department: {dept['name']}")
        else:
            print(f"Department {dept['name']} already exists.")

    # Insert new doctors
    for doc in new_doctors:
        existing = db.execute_query("SELECT id FROM doctors WHERE email = %s", (doc['email'],), fetch_all=False)
        if existing:
            print(f"Doctor {doc['name']} already exists.")
            continue
            
        doc_id = "DOC" + str(uuid.uuid4().hex[:6]).upper()
        
        query = """
        INSERT INTO doctors (
            id, name, email, phone, specialization, department_id, department, 
            qualification, experience_years, license_number, rating, photo, 
            available_days, timings, consultation_fee, is_active
        ) VALUES (
            %s, %s, %s, %s, %s, %s, %s,
            %s, %s, %s, %s, %s,
            %s, %s, %s, true
        )
        """
        params = (
            doc_id, doc['name'], doc['email'], doc['phone'], doc['specialization'], 
            doc['department_id'], doc['department'], doc['qualification'], 
            doc['experience_years'], doc['license_number'], doc['rating'], doc['photo'],
            doc['available_days'], doc['timings'], doc['consultation_fee']
        )
        db.execute_query(query, params, fetch_all=False)
        print(f"Added doctor {doc['name']} ({doc['department']})")

if __name__ == "__main__":
    add_departments_and_doctors()
    print("Successfully added new departments and doctors to the database!")
