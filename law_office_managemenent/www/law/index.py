import frappe

def get_context(context):
    doctype = frappe.form_dict.get("doctype")
    if not doctype:
        frappe.throw("Doctype is missing")

    context.doctype = doctype
    context.docs = frappe.get_all(doctype, fields=["name"])
    return context
