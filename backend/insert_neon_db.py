import psycopg2
import os

DATABASE_URL = "postgresql://neondb_owner:npg_41yNZfrcYICV@ep-gentle-sun-aodt9lju-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

try:
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()

    # Create table if not exists
    create_table_query = """
    CREATE TABLE IF NOT EXISTS health_packages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        title VARCHAR(150) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2),
        tests_included TEXT,
        icon VARCHAR(50)
    );
    """
    cursor.execute(create_table_query)

    # Insert default packages
    insert_query = """
    INSERT INTO health_packages (name, title, description, price, tests_included, icon) VALUES 
    ('shravan-cbp', 'Shravan Complete Blood Picture (CBP)', 'A comprehensive blood analysis to check for overall health, infections, and anemia.', 499.00, 'Hemoglobin, RBC, WBC, Platelets, Hematocrit', 'fas fa-vial'),
    ('basic-health', 'Basic Health Checkup', 'Essential tests to monitor your basic health vitals and detect early signs of common conditions.', 999.00, 'CBP, Lipid Profile, Fasting Blood Sugar', 'fas fa-heartbeat'),
    ('advanced-cardiac', 'Advanced Cardiac Care', 'Thorough screening of the heart for those with a family history of cardiac issues.', 2499.00, 'ECG, Echo, Lipid Profile, TMT', 'fas fa-heart'),
    ('diabetic-screening', 'Diabetic Screening', 'Specialized package for early detection and monitoring of Diabetes.', 1299.00, 'HbA1c, Fasting Sugar, Post Prandial, Urine Routine', 'fas fa-tint'),
    ('senior-citizen', 'Senior Citizen Care', 'A full-body health checkup designed specifically for the elderly.', 3499.00, 'CBP, Thyroid, Renal Profile, Liver Profile, Bone Densitometry', 'fas fa-user-md')
    ON CONFLICT DO NOTHING;
    """
    try:
        cursor.execute(insert_query)
    except Exception as e:
        print("Insert failed, maybe table already has data or no unique constraint on name. Clearing and inserting again...")
        conn.rollback()
        cursor.execute("TRUNCATE TABLE health_packages RESTART IDENTITY;")
        cursor.execute(insert_query)

    conn.commit()
    print("Health packages inserted successfully into NeonDB!")

    cursor.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
