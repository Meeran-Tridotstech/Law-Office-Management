# import frappe
# from frappe.model.document import Document

# class CaseAssignment(Document):

#     def on_update(self):
#         # Notify Junior Advocate only once
#         if self.senior_lawyer_status == "Approved" and not getattr(self, "_notified", False):
#             self.send_approval_notification()
#             self._notified = True

#         # Sync to Case Details after approval
#         if self.senior_lawyer_status == "Approved":
#             self.update_case_details()

#     def send_approval_notification(self):
#         if self.advocate:
#             junior_advocate_email = frappe.db.get_value("Junior Advocate", self.advocate, "mail_id")
#             if junior_advocate_email:
#                 try:
#                     frappe.sendmail(
#                         recipients=[junior_advocate_email],
#                         subject=f"Case Assignment Approved: {self.case_title}",
#                         message=f"""
#                         Dear Junior Advocate,<br><br>
#                         The Case Assignment <b>{self.case_title}</b> has been approved by Senior Lawyer.<br>
#                         You can now edit the details.<br><br>
#                         Thank you,<br>Law Firm
#                         """
#                     )
#                 except Exception:
#                     frappe.log_error(frappe.get_traceback(), "Case Assignment Email Failed")

#                 # Desktop notification
#                 frappe.publish_realtime(
#                     event="msgprint",
#                     message=f"Case Assignment '{self.case_title}' approved by Senior Lawyer.",
#                     user=junior_advocate_email
#                 )

#     def update_case_details(self):
#         # Update all linked Case Details
#         if self.case:  # make sure 'case' is the link field to Case
#             case_details_list = frappe.get_all(
#                 "Case Details",
#                 filters={"case_id": self.case},  # field in Case Details pointing to Case
#                 fields=["name"]
#             )

#             for cd in case_details_list:
#                 cd_doc = frappe.get_doc("Case Details", cd.name)
#                 # Update fields you want from Case Assignment
#                 # cd_doc.advocate = self.advocate
#                 cd_doc.senior_lawyer_status = self.senior_lawyer_status
#                 cd_doc.assigned_date = self.assigned_date
#                 cd_doc.save(ignore_permissions=True)




import frappe
from frappe.model.document import Document

class CaseAssignment(Document):

    def on_update(self):
        # Notify Junior Advocate only once
        if self.senior_lawyer_status == "Approved" and not getattr(self, "_notified", False):
            self.send_approval_notification()
            self._notified = True
            frappe.msgprint(f"✅ Case Assignment <b>{self.case_title}</b> approved. Junior Advocate notified 📩")

        # Sync to Case Details after approval
        if self.senior_lawyer_status == "Approved":
            self.update_case_details()
            frappe.msgprint(f"🔄 Linked Case Details updated for <b>{self.case_title}</b>")

    def send_approval_notification(self):
        if self.advocate:
            junior_advocate_email = frappe.db.get_value("Junior Advocate", self.advocate, "mail_id")
            if junior_advocate_email:
                try:
                    frappe.sendmail(
                        recipients=[junior_advocate_email],
                        subject=f"✅ Case Assignment Approved: {self.case_title}",
                        message=f"""
                        Dear Junior Advocate,<br><br>
                        🎉 The Case Assignment <b>{self.case_title}</b> has been <b>approved</b> by Senior Lawyer.<br>
                        ✍️ You can now edit the details.<br><br>
                        ⚖️ Thank you,<br>
                        Law Firm
                        """
                    )
                    frappe.msgprint(f"📧 Email sent to Junior Advocate: <b>{junior_advocate_email}</b>")
                except Exception:
                    frappe.log_error(frappe.get_traceback(), "Case Assignment Email Failed")
                    frappe.msgprint("⚠️ Failed to send email notification to Junior Advocate.")

                # Desktop notification
                frappe.publish_realtime(
                    event="msgprint",
                    message=f"🎉 Case Assignment '<b>{self.case_title}</b>' approved by Senior Lawyer ✅",
                    user=junior_advocate_email
                )

    def update_case_details(self):
        if self.case:  # link to Case
            case_details_list = frappe.get_all(
                "Case Details",
                filters={"case_id": self.case},
                fields=["name"]
            )

            for cd in case_details_list:
                # 🔄 Update only specific fields directly in DB
                frappe.db.set_value("Case Details", cd.name, {
                    "senior_lawyer_status": self.senior_lawyer_status,
                    "assigned_date": self.assigned_date
                    # add more fields if needed like:
                    # "client_type": self.client_type,
                    # "gender": self.gender,
                })

            frappe.msgprint(f"📂 {len(case_details_list)} Case Detail(s) synced with Case Assignment.")
