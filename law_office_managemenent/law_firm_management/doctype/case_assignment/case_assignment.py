import frappe
from frappe.model.document import Document

class CaseAssignment(Document):

    def on_update(self):
        # Notify Junior Advocate only once
        if self.senior_lawyer_status == "Approved" and not getattr(self, "_notified", False):
            self.send_approval_notification()
            self._notified = True

        # Sync to Case Details after approval
        if self.senior_lawyer_status == "Approved":
            self.update_case_details()

    def send_approval_notification(self):
        if self.advocate:
            junior_advocate_email = frappe.db.get_value("Junior Advocate", self.advocate, "mail_id")
            if junior_advocate_email:
                try:
                    frappe.sendmail(
                        recipients=[junior_advocate_email],
                        subject=f"Case Assignment Approved: {self.case_title}",
                        message=f"""
                        Dear Junior Advocate,<br><br>
                        The Case Assignment <b>{self.case_title}</b> has been approved by Senior Lawyer.<br>
                        You can now edit the details.<br><br>
                        Thank you,<br>Law Firm
                        """
                    )
                except Exception:
                    frappe.log_error(frappe.get_traceback(), "Case Assignment Email Failed")

                # Desktop notification
                frappe.publish_realtime(
                    event="msgprint",
                    message=f"Case Assignment '{self.case_title}' approved by Senior Lawyer.",
                    user=junior_advocate_email
                )

    def update_case_details(self):
        # Update all linked Case Details
        if self.case:  # make sure 'case' is the link field to Case
            case_details_list = frappe.get_all(
                "Case Details",
                filters={"case_id": self.case},  # field in Case Details pointing to Case
                fields=["name"]
            )

            for cd in case_details_list:
                cd_doc = frappe.get_doc("Case Details", cd.name)
                # Update fields you want from Case Assignment
                # cd_doc.advocate = self.advocate
                cd_doc.senior_lawyer_status = self.senior_lawyer_status
                cd_doc.assigned_date = self.assigned_date
                cd_doc.save(ignore_permissions=True)