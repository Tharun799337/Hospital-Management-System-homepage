import sys
import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from hp_src.config.database import db

docs = db.execute_query("SELECT id, name, available_days FROM doctors LIMIT 20", fetch_all=True)
for d in docs:
    print(f"{d['id']} - {d['name']}: {d['available_days']}")
