import sys
import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from hp_src.config.database import db

db.execute_query("UPDATE doctors SET available_days = 'Mon-Sun'")
print("Updated available_days to Mon-Sun for all doctors")
