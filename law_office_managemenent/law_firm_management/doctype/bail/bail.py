import frappe
from frappe.model.document import Document
from frappe.utils import getdate

class Bail(Document):
    def validate(self):
        if not self.table_pspm:
            return

        for idx in range(len(self.table_pspm)):
            current_row = self.table_pspm[idx]

            # 1. Validate current row's proceeding_date < next_hearing_date
            if current_row.proceeding_date and current_row.next_hearing_date:
                if getdate(current_row.proceeding_date) >= getdate(current_row.next_hearing_date):
                    frappe.throw(
                        f"[Row {idx + 1}] Proceeding Date ({current_row.proceeding_date}) must be before Next Hearing Date ({current_row.next_hearing_date})."
                    )

            # 2. Validate next row's proceeding_date > current row's next_hearing_date
            if idx < len(self.table_pspm) - 1:
                next_row = self.table_pspm[idx + 1]
                if current_row.next_hearing_date and next_row.proceeding_date:
                    if getdate(next_row.proceeding_date) <= getdate(current_row.next_hearing_date):
                        frappe.throw(
                            f"[Row {idx + 2}] Proceeding Date ({next_row.proceeding_date}) must be after previous row's Next Hearing Date ({current_row.next_hearing_date})."
                        )

                # 3. Validate next row's proceeding_date > current row's hearing_date
                if current_row.next_hearing_date and next_row.proceeding_date:
                    if getdate(next_row.proceeding_date) <= getdate(current_row.next_hearing_date):
                        frappe.throw(
                            f"[Row {idx + 2}] Proceeding Date ({next_row.proceeding_date}) must be after previous row's Hearing Date ({current_row.hearing_date})."
                        )
    def on_update(self):
        # Find matching Case Details
        matching_cases = frappe.get_all("Case Details", filters={"case_id": self.case}, fields=["name"])
        
        for case in matching_cases:
            frappe.db.set_value("Case Details", case.name, "bail_amount", self.bail_amount)