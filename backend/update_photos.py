import sys
import os
from dotenv import load_dotenv
import re

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from hp_src.config.database import db

female_photos = [
    "https://images.unsplash.com/photo-1594824406564-cb410a5629c4?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=800",
    "https://plus.unsplash.com/premium_photo-1661766718556-13c2efac1388?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1527613426400-9ce99a8a46c6?auto=format&fit=crop&q=80&w=800",
    "https://plus.unsplash.com/premium_photo-1681996484614-6af3ad04cb2d?auto=format&fit=crop&q=80&w=800"
]

male_photos = [
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=800",
    "https://plus.unsplash.com/premium_photo-1661764878654-3d0fc2eefaeb?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1582750433449-648ed127d09e?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&q=80&w=800",
    "https://plus.unsplash.com/premium_photo-1664475450083-5c9eef17a191?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&q=80&w=800"
]

def update_photos():
    doctors = db.execute_query("SELECT id, name FROM doctors")
    female_idx = 0
    male_idx = 0
    for doc in doctors:
        n = doc['name'].lower()
        is_female = bool(re.search(r'\b(sarah|priya|neha|anjali|riya|women|mrs|miss|dr\.?\s*s|dr\.?\s*p|aisha)\b', n)) or n.split(' ')[0].endswith('a') or n.split(' ')[0].endswith('i')
        
        if is_female:
            photo = female_photos[female_idx % len(female_photos)]
            female_idx += 1
        else:
            photo = male_photos[male_idx % len(male_photos)]
            male_idx += 1
            
        print(f"Updating {doc['name']} with {photo}")
        db.execute_query("UPDATE doctors SET photo = %s WHERE id = %s", (photo, doc['id']), fetch_all=False)

if __name__ == "__main__":
    update_photos()
    print("Done")
