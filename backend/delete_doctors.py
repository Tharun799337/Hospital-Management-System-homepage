import sys
import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from hp_src.config.database import db

def delete_doctors():
    # Names to search for: 'lasya', 'sai', 'Liam Smith' (case-insensitive search)
    queries = [
        "DELETE FROM doctors WHERE name ILIKE '%lasya%'",
        "DELETE FROM appointments WHERE doctor_id IN (SELECT id FROM doctors WHERE name ILIKE '%sai%')",
        "DELETE FROM staff WHERE assigned_doctor_id IN (SELECT id FROM doctors WHERE name ILIKE '%sai%')",
        "DELETE FROM doctors WHERE name ILIKE '%sai%'",
        "DELETE FROM doctors WHERE name ILIKE '%Liam Smith%'"
    ]
    
    for q in queries:
        try:
            db.execute_query(q, fetch_all=False)
            print(f"Executed: {q}")
        except Exception as e:
            print(f"Error executing {q}: {e}")

if __name__ == "__main__":
    print("Checking current matching doctors...")
    try:
        docs = db.execute_query("SELECT name FROM doctors WHERE name ILIKE '%lasya%' OR name ILIKE '%sai%' OR name ILIKE '%Liam Smith%'")
        if docs:
            print(f"Found {len(docs)} doctors to delete: {[d['name'] for d in docs]}")
        else:
            print("No matching doctors found.")
    except Exception as e:
         pass
         
    print("\nDeleting doctors...")
    delete_doctors()
    print("Done!")
