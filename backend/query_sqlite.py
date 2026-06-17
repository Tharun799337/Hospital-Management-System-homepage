import sqlite3

conn = sqlite3.connect(r'C:\Users\ADMIN\OneDrive\Desktop\mini-hms\backend\instance\mini_hms.db')
cursor = conn.cursor()
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = [row[0] for row in cursor.fetchall()]
print("Tables:", tables)

if 'health_packages' in tables:
    cursor.execute("SELECT * FROM health_packages LIMIT 2;")
    print("Columns:", [desc[0] for desc in cursor.description])
    print("Data:", cursor.fetchall())
elif 'packages' in tables:
    cursor.execute("SELECT * FROM packages LIMIT 2;")
    print("Columns:", [desc[0] for desc in cursor.description])
    print("Data:", cursor.fetchall())
