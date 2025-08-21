import frappe
# import openai
# import tempfile
# import razorpay
# from frappe.utils import nowdate, add_days, format_date

# @frappe.whitelist(allow_guest=True)
# def transcribe_audio():
#     file = frappe.request.files.get("file")
#     docname = frappe.form_dict.get("docname")

#     if not file:
#         return {"error": "No audio file received"}

#     # Save temp file
#     with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmpfile:
#         file.save(tmpfile.name)
#         audio_path = tmpfile.name

#     # Whisper API (Tamil transcription)
#     with open(audio_path, "rb") as audio_file:
#         transcript = openai.Audio.transcriptions.create(
#             model="whisper-1",
#             file=audio_file,
#             language="ta"  # Tamil
#         )

#     # Save into DocType
#     if docname:
#         doc = frappe.get_doc("Client Consultation", docname)
#         doc.speech_text = transcript.text
#         doc.save(ignore_permissions=True)

#     return {"tamil_text": transcript.text}



######---------------ChatBot Api--------------------------------------------------------------------------

import frappe

@frappe.whitelist()
def create_record(doctype_name, **kwargs):
    doc = frappe.new_doc(doctype_name)

    # Loop through kwargs to set values dynamically
    for key, value in kwargs.items():
        if key in doc.as_dict():
            doc.set(key, value)

    doc.insert(ignore_permissions=True)
    frappe.db.commit()
    return {"name": doc.name}

