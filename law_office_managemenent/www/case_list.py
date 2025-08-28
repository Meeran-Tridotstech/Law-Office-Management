import frappe

def get_context(context):
    # Fetch all case details records
    context.cases = frappe.get_all(
        "Case Details",
        fields=["name", "client", "case_type", "status", "hearing_date"]
    )
    return context
