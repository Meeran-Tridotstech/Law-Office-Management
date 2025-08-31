import frappe

@frappe.whitelist()
def get_receiver(user):
    """Return the default receiver for the logged-in user based on role mapping"""
    roles = frappe.get_roles(user)

    # Example logic (adjust to your project structure)
    if "Client" in roles:
        # find assigned junior advocate
        advocate = frappe.db.get_value("Case Assignment", {"case": user}, "advocate")
        return advocate

    if "Junior Advocate" in roles:
        # find assigned senior advocate
        senior = frappe.db.get_value("Advocate", {"mail_id": user}, "advocate name")
        return senior

    if "Senior Advocate" in roles:
        # maybe chat back to junior or client
        return None  # Or return based on requirement

    return None