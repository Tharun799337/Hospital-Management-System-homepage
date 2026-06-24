import sys
import os
import uuid
import random
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from hp_src.config.database import db

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

names = ["James", "Emma", "Liam", "Olivia", "Noah", "Ava", "William", "Sophia", "Lucas", "Isabella", "Benjamin", "Mia", "Henry", "Evelyn", "Alexander", "Harper"]
surnames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson"]

def fill_missing():
    counts = db.execute_query("""
        SELECT d.id, d.name, count(doc.id) as doctor_count 
        FROM departments d 
        LEFT JOIN doctors doc ON d.id = doc.department_id 
        GROUP BY d.id, d.name
    """, fetch_all=True)

    for row in counts:
        missing = 4 - row['doctor_count']
        if missing > 0:
            print(f"Department {row['name']} has {row['doctor_count']} doctors. Adding {missing} more...")
            for i in range(missing):
                first_name = random.choice(names)
                last_name = random.choice(surnames)
                name = f"Dr. {first_name} {last_name}"
                email = f"{first_name.lower()}.{last_name.lower()}{random.randint(100, 999)}@havedahospital.com"
                photo = random.choice(doctor_photos)
                
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
                    doc_id, name, email, f"+1-555-{random.randint(1000, 9999)}", 
                    f"{row['name']} Specialist", row['id'], row['name'], 
                    "MD, Board Certified", random.randint(5, 25), 
                    f"MD-{row['name'][:3].upper()}-{random.randint(1000, 9999)}", 
                    round(random.uniform(4.5, 5.0), 1), photo,
                    '["Monday", "Wednesday", "Friday"]', "09:00 AM - 05:00 PM", 
                    random.choice([150.00, 180.00, 200.00, 250.00])
                )
                db.execute_query(query, params, fetch_all=False)
                print(f"  -> Added {name} to {row['name']}")
                
    print("\nFinal Check:")
    final_counts = db.execute_query("""
        SELECT d.name, count(doc.id) as doctor_count 
        FROM departments d 
        LEFT JOIN doctors doc ON d.id = doc.department_id 
        GROUP BY d.name
        ORDER BY doctor_count DESC
    """)
    for row in final_counts:
        print(f"{row['name']}: {row['doctor_count']} doctors")

if __name__ == "__main__":
    fill_missing()
