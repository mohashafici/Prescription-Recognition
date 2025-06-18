# predictor.py
import torch
from transformers import BertForMaskedLM, BertTokenizerFast, BertConfig
from PIL import Image
import numpy as np
import cv2
import pytesseract
from difflib import get_close_matches, SequenceMatcher
import os

# Load model + tokenizer once
base_dir = os.path.dirname(os.path.abspath(__file__))
tokenizer_path = os.path.join(base_dir, "output_tokenizer")

tokenizer = BertTokenizerFast.from_pretrained(tokenizer_path)
config = BertConfig.from_pretrained(tokenizer_path)
model = BertForMaskedLM(config)
model.load_state_dict(torch.load("bert_ocr_model.pth", map_location="cpu"))
model.eval()

# Load drug list
with open("drug_list.txt") as f:
    drug_list = [line.strip().lower() for line in f]

def preprocess_image(image_bytes):
    image = Image.open(image_bytes).convert("RGB")
    img = np.array(image)
    if len(img.shape) == 3:
        img = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
    img = cv2.resize(img, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
    _, img = cv2.threshold(img, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    return img

def extract_text_and_predict(image_bytes):
    preprocessed = preprocess_image(image_bytes)
    ocr_text = pytesseract.image_to_string(preprocessed).strip()

    if not ocr_text:
        return "[No OCR found]", "[Skipped]", [], 0.0, 0.0

    # Calculate OCR confidence based on text length and quality
    ocr_confidence = min(100.0, max(0.0, len(ocr_text) * 2.0))  # Basic confidence based on text length
    
    words = [w for w in ocr_text.split() if w.isalpha() and len(w) > 2]
    found = set()
    drug_confidence_scores = []

    for word in words:
        matches = get_close_matches(word.lower(), drug_list, n=1, cutoff=0.75)
        if matches:
            found.add(matches[0])
            # Calculate confidence based on similarity using SequenceMatcher
            similarity = SequenceMatcher(None, word.lower(), matches[0]).ratio()
            confidence = similarity * 100
            drug_confidence_scores.append(confidence)

    predicted_text = ""
    if not found or len(ocr_text) < 20:
        try:
            inputs = tokenizer(ocr_text, return_tensors="pt", padding=True, truncation=True, max_length=128)
            with torch.no_grad():
                outputs = model(**inputs)
                predictions = torch.argmax(outputs.logits, dim=-1)
                predicted_text = tokenizer.decode(predictions[0], skip_special_tokens=True)

            corrected_words = [w for w in predicted_text.split() if w.isalpha() and len(w) > 2]
            for word in corrected_words:
                matches = get_close_matches(word.lower(), drug_list, n=1, cutoff=0.75)
                if matches:
                    found.add(matches[0])
                    # Calculate confidence for corrected words
                    similarity = SequenceMatcher(None, word.lower(), matches[0]).ratio()
                    confidence = similarity * 100
                    drug_confidence_scores.append(confidence)
        except Exception as e:
            predicted_text = f"[BERT error: {str(e)}]"

    # Calculate overall drug detection confidence
    overall_drug_confidence = 0.0
    if drug_confidence_scores:
        overall_drug_confidence = sum(drug_confidence_scores) / len(drug_confidence_scores)
    elif found:
        overall_drug_confidence = 85.0  # Default confidence if drugs found but no scores calculated
    else:
        overall_drug_confidence = 0.0

    return ocr_text, predicted_text.strip(), list(found), ocr_confidence, overall_drug_confidence
