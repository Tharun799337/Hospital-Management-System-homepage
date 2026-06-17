from flask import Blueprint, request, jsonify
from hp_src.config.database import db

packages_bp = Blueprint('packages', __name__)

@packages_bp.route('', methods=['GET'])
def get_packages():
    """Get all health packages"""
    try:
        query = "SELECT * FROM health_packages;"
        packages = db.execute_query(query, fetch_all=True)
        return jsonify({
            'success': True,
            'data': packages,
            'count': len(packages) if packages else 0
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@packages_bp.route('/init', methods=['POST'])
def init_packages():
    """Initialize the health_packages table with dummy data"""
    try:
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
        db.execute_query(create_table_query, fetch_all=False)

        # Clear existing packages to avoid duplicates for this initialization
        db.execute_query("TRUNCATE TABLE health_packages RESTART IDENTITY;", fetch_all=False)

        # Insert default packages
        insert_query = """
        INSERT INTO health_packages (name, title, description, price, tests_included, icon) VALUES 
        ('shravan-cbp', 'Shravan Complete Blood Picture (CBP)', 'A comprehensive blood analysis to check for overall health, infections, and anemia.', 499.00, 'Hemoglobin, RBC, WBC, Platelets, Hematocrit', 'fas fa-vial'),
        ('basic-health', 'Basic Health Checkup', 'Essential tests to monitor your basic health vitals and detect early signs of common conditions.', 999.00, 'CBP, Lipid Profile, Fasting Blood Sugar', 'fas fa-heartbeat'),
        ('advanced-cardiac', 'Advanced Cardiac Care', 'Thorough screening of the heart for those with a family history of cardiac issues.', 2499.00, 'ECG, Echo, Lipid Profile, TMT', 'fas fa-heart'),
        ('diabetic-screening', 'Diabetic Screening', 'Specialized package for early detection and monitoring of Diabetes.', 1299.00, 'HbA1c, Fasting Sugar, Post Prandial, Urine Routine', 'fas fa-tint'),
        ('senior-citizen', 'Senior Citizen Care', 'A full-body health checkup designed specifically for the elderly.', 3499.00, 'CBP, Thyroid, Renal Profile, Liver Profile, Bone Densitometry', 'fas fa-user-md')
        ;
        """
        db.execute_query(insert_query, fetch_all=False)

        return jsonify({
            'success': True,
            'message': 'Health packages table created and populated successfully.'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
