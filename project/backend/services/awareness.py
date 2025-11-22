phishing_patterns = ["urgent", "password", "bank", "click", "verify"]

def awareness_scan(text):
    dangers = [w for w in phishing_patterns if w in text.lower()]
    return {"alerts": dangers}
