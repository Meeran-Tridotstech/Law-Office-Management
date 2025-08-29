# # client.py

# import frappe
# import re
# from frappe.model.document import Document

# class Client(Document):
#     # def validate(self):
#     #     # 1. Client Name Validation
#     #     if not self.client_name or len(self.client_name.strip()) < 3:
#     #         frappe.throw("Client Name must be at least 3 characters long.")

#     #     # 2. Client Type Validation
#     #     if not self.client_type:
#     #         frappe.throw("Client Type is required.")
#     #     if self.client_type not in ["Individual", "Company"]:
#     #         frappe.throw("Client Type must be either Individual or Company.")

#     #     # 3. Gender Validation (only for Individual)
#     #     if self.client_type == "Individual":
#     #         if not self.gender:
#     #             frappe.throw("Gender is required for Individual clients.")

#     #     # 4. Date of Birth Validation (only for Individual)
#     #     if self.client_type == "Individual" and not self.date_of_birth:
#     #         frappe.throw("Date of Birth is required for Individual clients.")

#     #     # 5. Company Name Validation (only for Company clients)
#     #     if self.client_type == "Company" and not self.company_name:
#     #         frappe.throw("Company Name is required for Company clients.")

#     #     # 6. Contact Number Validation
#     #     if not self.contact_number:
#     #         frappe.throw("Contact Number is required.")
#     #     elif not re.match(r"^\d{10}$", self.contact_number):
#     #         frappe.throw("Contact Number must be a valid 10-digit number.")

#     #     # 7. Email Validation
#     #     if self.email:
#     #         email_pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"
#     #         if not re.match(email_pattern, self.email):
#     #             frappe.throw("Invalid Email Address.")

#     #     # 8. Address Validation
#     #     if not self.address or len(self.address.strip()) < 5:
#     #         frappe.throw("Address must be at least 5 characters long.")

#     #     # 9. ID Proof Type & Number Validation
#     #     if not self.id_proof_type:
#     #         frappe.throw("ID Proof Type is required.")
#     #     if not self.id_proof_number:
#     #         frappe.throw("ID Proof Number is required.")

#     #     # Aadhaar (12 digits)
#     #     if self.id_proof_type == "Aadhaar" and not re.match(r"^\d{12}$", self.id_proof_number):
#     #         frappe.throw("Invalid Aadhaar Number. Must be 12 digits.")

#     #     # PAN (ABCDE1234F)
#     #     if self.id_proof_type == "PAN" and not re.match(r"^[A-Z]{5}[0-9]{4}[A-Z]{1}$", self.id_proof_number):
#     #         frappe.throw("Invalid PAN Number format.")

#     #     # Passport (e.g., A1234567)
#     #     if self.id_proof_type == "Passport" and not re.match(r"^[A-PR-WYa-pr-wy][1-9]\d\s?\d{4}[1-9]$", self.id_proof_number):
#     #         frappe.throw("Invalid Passport Number format.")

#     #     # Driving License (basic check)
#     #     if self.id_proof_type == "Driving License" and len(self.id_proof_number) < 6:
#     #         frappe.throw("Invalid Driving License Number.")
    

#     def after_insert(self):
#         # Check if Case already exists for this client
#         if not frappe.db.exists("Case", {"client": self.name}):
#             case = frappe.get_doc({
#                 "doctype": "Case",
#                 "client": self.name,
#                 "case_type": "Civil",
#             })
#             case.insert()
 
#             # Check if Case Details already exists
#             if not frappe.db.exists("Case Details", {"client": self.name}):
#                 case_details = frappe.get_doc({
#                     "doctype": "Case Details",
#                     "client": self.name,
#                     "client_name": self.client_name,
#                     "client_type": self.client_type,
#                     "gender": self.gender,
#                     "date_of_birth": self.date_of_birth,
#                     "company_name": self.company_name,
#                     "contact_number": self.contact_number,
#                     "city": self.city,
#                     "state": self.state,
 
#                 })
#                 case_details.insert()
#         # make sure client has email
#         if not doc.email:
#             return

#         client_user = doc.email

#         # share the client document with the client email (read-only)
#         frappe.share.add_docshare(
#             doc.doctype, doc.name, client_user,
#             read=1, write=0, share=0, notify=0
#         )

#         # send welcome email
#         try:
#             frappe.sendmail(
#                 recipients=[client_user],
#                 subject="Welcome to Law Firm Portal",
#                 message=f"""
#                     Dear {doc.client_name or 'Client'},<br><br>
#                     Your profile has been created in our system.<br>
#                     You can log in with this email (<b>{doc.email}</b>) to view your consultations and documents.<br><br>
#                     Thank you,<br>
#                     Law Firm
#                 """
#             )
#         except Exception:
#             frappe.log_error(frappe.get_traceback(), "Client Email Send Failed")
 
 
#     def on_update(self):
#         # Sync Case fields to Case Details
#         case_details_list = frappe.get_all("Case Details", filters={"client": self.name}, fields=["name"])
#         for cd in case_details_list:
#             cd_doc = frappe.get_doc("Case Details", cd["name"])
#             cd_doc.client_name = self.client_name
#             cd_doc.client_type = self.client_type
#             cd_doc.gender = self.gender
#             cd_doc.date_of_birth = self.date_of_birth
#             cd_doc.company_name = self.company_name
#             cd_doc.contact_number = self.contact_number
#             cd_doc.contact_number = self.contact_number
#             cd_doc.city = self.city
#             cd_doc.state = self.state
#             cd_doc.save()
















