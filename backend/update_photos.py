import sys
import os
from dotenv import load_dotenv
import re

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from hp_src.config.database import db

female_photos = [
    "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/8376277/pexels-photo-8376277.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/8460159/pexels-photo-8460159.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/5214995/pexels-photo-5214995.jpeg?auto=compress&cs=tinysrgb&w=800"
]

male_photos = [
    "https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/8460157/pexels-photo-8460157.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=800"
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
