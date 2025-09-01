# Copyright (c) 2025, Meeran and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class CaseDetails(Document):
    pass

    # def validate(self):
    #     """Server-side validation for Case Invoice child table"""
    #     if not self.case_invoice or len(self.case_invoice) == 0:
    #         frappe.throw("At least one invoice entry is required.")

    #     total = 0
    #     total_with_tax = 0

    #     for row in self.case_invoice:
    #         if not row.service:
    #             frappe.throw(f"Row {row.idx}: Service is required.")
            
    #         if not row.qty or float(row.qty) <= 0:
    #             frappe.throw(f"Row {row.idx}: Quantity must be greater than 0")
            
    #         if not row.rate or float(row.rate) <= 0:
    #             frappe.throw(f"Row {row.idx}: Rate must be greater than 0")
            
    #         # Convert tax_percent safely to float
    #         tax_percent = float(row.tax_percent or 0)

    #         # Calculate amount and amount with tax
    #         row.amount = float(row.qty) * float(row.rate)
    #         row.amount_with_tax = row.amount + (row.amount * tax_percent / 100)

    #         total += row.amount
    #         total_with_tax += row.amount_with_tax

    #     # Store totals in parent doctype
    #     self.amount = total
    #     self.amount_with_tax = total_with_tax



# @frappe.whitelist()
# def mark_payment_success(docname, razorpay_payment_id):
#     """
#     Updates payment status and stores Razorpay payment id.
#     """
#     doc = frappe.get_doc("Case Details", docname)
#     # Update payment_status
#     doc.payment_status = "Paid"
#     # Store Razorpay payment id
#     doc.razorpay_payment_id = razorpay_payment_id
#     doc.save()
#     frappe.db.commit()
#     return {"status": "success"}




@frappe.whitelist()
def mark_payment_success(docname, razorpay_payment_id):
    """
    Updates payment status and stores Razorpay payment id.
    """
    doc = frappe.get_doc("Case Details", docname)
    
    # Update payment_status
    doc.payment_status = "Paid"
    
    # Store Razorpay payment id
    doc.razorpay_payment_id = razorpay_payment_id
    doc.save()
    frappe.db.commit()

    # Show confirmation popup with emoji
    frappe.msgprint(f"✅ Payment marked as <b>Paid</b> for Case <b>{docname}</b><br>💳 Razorpay ID: <b>{razorpay_payment_id}</b>")

    return {"status": "success", "message": "🎉 Payment updated successfully"}





####------------   Email  -------------------------------
# @frappe.whitelist()
# def send_case_invoice_email(docname):
#     # Load Case Details document
#     doc = frappe.get_doc("Case Details", docname)
    
#     # Generate PDF from print format
#     pdf = frappe.get_print(
#         "Case Details",  # Doctype
#         doc.name,        # Docname
#         print_format="Case Details Print",  # Your print format name
#         as_pdf=True
#     )
    
#     # Attach PDF file
#     file = frappe.get_doc({
#         "doctype": "File",
#         "file_name": f"Case_Invoice_{doc.name}.pdf",
#         "attached_to_doctype": "Case Details",
#         "attached_to_name": doc.name,
#         "content": pdf,
#         "is_private": 1
#     })
#     file.insert(ignore_permissions=True)

#     # Send Email
#     frappe.sendmail(
#         recipients=[doc.client_email],  # Assuming you have client_email field
#         subject=f"Case Invoice - {doc.case_title}",
#         message=frappe.render_template(
#             frappe.db.get_value("Email Template", "Case Invoice Mail", "response_html"),
#             {"doc": doc}
#         ),
#         attachments=[{"fname": file.file_name, "fcontent": pdf}]
#     )

#     return "✅ Email sent successfully with PDF attachment!"



@frappe.whitelist()
def send_case_invoice_email(docname):
    try:
        doc = frappe.get_doc("Case Details", docname)
        pdf = frappe.get_print("Case Details", doc.name, print_format="Case Details Print", as_pdf=True)

        file = frappe.get_doc({
            "doctype": "File",
            "file_name": f"Case_Invoice_{doc.name}.pdf",
            "attached_to_doctype": "Case Details",
            "attached_to_name": doc.name,
            "content": pdf,
            "is_private": 1
        })
        file.insert(ignore_permissions=True)

        frappe.sendmail(
            recipients=[doc.client_email],
            subject=f"Case Invoice - {doc.case_title}",
            message=frappe.render_template(
                frappe.db.get_value("Email Template", "Case Invoice Mail", "response_html"),
                {"doc": doc}
            ),
            attachments=[{"fname": file.file_name, "fcontent": pdf}]
        )

        return "✅ Email sent successfully with PDF attachment!"
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "send_case_invoice_email failed")
        return f"❌ Error: {str(e)}"
