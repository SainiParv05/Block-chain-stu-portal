from cryptography.fernet import Fernet
import hashlib

key = Fernet.generate_key()
cipher = Fernet(key)

def encrypt_text(text):
    return cipher.encrypt(text.encode()).decode()

def hash_text(text):
    return hashlib.sha256(text.encode()).hexdigest()
