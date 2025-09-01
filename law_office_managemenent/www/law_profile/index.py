import frappe
 
def get_context(context):
    doctype = frappe.form_dict.get("doctype")
    name = frappe.form_dict.get("name")
 
    if not doctype or not name:
        context.doc = None
        return context
 
    try:
        context.doc = frappe.get_doc(doctype, name)
        context.data = doctype   # attach data to context
    except frappe.DoesNotExistError:
        context.doc = None
        context.data = None
 
    return context