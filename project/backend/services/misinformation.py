keywords = ["fake", "hoax", "rumour", "scam"]

def check_misinformation(text):
    flags = [k for k in keywords if k in text.lower()]
    return {
        "misinfo_detected": len(flags) > 0,
        "keywords": flags
    }
