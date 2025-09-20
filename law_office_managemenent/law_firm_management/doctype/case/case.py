import frappe
from frappe.model.document import Document
 
class Case(Document):
    def on_update(self):
        frappe.msgprint(f"Updating Case Details linked to client: {self.client}")

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
        frappe.msgprint("Case Details updated successfully!")


@frappe.whitelist()
def create_case_assignment(case_id, case_title):
    existing = frappe.get_all("Case Assignment", filters={"case": case_id}, fields=["name"])
    
    if existing:
        frappe.msgprint(f"Existing Case Assignment found: {existing[0].name}")
        return existing[0].name

    doc = frappe.get_doc({
        "doctype": "Case Assignment",
        "case": case_id,
        "case_title": case_title,
    })
    doc.insert()
    frappe.db.commit()

    frappe.msgprint(f"New Case Assignment created: {doc.name}")
    return doc.name
