import sys
import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from hp_src.config.database import db

def delete_doctors():
    names_to_delete = [
        "Harper Johnson",
        "Henry Lopez",
        "Liam Miller",
        "Lucas Johnson",
        "SIRISHA",
        "Noah Anderson",
        "Mia Miller",
        "Meera Gupta"
    ]
    
    # Fetch all doctors
    all_doctors = db.execute_query("SELECT id, name, department_id FROM doctors", fetch_all=True)
    
    docs_to_delete = []
    for d in all_doctors:
        for n in names_to_delete:
            if n.lower() in d['name'].lower():
                docs_to_delete.append(d)
                break
                
    if not docs_to_delete:
        print("None of the specified doctors were found.")
        return
        
    print(f"Found {len(docs_to_delete)} doctors to delete: {[d['name'] for d in docs_to_delete]}")
    
    # We need a fallback valid doctor for each department to reassign FKs to
    # We will pick the first valid doctor in each department who is NOT being deleted
    dept_fallback = {}
    for d in all_doctors:
        if d not in docs_to_delete:
            if d['department_id'] not in dept_fallback:
                dept_fallback[d['department_id']] = d['id']
                
    for doc in docs_to_delete:
        print(f"Processing deletion for {doc['name']}...")
        fallback_id = dept_fallback.get(doc['department_id'])
        
        if not fallback_id:
            print(f"  WARNING: No fallback doctor found for department {doc['department_id']}. Trying any other valid doctor.")
            if dept_fallback:
                fallback_id = list(dept_fallback.values())[0]
            else:
                print("  FATAL: No other doctors exist in the DB at all to reassign references!")
                continue
                
        # 1. Detach staff
        db.execute_query("UPDATE staff SET assigned_doctor_id = NULL WHERE assigned_doctor_id = %s", (doc['id'],), fetch_all=False)
        
        # 2. Dynamic FK reassignment
        refs = db.execute_query("""
            SELECT tc.table_name, kcu.column_name
            FROM information_schema.table_constraints AS tc
            JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name
            JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
            WHERE constraint_type = 'FOREIGN KEY' AND ccu.table_name='doctors' AND ccu.column_name='id';
        """, fetch_all=True)
        
        for ref in refs:
            try:
                db.execute_query(f"UPDATE {ref['table_name']} SET {ref['column_name']} = %s WHERE {ref['column_name']} = %s", (fallback_id, doc['id']), fetch_all=False)
            except Exception:
                pass
                
        # 3. Delete doctor
        db.execute_query("DELETE FROM doctors WHERE id = %s", (doc['id'],), fetch_all=False)
        print(f"  -> Deleted {doc['name']} ({doc['id']})")
        
    print("Done!")

if __name__ == "__main__":
    delete_doctors()
