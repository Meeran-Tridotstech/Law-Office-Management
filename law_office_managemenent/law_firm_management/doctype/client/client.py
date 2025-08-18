# client.py

import frappe
import re
from frappe.model.document import Document

class Client(Document):
    def validate(self):
        # 1. Client Name Validation
        if not self.client_name or len(self.client_name.strip()) < 3:
            frappe.throw("Client Name must be at least 3 characters long.")

        # 2. Client Type Validation
        if not self.client_type:
            frappe.throw("Client Type is required.")
        if self.client_type not in ["Individual", "Company"]:
            frappe.throw("Client Type must be either Individual or Company.")

        # 3. Gender Validation (only for Individual)
        if self.client_type == "Individual":
            if not self.gender:
                frappe.throw("Gender is required for Individual clients.")

        # 4. Date of Birth Validation (only for Individual)
        if self.client_type == "Individual" and not self.date_of_birth:
            frappe.throw("Date of Birth is required for Individual clients.")

        # 5. Company Name Validation (only for Company clients)
        if self.client_type == "Company" and not self.company_name:
            frappe.throw("Company Name is required for Company clients.")

        # 6. Contact Number Validation
        if not self.contact_number:
            frappe.throw("Contact Number is required.")
        elif not re.match(r"^\d{10}$", self.contact_number):
            frappe.throw("Contact Number must be a valid 10-digit number.")

        # 7. Email Validation
        if self.email:
            email_pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"
            if not re.match(email_pattern, self.email):
                frappe.throw("Invalid Email Address.")

        # 8. Address Validation
        if not self.address or len(self.address.strip()) < 5:
            frappe.throw("Address must be at least 5 characters long.")

        # 9. ID Proof Type & Number Validation
        if not self.id_proof_type:
            frappe.throw("ID Proof Type is required.")
        if not self.id_proof_number:
            frappe.throw("ID Proof Number is required.")

        # Aadhaar (12 digits)
        if self.id_proof_type == "Aadhaar" and not re.match(r"^\d{12}$", self.id_proof_number):
            frappe.throw("Invalid Aadhaar Number. Must be 12 digits.")

        # PAN (ABCDE1234F)
        if self.id_proof_type == "PAN" and not re.match(r"^[A-Z]{5}[0-9]{4}[A-Z]{1}$", self.id_proof_number):
            frappe.throw("Invalid PAN Number format.")

        # Passport (e.g., A1234567)
        if self.id_proof_type == "Passport" and not re.match(r"^[A-PR-WYa-pr-wy][1-9]\d\s?\d{4}[1-9]$", self.id_proof_number):
            frappe.throw("Invalid Passport Number format.")

        # Driving License (basic check)
        if self.id_proof_type == "Driving License" and len(self.id_proof_number) < 6:
            frappe.throw("Invalid Driving License Number.")