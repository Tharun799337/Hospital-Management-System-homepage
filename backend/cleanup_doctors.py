import sys
import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from hp_src.config.database import db

def cleanup_doctors():
    # Fetch all doctors
    doctors = db.execute_query("SELECT id, name, department_id, photo FROM doctors", fetch_all=True)
    
    # Group by department
    dept_doctors = {}
    for d in doctors:
        dept_doctors.setdefault(d['department_id'], []).append(d)
        
    to_delete = []
    
    for dept_id, docs in dept_doctors.items():
        if len(docs) > 4:
            print(f"Department {dept_id} has {len(docs)} doctors. Need to remove {len(docs) - 4}.")
            # Sort doctors: prefer keeping ones with unsplash photos
            docs.sort(key=lambda x: 1 if x['photo'] and 'unsplash' in x['photo'] else 0, reverse=True)
            
            # The first 4 are kept, the rest are deleted
            for extra_doc in docs[4:]:
                to_delete.append(extra_doc)
                print(f"  -> Marking {extra_doc['name']} for deletion.")

    if not to_delete:
        print("All departments have 4 or fewer doctors. No cleanup needed.")
        return

    print(f"\nDeleting {len(to_delete)} extra doctors...")
    for doc in to_delete:
        # Check constraints first
        # 1. Detach staff instead of deleting them to avoid cascading constraint errors
        db.execute_query("UPDATE staff SET assigned_doctor_id = NULL WHERE assigned_doctor_id = %s", (doc['id'],), fetch_all=False)
        # 2. Reassign ALL foreign keys to the first kept doctor in the same department
        valid_doc_id = docs[0]['id']
        refs = db.execute_query("""
            SELECT tc.table_name, kcu.column_name
            FROM information_schema.table_constraints AS tc
            JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name
            JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
            WHERE constraint_type = 'FOREIGN KEY' AND ccu.table_name='doctors' AND ccu.column_name='id';
        """, fetch_all=True)
        
        for ref in refs:
            try:
                db.execute_query(f"UPDATE {ref['table_name']} SET {ref['column_name']} = %s WHERE {ref['column_name']} = %s", (valid_doc_id, doc['id']), fetch_all=False)
            except Exception:
                pass
        
        # 4. Delete doctor
        db.execute_query("DELETE FROM doctors WHERE id = %s", (doc['id'],), fetch_all=False)
        print(f"Deleted {doc['name']} ({doc['id']})")
        
    print("\nCleanup complete! Checking final counts...")
    final_counts = db.execute_query("""
        SELECT d.name as dept_name, count(doc.id) as doctor_count 
        FROM departments d 
        LEFT JOIN doctors doc ON d.id = doc.department_id 
        GROUP BY d.name
        ORDER BY doctor_count DESC
    """)
    for row in final_counts:
        print(f"{row['dept_name']}: {row['doctor_count']} doctors")

if __name__ == "__main__":
    cleanup_doctors()
