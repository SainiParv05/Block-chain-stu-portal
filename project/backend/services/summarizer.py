#(Simple extractive approach for hackathon
def summarize(text):
    sentences = text.split(".")
    if len(sentences) <= 2:
        return text
    return sentences[0] + "." + sentences[-2] + "."
