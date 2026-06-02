import os
import sys

# Add backend to path so we can import modules
sys.path.append(os.path.abspath('backend'))
from dotenv import load_dotenv
load_dotenv('backend/.env')

from hp_src.config.database import db

def run():
    try:
        # Insert 3 more dummy news to exceed 4 cards threshold for auto-scroll
        dummy_news = [
            {
                "title": "Hospital Recognized for Excellence in Orthopedics",
                "description": "We are proud to announce that Haveda Hospital has been awarded the National Orthopedic Excellence Award for 2026. This reflects our continuous dedication to patient care and advanced joint replacement techniques.",
                "event_date": "2026-05-10 10:00:00",
                "type": "Achievement",
                "image": "https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&q=80"
            },
            {
                "title": "New Pediatric Wing Opening Soon",
                "description": "We are expanding our services with a state-of-the-art pediatric wing, designed to provide comprehensive care for infants, children, and adolescents in a child-friendly environment.",
                "event_date": "2026-07-01 09:00:00",
                "type": "News",
                "image": "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80"
            },
            {
                "title": "Blood Donation Drive - Give Life, Give Blood",
                "description": "Join our upcoming mega blood donation drive. Your single donation can save up to 3 lives! Donors will receive a free mini-health screening on site.",
                "event_date": "2026-06-25 14:30:00",
                "type": "Event",
                "image": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80"
            }
        ]

        print("Inserting more dummy news...")
        for n in dummy_news:
            db.execute_query(
                "INSERT INTO news_events (title, description, event_date, type, image) VALUES (%s, %s, %s, %s, %s)",
                (n['title'], n['description'], n['event_date'], n['type'], n['image']),
                fetch_all=False
            )
        print("Inserted additional dummy news successfully.")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    run()
