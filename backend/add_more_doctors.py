import sys
import os
import uuid
import random
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from hp_src.config.database import db

new_doctors = [
    {
        "name": "Dr. Elena Rodriguez",
        "email": "elena.rodriguez@havedahospital.com",
        "phone": "+1-555-0101",
        "specialization": "Interventional Cardiology",
        "department_id": "DEPT001",
        "department": "Cardiology",
        "qualification": "MD, FACC",
        "experience_years": 14,
        "license_number": "MD-CARD-8921",
        "rating": 4.9,
        "photo": "https://images.unsplash.com/photo-1594824406564-cb410a5629c4?auto=format&fit=crop&q=80&w=800",
        "available_days": '["Monday", "Wednesday", "Friday"]',
        "timings": "09:00 AM - 05:00 PM",
        "consultation_fee": 150.00
    },
    {
        "name": "Dr. Marcus Chen",
        "email": "marcus.chen@havedahospital.com",
        "phone": "+1-555-0102",
        "specialization": "Neurosurgery",
        "department_id": "DEPT002",
        "department": "Neurology",
        "qualification": "MD, PhD",
        "experience_years": 18,
        "license_number": "MD-NEURO-7432",
        "rating": 4.8,
        "photo": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800",
        "available_days": '["Tuesday", "Thursday", "Saturday"]',
        "timings": "10:00 AM - 06:00 PM",
        "consultation_fee": 200.00
    },
    {
        "name": "Dr. Sarah Jenkins",
        "email": "sarah.jenkins@havedahospital.com",
        "phone": "+1-555-0103",
        "specialization": "Pediatric Surgery",
        "department_id": "DEPT004",
        "department": "Pediatrics",
        "qualification": "MD, FAAP",
        "experience_years": 12,
        "license_number": "MD-PED-5521",
        "rating": 5.0,
        "photo": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800",
        "available_days": '["Monday", "Tuesday", "Thursday"]',
        "timings": "08:00 AM - 04:00 PM",
        "consultation_fee": 120.00
    },
    {
        "name": "Dr. James Wilson",
        "email": "james.wilson@havedahospital.com",
        "phone": "+1-555-0104",
        "specialization": "Orthopedic Surgery",
        "department_id": "DEPT003",
        "department": "Orthopedics",
        "qualification": "MD, FAAOS",
        "experience_years": 22,
        "license_number": "MD-ORTHO-1192",
        "rating": 4.7,
        "photo": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=800",
        "available_days": '["Wednesday", "Friday"]',
        "timings": "09:00 AM - 05:00 PM",
        "consultation_fee": 180.00
    },
    {
        "name": "Dr. Aisha Patel",
        "email": "aisha.patel@havedahospital.com",
        "phone": "+1-555-0105",
        "specialization": "Gynecologic Oncology",
        "department_id": "DEPT007",
        "department": "Gynecology",
        "qualification": "MD, FACOG",
        "experience_years": 16,
        "license_number": "MD-GYN-9934",
        "rating": 4.9,
        "photo": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800",
        "available_days": '["Monday", "Wednesday", "Friday"]',
        "timings": "10:00 AM - 06:00 PM",
        "consultation_fee": 160.00
    },
    {
        "name": "Dr. David Kim",
        "email": "david.kim@havedahospital.com",
        "phone": "+1-555-0106",
        "specialization": "Medical Oncology",
        "department_id": "DEPT006",
        "department": "Oncology",
        "qualification": "MD",
        "experience_years": 15,
        "license_number": "MD-ONC-2234",
        "rating": 4.8,
        "photo": "https://plus.unsplash.com/premium_photo-1661764878654-3d0fc2eefaeb?auto=format&fit=crop&q=80&w=800",
        "available_days": '["Tuesday", "Thursday"]',
        "timings": "09:00 AM - 05:00 PM",
        "consultation_fee": 190.00
    }
]

def add_doctors():
    for doc in new_doctors:
        # Check if email already exists
        existing = db.execute_query("SELECT id FROM doctors WHERE email = %s", (doc['email'],), fetch_all=False)
        if existing:
            print(f"Doctor {doc['name']} already exists, updating photo...")
            db.execute_query("UPDATE doctors SET photo = %s WHERE email = %s", (doc['photo'], doc['email']), fetch_all=False)
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
        print(f"Added {doc['name']} ({doc['department']})")

if __name__ == "__main__":
    add_doctors()
    print("Successfully added new doctors to the database!")
