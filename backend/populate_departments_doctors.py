import sys
import os
import uuid
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from hp_src.config.database import db

departments = [
    {"id": "DEPT001", "name": "Cardiology"},
    {"id": "DEPT002", "name": "Neurology"},
    {"id": "DEPT003", "name": "Orthopedics"},
    {"id": "DEPT004", "name": "Pediatrics"},
    {"id": "DEPT005", "name": "Oncology"},
    {"id": "DEPT006", "name": "Gynecology"},
    {"id": "DEPT013", "name": "Dermatology"},
    {"id": "DEPT014", "name": "Psychiatry"},
    {"id": "DEPT015", "name": "Urology"},
    {"id": "DEPT016", "name": "Endocrinology"},
    {"id": "DEPT017", "name": "Ophthalmology"},
    {"id": "DEPT018", "name": "Dentistry"},
    {"id": "DEPT019", "name": "Gastroenterology"},
    {"id": "DEPT020", "name": "Pulmonology"},
    {"id": "DEPT021", "name": "ENT"},
    {"id": "DEPT022", "name": "General Surgery"}
]

# Provide reliable doctor photos (high quality Unsplash medical portraits)
doctor_photos = [
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1594824406564-cb410a5629c4?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800",
    "https://plus.unsplash.com/premium_photo-1661766718556-13c2efac1388?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1582750433449-648ed127d09e?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1527613426400-9ce99a8a46c6?auto=format&fit=crop&q=80&w=800",
    "https://plus.unsplash.com/premium_photo-1664475450083-5c9eef17a191?auto=format&fit=crop&q=80&w=800"
]

def generate_doctors():
    doctors_data = []
    names = ["James", "Emma", "Liam", "Olivia", "Noah", "Ava", "William", "Sophia", "Lucas", "Isabella", "Benjamin", "Mia", "Henry", "Evelyn", "Alexander", "Harper"]
    surnames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson"]

    for dept in departments:
        for i in range(4): # 4 doctors per department
            first_name = names[(hash(dept['name']) + i * 3) % len(names)]
            last_name = surnames[(hash(dept['name']) + i * 5) % len(surnames)]
            name = f"Dr. {first_name} {last_name}"
            email = f"{first_name.lower()}.{last_name.lower()}{i}@havedahospital.com"
            photo = doctor_photos[(hash(dept['name']) + i) % len(doctor_photos)]
            
            doc = {
                "name": name,
                "email": email,
                "phone": f"+1-555-{random.randint(1000, 9999)}",
                "specialization": dept['name'] + " Specialist",
                "department_id": dept['id'],
                "department": dept['name'],
                "qualification": "MD, Board Certified",
                "experience_years": random.randint(5, 25),
                "license_number": f"MD-{dept['name'][:3].upper()}-{random.randint(1000, 9999)}",
                "rating": round(random.uniform(4.5, 5.0), 1),
                "photo": photo,
                "available_days": '["Monday", "Wednesday", "Friday"]',
                "timings": "09:00 AM - 05:00 PM",
                "consultation_fee": random.choice([150.00, 180.00, 200.00, 250.00])
            }
            doctors_data.append(doc)
    return doctors_data

import random

def populate_db():
    print("Creating departments table if not exists...")
    db.execute_query("""
    CREATE TABLE IF NOT EXISTS departments (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        icon VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT true
    )
    """, fetch_all=False)

    print("Inserting departments...")
    for dept in departments:
        existing = db.execute_query("SELECT id FROM departments WHERE id = %s OR name = %s", (dept['id'], dept['name']), fetch_all=False)
        if not existing:
            query = "INSERT INTO departments (id, name, created_at, is_active) VALUES (%s, %s, CURRENT_TIMESTAMP, true)"
            db.execute_query(query, (dept['id'], dept['name']), fetch_all=False)
            print(f"Added department: {dept['name']}")
        else:
            dept['id'] = existing['id'] # Make sure we use the existing DB id for the doctors later
            print(f"Department {dept['name']} already exists.")
    
    print("Generating and inserting doctors...")
    doctors = generate_doctors()
    
    for doc in doctors:
        existing = db.execute_query("SELECT id FROM doctors WHERE email = %s", (doc['email'],), fetch_all=False)
        if existing:
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
    print("Successfully populated exactly 4 doctors for all departments!")

if __name__ == "__main__":
    populate_db()
