from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# 1. Load the .env file from your main folder into memory
load_dotenv()

# 2. Grab the URL you saved in your .env file
# This will now correctly find "postgresql://postgres:your_actual_password@127.0.0.1:5432/startup_db"
DATABASE_URL = os.getenv("DATABASE_URL")

# 3. Security Check: If the .env is missing or empty, stop and tell us why
if not DATABASE_URL:
    raise ValueError(
        "DATABASE_URL not found! Make sure your .env file is in the main 'idea-validator' folder "
        "and contains: DATABASE_URL=postgresql://postgres:password@localhost:5432/startup_db"
    )

# 4. Create the 'Engine' (The connection machine)
engine = create_engine(DATABASE_URL)

# 5. Create a 'SessionLocal' (The factory that makes database connections for each request)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 6. Dependency function to give FastAPI a temporary key to the database
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        # Always close the connection so the database doesn't get overwhelmed
        db.close()