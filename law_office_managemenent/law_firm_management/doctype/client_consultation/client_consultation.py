# import frappe
# from frappe.model.document import Document
# from frappe.desk.form import assign_to
# import razorpay
# from frappe.utils import nowdate, add_days, format_date


# class ClientConsultation(Document):
# 	def after_insert(doc, method=None):
# 		if not doc.advocate:
# 			return

# 		advocate_user = frappe.db.get_value("Advocate", doc.advocate, "mail_id")
# 		if not advocate_user:
# 			return

# 		assign_to.add({
# 			"assign_to": [advocate_user],
# 			"doctype": doc.doctype,
# 			"name": doc.name,
# 			"description": f"New consultation assigned: {doc.client_name or doc.name}",
# 			"notify": 1,
# 			"priority": "Medium"
# 		})

# 		frappe.share.add_docshare(
# 			doc.doctype, doc.name, advocate_user,
# 			read=1, write=1, share=1, notify=0
# 		)

# 		if not doc.status:
# 			frappe.db.set_value(doc.doctype, doc.name, "status", "Assigned")

# 		try:
# 			frappe.sendmail(
# 				recipients=[advocate_user],
# 				subject="New Client Consultation assigned",
# 				message=f"Consultation <b>{doc.name}</b> assigned to you."
# 			)
# 		except Exception:
# 			pass
	
# 	def validate(self):
# 		if self.confirmed_date:
# 			user = frappe.session.user
# 			roles = frappe.get_roles(user)

# 			if "Advocate" not in roles:
# 				frappe.throw("Only Advocate can confirm meeting date.")

# 	def after_save(self):
# 		if self.confirmed_date and not self.get("_notified"):
# 			client_user = frappe.db.get_value("Client", self.client_name, "email_id")
# 			if client_user:
# 				try:
# 					frappe.sendmail(
# 						recipients=[client_user],
# 						subject="Meeting Date Confirmed",
# 						message=f"Your consultation meeting is confirmed on <b>{self.confirmed_date}</b>."
# 					)
# 				except Exception:
# 					pass

# 			if client_user:
# 				from frappe.desk.form.assign_to import add as assign_add
# 				assign_add({
# 					"assign_to": [client_user],
# 					"doctype": self.doctype,
# 					"name": self.name,
# 					"description": f"Meeting confirmed on {self.confirmed_date}",
# 					"notify": 1,
# 					"priority": "High"
# 				})

# 			self._notified = True




import frappe
from frappe.model.document import Document
from frappe.desk.form import assign_to
import razorpay
from frappe.utils import nowdate, add_days, format_date

class ClientConsultation(Document):

    def after_insert(doc, method=None):
        if not doc.advocate:
            frappe.msgprint("⚠️ No advocate assigned yet.")
            return

        advocate_user = frappe.db.get_value("Advocate", doc.advocate, "mail_id")
        if not advocate_user:
            frappe.msgprint(f"⚠️ Advocate {doc.advocate} does not have an email.")
            return

        assign_to.add({
            "assign_to": [advocate_user],
            "doctype": doc.doctype,
            "name": doc.name,
            "description": f"📌 New consultation assigned: {doc.client_name or doc.name}",
            "notify": 1,
            "priority": "Medium"
        })
        frappe.msgprint(f"✅ Consultation assigned to Advocate: {doc.advocate} ({advocate_user})")

        frappe.share.add_docshare(
            doc.doctype, doc.name, advocate_user,
            read=1, write=1, share=1, notify=0
        )
        frappe.msgprint("👥 Advocate granted access to this consultation record.")

        if not doc.status:
            frappe.db.set_value(doc.doctype, doc.name, "status", "Assigned")
            frappe.msgprint("🔄 Status set to 'Assigned'")

        try:
            frappe.sendmail(
                recipients=[advocate_user],
                subject="📨 New Client Consultation assigned",
                message=f"Consultation <b>{doc.name}</b> assigned to you."
            )
            frappe.msgprint(f"📧 Notification email sent to Advocate: {advocate_user}")
        except Exception:
            frappe.log_error(frappe.get_traceback(), "Client Consultation Email Failed")
            frappe.msgprint("⚠️ Failed to send email to advocate.")

    def validate(self):
        if self.confirmed_date:
            user = frappe.session.user
            roles = frappe.get_roles(user)

            if "Advocate" not in roles:
                frappe.msgprint("❌ Only Advocate can confirm meeting date.")
                frappe.throw("Only Advocate can confirm meeting date.")
            else:
                frappe.msgprint(f"✅ Meeting date {self.confirmed_date} confirmed by Advocate.")

    def after_save(self):
        if self.confirmed_date and not self.get("_notified"):
            client_user = frappe.db.get_value("Client", self.client_name, "email_id")
            if client_user:
                try:
                    frappe.sendmail(
                        recipients=[client_user],
                        subject="📅 Meeting Date Confirmed",
                        message=f"Your consultation meeting is confirmed on <b>{self.confirmed_date}</b>."
                    )
                    frappe.msgprint(f"📧 Confirmation email sent to client: {client_user}")
                except Exception:
                    frappe.log_error(frappe.get_traceback(), "Client Consultation Confirmation Email Failed")
                    frappe.msgprint("⚠️ Failed to send confirmation email to client.")

                from frappe.desk.form.assign_to import add as assign_add
                assign_add({
                    "assign_to": [client_user],
                    "doctype": self.doctype,
                    "name": self.name,
                    "description": f"📌 Meeting confirmed on {self.confirmed_date}",
                    "notify": 1,
                    "priority": "High"
                })
                frappe.msgprint("👥 Client notified and assignment created.")

            self._notified = True
            frappe.msgprint("🔔 Notification process completed.")
