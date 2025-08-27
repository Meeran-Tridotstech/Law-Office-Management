# Copyright (c) 2025, Meeran and contributors
# For license information, please see license.txt
import frappe
from frappe.model.document import Document
 
class Case(Document):
    def on_update(self):
        case_details_list = frappe.get_all(
            "Case Details",
            filters={"client": self.client},
            fields=["name"]
        )

        for cd in case_details_list:
            cd_doc = frappe.get_doc("Case Details", cd.name)
            cd_doc.case_id = self.name
            cd_doc.case_title = self.case_title
            cd_doc.case_type = self.case_type
            cd_doc.filed_date = self.filed_date
            cd_doc.typical_court = self.typical_court
            cd_doc.court_name = self.court_name
            cd_doc.court_address = self.court_address
            cd_doc.court_location = self.court_location
            cd_doc.opponent_name = self.opponent_name
            cd_doc.advocate = self.advocate
            cd_doc.save()

import frappe

@frappe.whitelist()
def create_case_assignment(case_id, case_title):
    # Check if a Case Assignment already exists for this Case
    existing = frappe.get_all("Case Assignment", filters={"case": case_id}, fields=["name"])
    
    if existing:
        # return existing Case Assignment
        return existing[0].name

    # Create new Case Assignment
    doc = frappe.get_doc({
        "doctype": "Case Assignment",
        "case": case_id,
        "case_title": case_title,
    })
    doc.insert(ignore_permissions=True)
    frappe.db.commit()
    return doc.name