# import frappe
# from frappe.model.document import Document

# class Client(Document):
#     def after_insert(self):
#         # ✅ Create Case if not already linked
#         if not frappe.db.exists("Case", {"client": self.name}):
#             case = frappe.get_doc({
#                 "doctype": "Case",
#                 "client": self.name,
#                 "case_type": "Civil",
#             })
#             case.insert(ignore_permissions=True)

#         # ✅ Create Case Details if not already linked
#         if not frappe.db.exists("Case Details", {"client": self.name}):
#             case_details = frappe.get_doc({
#                 "doctype": "Case Details",
#                 "client": self.name,
#                 "client_name": self.client_name,
#                 "client_type": self.client_type,
#                 "gender": self.gender,
#                 "date_of_birth": self.date_of_birth,
#                 "company_name": self.company_name,
#                 "contact_number": self.contact_number,
#                 "city": self.city,
#                 "state": self.state,
#             })
#             case_details.insert(ignore_permissions=True)

#         # ✅ Share client record + send email if email exists
#         if self.email:
#             client_user = self.email

#             # share the Client document (read-only)
#             frappe.share.add_docshare(
#                 self.doctype, self.name, client_user,
#                 read=1, write=0, share=0, notify=0
#             )

#             # send welcome email
#             try:
#                 frappe.sendmail(
#                     recipients=[client_user],
#                     subject="Welcome to Law Firm Portal",
#                     message=f"""
#                         Dear {self.client_name or 'Client'},<br><br>
#                         Your profile has been created in our system.<br>
#                         You can log in with this email (<b>{self.email}</b>) to view your consultations and documents.<br><br>
#                         Thank you,<br>
#                         Law Firm
#                     """
#                 )
#             except Exception:
#                 frappe.log_error(frappe.get_traceback(), "Client Email Send Failed")

#     def on_update(self):
#         # ✅ Sync Case fields to Case Details
#         case_details_list = frappe.get_all(
#             "Case Details", filters={"client": self.name}, fields=["name"]
#         )
#         for cd in case_details_list:
#             cd_doc = frappe.get_doc("Case Details", cd["name"])
#             cd_doc.client_name = self.client_name
#             cd_doc.client_type = self.client_type
#             cd_doc.gender = self.gender
#             cd_doc.date_of_birth = self.date_of_birth
#             cd_doc.company_name = self.company_name
#             cd_doc.contact_number = self.contact_number
#             cd_doc.city = self.city
#             cd_doc.state = self.state
#             cd_doc.save(ignore_permissions=True)












import frappe
from frappe.model.document import Document

class Client(Document):
    def after_insert(self):
        # ✅ Create Case if not already linked
        if not frappe.db.exists("Case", {"client": self.name}):
            case = frappe.get_doc({
                "doctype": "Case",
                "client": self.name,
                "case_type": "Civil",
            })
            case.insert(ignore_permissions=True)
            frappe.msgprint(f"📂 New Case created for client <b>{self.client_name}</b>")

        # ✅ Create Case Details if not already linked
        if not frappe.db.exists("Case Details", {"client": self.name}):
            case_details = frappe.get_doc({
                "doctype": "Case Details",
                "client": self.name,
                "client_name": self.client_name,
                "client_type": self.client_type,
                "gender": self.gender,
                "date_of_birth": self.date_of_birth,
                "company_name": self.company_name,
                "contact_number": self.contact_number,
                "client_email": self.email,
                "city": self.city,
                "state": self.state,
            })
            case_details.insert(ignore_permissions=True)
            frappe.msgprint(f"📝 Case Details created for client <b>{self.client_name}</b>")

        # ✅ Share client record + send email if email exists
        if self.email:
            client_user = self.email

            # Share the Client document (read-only)
            frappe.share.add_docshare(
                self.doctype, self.name, client_user,
                read=1, write=0, share=0, notify=0
            )
            frappe.msgprint(f"👥 Client record shared with <b>{self.email}</b>")

            # Send welcome email
            try:
                frappe.sendmail(
                    recipients=[client_user],
                    subject="🎉 Welcome to Law Firm Portal",
                    message=f"""
                        Dear {self.client_name or 'Client'},<br><br>
                        Your profile has been created in our system.<br>
                        You can log in with this email (<b>{self.email}</b>) to view your consultations and documents.<br><br>
                        Thank you,<br>
                        ⚖️ Law Firm
                    """
                )
                frappe.msgprint(f"📧 Welcome email sent to <b>{self.email}</b>")
            except Exception:
                frappe.log_error(frappe.get_traceback(), "Client Email Send Failed")
                frappe.msgprint("⚠️ Failed to send welcome email. Please check Email settings.")

    def on_update(self):
        # ✅ Sync Case fields to Case Details
        case_details_list = frappe.get_all(
            "Case Details", filters={"client": self.name}, fields=["name"]
        )
        for cd in case_details_list:
            cd_doc = frappe.get_doc("Case Details", cd["name"])
            cd_doc.client_name = self.client_name
            cd_doc.client_type = self.client_type
            cd_doc.gender = self.gender
            cd_doc.date_of_birth = self.date_of_birth
            cd_doc.company_name = self.company_name
            cd_doc.contact_number = self.contact_number
            cd_doc.city = self.city
            cd_doc.state = self.state
            cd_doc.save(ignore_permissions=True)

        frappe.msgprint(f"🔄 Client details updated & synced to Case Details for <b>{self.client_name}</b>")



