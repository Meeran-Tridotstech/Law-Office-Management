import frappe
from frappe.model.document import Document
from frappe.desk.form import assign_to
from frappe.utils import nowdate, add_days, format_date

import frappe
from frappe.model.document import Document
from frappe.utils import getdate

class ClientConsultation(Document):
    def after_insert(self):
        advocate_user = frappe.db.get_value("Advocate", self.advocate, "mail_id")
        if not advocate_user:
            frappe.msgprint(f"Advocate {self.advocate} does not have an email.")
            return

        frappe.share.add_docshare(
            self.doctype, self.name, advocate_user,
            read=1, write=1, share=1, notify=0
        )
        frappe.msgprint(f"Consultation assigned to Advocate: {self.advocate} ({advocate_user})")

        if self.preferred_date_1 and self.preferred_date_2:
            if getdate(self.preferred_date_1) > getdate(self.preferred_date_2):
                frappe.throw("Preferred Date 1 cannot be later than Preferred Date 2")

        # if not self.status:
        #     self.status = "Assigned"
        #     self.db_update()
        #     frappe.msgprint("Status set to 'Assigned'")