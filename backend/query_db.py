import os
from dotenv import load_dotenv
import psycopg2

load_dotenv()
conn = psycopg2.connect(
    host=os.environ.get('DB_HOST', 'aws-1-ap-northeast-1.pooler.supabase.com'),
    port=os.environ.get('DB_PORT', 6543),
    database=os.environ.get('DB_NAME', 'postgres'),
    user=os.environ.get('DB_USER'),
    password=os.environ.get('DB_PASS')
)
cursor = conn.cursor()
cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public';")
tables = [row[0] for row in cursor.fetchall()]
print("Tables:", tables)

if 'health_packages' in tables:
    cursor.execute("SELECT * FROM health_packages LIMIT 5;")
    print("Health Packages columns:", [desc[0] for desc in cursor.description])
    print("Health Packages data:", cursor.fetchall())
elif 'packages' in tables:
    cursor.execute("SELECT * FROM packages LIMIT 5;")
    print("Packages columns:", [desc[0] for desc in cursor.description])
    print("Packages data:", cursor.fetchall())

cursor.close()
conn.close()
