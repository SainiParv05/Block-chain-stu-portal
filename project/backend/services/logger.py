import json 

LOG_FILE = "logs.json"

def save_log(text, category):
    entry = {"text": text, "category": category}
    with open(LOG_FILE, "a") as f:
        f.write(json.dumps(entry) + "\n")

def get_logs():
    try:
        return [json.loads(line) for line in open(LOG_FILE)]
    except:
        return []
