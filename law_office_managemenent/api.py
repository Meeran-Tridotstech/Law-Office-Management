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

@frappe.whitelist()
def verify_payment(payment_id, consultation_id):
    """
    Verify Razorpay payment and update Consultation Doc
    """
    try:
        # Razorpay client init
        client = razorpay.Client(auth=("rzp_test_R7xDdI0dwGlmRA", "HRhKG4x0ocYovKVVBVZvHfLU"))

        # Fetch payment details from Razorpay
        payment = client.payment.fetch(payment_id)

        if payment.get("status") == "captured":
            # Update Frappe Document
            doc = frappe.get_doc("Client Consultation", consultation_id)
            doc.payment_status = "Paid"
            doc.payment_id = payment_id
            doc.save(ignore_permissions=True)
            frappe.db.commit()

            return {"status": "success", "message": "Payment verified and saved"}
        else:
            return {"status": "failed", "message": "Payment not captured yet"}

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Payment Verification Error")
        return {"status": "error", "message": str(e)}



import razorpay
import frappe
from frappe import _

@frappe.whitelist()
def cancel_consultation_and_refund(docname):
    """
    Cancel the consultation and process refund through Razorpay
    """
    try:
        # Load consultation record
        doc = frappe.get_doc("Consultation", docname)

        if not doc.payment_id:
            return {"status": "failed", "message": _("No payment found to refund")}

        # Razorpay client init
        client = razorpay.Client(auth=("rzp_test_R7xDdI0dwGlmRA", "HRhKG4x0ocYovKVVBVZvHfLU"))

        # Refund request
        refund = client.payment.refund(doc.payment_id, {
            "amount": int(doc.consultation_fee * 100)  # amount in paise
        })

        # Update consultation record
        doc.status = "Cancelled"
        doc.refund_status = "Refunded"
        doc.save(ignore_permissions=True)

        frappe.db.commit()

        return {
            "status": "success",
            "message": _("Consultation Cancelled & Refund Processed"),
            "refund_id": refund.get("id")
        }

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Refund Error")
        return {"status": "error", "message": str(e)}