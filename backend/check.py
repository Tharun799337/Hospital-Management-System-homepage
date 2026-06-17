import os
import sys
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from hp_src.config.database import db

docs = db.execute_query("SELECT name, photo FROM doctors")
for d in docs:
    print(d)
