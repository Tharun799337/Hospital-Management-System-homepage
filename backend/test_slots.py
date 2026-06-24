import requests
import sys
import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from hp_src.config.database import db

def test_slots():
    docs = db.execute_query("SELECT id, name FROM doctors LIMIT 1", fetch_all=True)
    if not docs:
        print("No doctors found")
        return
        
    doc_id = docs[0]['id']
    print(f"Testing slots for doctor {doc_id} ({docs[0]['name']})")
    
    url = f"http://localhost:5001/api/homepage/doctors/{doc_id}/slots?date=2026-06-25"
    try:
        response = requests.get(url)
        print("Status Code:", response.status_code)
        print("Response:", response.json())
    except Exception as e:
        print("Request failed:", str(e))

if __name__ == "__main__":
    test_slots()
