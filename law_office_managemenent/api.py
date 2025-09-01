# import frappe
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
def create_consultation(
    client_name=None, case_type=None, advocate=None,
    consultation_fee=None, mode_of_consultation=None, location_address=None,
    whatsapp_number=None, meeting_link=None,
    preferred_date_1=None, preferred_date_2=None,
    status=None, payment_status=None, payment_id=None,
    confirmed_date=None, case_summary=None
):
    doc = frappe.new_doc("Client Consultation")   # replace with your Doctype name
    doc.client_name = client_name
    doc.case_type = case_type
    doc.advocate = advocate
    doc.consultation_fee = consultation_fee
    doc.mode_of_consultation = mode_of_consultation
    doc.location_address = location_address
    doc.whatsapp_number = whatsapp_number
    doc.meeting_link = meeting_link
    doc.preferred_date_1 = preferred_date_1
    doc.preferred_date_2 = preferred_date_2
    doc.status = status
    doc.payment_status = payment_status
    doc.payment_id = payment_id
    doc.confirmed_date = confirmed_date
    doc.case_summary = case_summary
    doc.insert()
    frappe.db.commit()
    return doc.name


# ------------------------------  Razor Pay -------------------------------------

import frappe
import razorpay

# Replace with your Razorpay keys
RAZORPAY_KEY_ID = "rzp_test_R7xDdI0dwGlmRA"
RAZORPAY_KEY_SECRET = "HRhKG4x0ocYovKVVBVZvHfLU"

client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))


@frappe.whitelist()
def mark_payment_success(payment_id, consultation_id):
    """
    Capture and verify payment before updating Client Consultation
    """
    try:
        # Fetch the consultation
        doc = frappe.get_doc("Client Consultation", consultation_id)

        # Step 1: Fetch payment details from Razorpay
        payment = client.payment.fetch(payment_id)

        if not payment:
            return {"status": "error", "message": "Invalid payment ID"}

        # Step 2: Capture payment (only if not already captured)
        if payment.get("status") == "authorized":
            client.payment.capture(payment_id, int(doc.consultation_fee * 100))
            payment = client.payment.fetch(payment_id)  # re-fetch updated status

        # Step 3: Update doc based on final status
        if payment.get("status") == "captured":
            doc.payment_status = "Paid"
            doc.razorpay_payment_id = payment_id
            doc.refund_status = "Not Requested"
            doc.save(ignore_permissions=True)
            frappe.db.commit()
            return {"status": "success", "message": "✅ Payment captured successfully"}
        else:
            return {"status": "error", "message": f"Payment not captured. Current status: {payment.get('status')}"}

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Payment Verification Failed")
        return {"status": "error", "message": str(e)}



@frappe.whitelist()
def cancel_consultation_and_refund(docname):
    try:
        doc = frappe.get_doc("Client Consultation", docname)

        if not doc.razorpay_payment_id:
            return {"status": "error", "message": "No Razorpay Payment ID found"}

        refund = client.payment.refund(
            doc.razorpay_payment_id,
            {
                "amount": int(doc.consultation_fee * 100),  # paise
                "speed": "normal"
            }
        )

        doc.payment_status = "Refunded"
        doc.refund_status = "Refunded"
        doc.refund_id = refund.get("id")
        doc.consultation_status = "Cancelled"

        doc.save(ignore_permissions=True)
        frappe.db.commit()

        return {"status": "success", "message": "✅ Consultation cancelled & refund processed"}

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Refund Failed")
        return {"status": "error", "message": str(e)}






#### ------------------------------------ Voice To Text -------------------------------------------------------------

import frappe
import base64
import tempfile
from openai import OpenAI
from faster_whisper import WhisperModel

# ✅ Load Faster-Whisper model once (not inside function)
model = WhisperModel("small", device="cpu", compute_type="int8")

@frappe.whitelist(allow_guest=True)
def speech_to_text(audio_base64):
    try:
        # Remove metadata prefix if present
        if "," in audio_base64:
            audio_base64 = audio_base64.split(",")[1]

        # Decode base64 → temp WAV file
        audio_data = base64.b64decode(audio_base64)
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio:
            temp_audio.write(audio_data)
            temp_path = temp_audio.name

        frappe.log_error("Speech Debug", f"Audio saved at {temp_path}, size={len(audio_data)} bytes")

        # ---- Try OpenAI first ----
        api_key = frappe.conf.get("openai_api_key")
        if api_key:
            try:
                client = OpenAI(api_key=api_key)
                with open(temp_path, "rb") as f:
                    transcript = client.audio.transcriptions.create(
                        model="gpt-4o-mini-transcribe",
                        file=f
                    )
                return transcript.text
            except Exception as e:
                frappe.log_error("OpenAI Speech Error", str(e))

        # ---- Fallback to Faster-Whisper (local) ----
        segments, info = model.transcribe(temp_path, beam_size=5)
        return " ".join([segment.text for segment in segments])

    except Exception as e:
        frappe.log_error("Speech to Text Error", str(e))
        return "❌ Error in speech recognition"



