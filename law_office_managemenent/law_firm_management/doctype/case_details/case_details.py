# Copyright (c) 2025, Meeran and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class CaseDetails(Document):

    def validate(self):
        """Server-side validation for Case Invoice child table"""
        if not self.case_invoice or len(self.case_invoice) == 0:
            frappe.throw("At least one invoice entry is required.")

        total = 0
        total_with_tax = 0

        for row in self.case_invoice:
            if not row.service:
                frappe.throw(f"Row {row.idx}: Service is required.")
            
            if not row.qty or float(row.qty) <= 0:
                frappe.throw(f"Row {row.idx}: Quantity must be greater than 0")
            
            if not row.rate or float(row.rate) <= 0:
                frappe.throw(f"Row {row.idx}: Rate must be greater than 0")
            
            # Convert tax_percent safely to float
            tax_percent = float(row.tax_percent or 0)

            # Calculate amount and amount with tax
            row.amount = float(row.qty) * float(row.rate)
            row.amount_with_tax = row.amount + (row.amount * tax_percent / 100)

            total += row.amount
            total_with_tax += row.amount_with_tax

        # Store totals in parent doctype
        self.amount = total
        self.amount_with_tax = total_with_tax



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
    return {"status": "success"}