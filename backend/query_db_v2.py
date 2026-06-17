import sys
import os

_BASE = os.path.dirname(os.path.abspath(__file__))
if _BASE not in sys.path:
    sys.path.insert(0, _BASE)

from dotenv import load_dotenv
load_dotenv(os.path.join(_BASE, ".env"))

from hp_src.config.database import db

res = db.execute_query("SELECT table_name FROM information_schema.tables WHERE table_schema='public';")
tables = [r['table_name'] for r in res]
print("Tables:", tables)

if 'health_packages' in tables:
    res = db.execute_query("SELECT * FROM health_packages LIMIT 2;")
    print("Health Packages Data:", res)
elif 'packages' in tables:
    res = db.execute_query("SELECT * FROM packages LIMIT 2;")
    print("Packages Data:", res)
