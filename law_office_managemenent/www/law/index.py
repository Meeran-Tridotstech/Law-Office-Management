import frappe

def get_context(context):
    doctype = frappe.form_dict.get("doctype")
    if not doctype:
        frappe.throw("Doctype is missing")

    context.doctype = doctype
    docs = frappe.get_all(doctype, fields=["name"])
    for d in docs:
        d["doctype"] = doctype  # Inject doctype into each dict
    context.docs = docs
    return context