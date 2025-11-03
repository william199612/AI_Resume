# app/services/text_extractor.py
import docx2txt
from PyPDF2 import PdfReader
import tempfile

def extract_text(file):
    suffix = file.filename.split('.')[-1].lower()
    with tempfile.NamedTemporaryFile(delete=False, suffix=f".{suffix}") as tmp:
        tmp.write(file.file.read())
        tmp_path = tmp.name

    if suffix == "pdf":
        reader = PdfReader(tmp_path)
        text = " ".join(page.extract_text() for page in reader.pages)
    elif suffix in ["doc", "docx"]:
        text = docx2txt.process(tmp_path)
    else:
        raise ValueError("Unsupported file type")

    return text
