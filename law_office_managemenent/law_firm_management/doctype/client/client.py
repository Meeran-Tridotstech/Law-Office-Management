import frappe
from frappe.model.document import Document
from frappe import _
from frappe.utils import flt
# import io
# import base64
# from io import BytesIO


class Client(Document):
    def after_insert(self):
        if not frappe.db.exists("Case", {"client": self.name}):
            case = frappe.get_doc({
                "doctype": "Case",
                "client": self.name,
                "case_type": "Civil",
            })
            case.insert()
            frappe.msgprint(f"New Case created for client <b>{self.client_name}</b>")
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
                "client_email": self.custom_email,
                "city": self.city,
                "state": self.state,
            })
            case_details.insert()
            frappe.msgprint(f"Case Details created for client <b>{self.client_name}</b>")

        # if self.email:
        #     client_user = self.email
        #     frappe.share.add_docshare(
        #         self.doctype, self.name, client_user,
        #         read=1, write=0, share=0, notify=0
        #     )
        #     frappe.msgprint(f"Client record shared with <b>{self.email}</b>")

        #     try:
        #         frappe.sendmail(
        #             recipients=[client_user],
        #             subject="Welcome to Law Firm Portal",
        #             message=f"""
        #                 Dear {self.client_name or 'Client'},<br><br>
        #                 Your profile has been created in our system.<br>
        #                 You can log in with this email (<b>{self.email}</b>) to view your consultations and documents.<br><br>
        #                 Thank you,<br>
        #                 Law Firm
        #             """
        #         )
        #         frappe.msgprint(f"Welcome email sent to <b>{self.email}</b>")
        #     except Exception:
        #         frappe.log_error(frappe.get_traceback(), "Client Email Send Failed")
        #         frappe.msgprint("Failed to send welcome email. Please check Email settings.")

        

    def on_update(self):
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
            cd_doc.save()

        frappe.msgprint(f"Client details updated & synced to Case Details for <b>{self.client_name}</b>")


@frappe.whitelist()
def create_bail_for_client(client_id):
    client = frappe.get_doc("Client", client_id)
    
    if not client:
        frappe.throw(_("Client not found"))

    bail_doc = frappe.new_doc("Bail")
    bail_doc.client = client.name
    bail_doc.case_id = client.get("related_case")
    bail_doc.save()
    frappe.db.commit()
    return bail_doc