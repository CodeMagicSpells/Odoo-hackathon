import os

class Config:
    SQLALCHEMY_DATABASE_URI = "postgresql+psycopg2://postgres:11030721@localhost:5432/god_help_us"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.urandom(24)
    JWT_SECRET_KEY = os.urandom(24)  # For JWT


