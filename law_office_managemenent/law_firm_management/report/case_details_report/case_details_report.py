# case_details_report.py
import frappe
from frappe import _

def execute(filters=None):
    columns = get_columns()
    data = get_values(filters or {})
    return columns, data

def get_columns():
    return [
        {"fieldname": "name", "fieldtype": "Data", "label": _("Case ID")},
        {"fieldname": "client", "fieldtype": "Link", "options": "Client", "label": _("Client")},
        {"fieldname": "client_name", "fieldtype": "Data", "label": _("Client Name")},
        {"fieldname": "client_type", "fieldtype": "Data", "label": _("Client Type")},
        {"fieldname": "gender", "fieldtype": "Data", "label": _("Gender")},
        {"fieldname": "contact_number", "fieldtype": "Data", "label": _("Contact Number")},
        {"fieldname": "company_name", "fieldtype": "Data", "label": _("Company Name")},
        {"fieldname": "date_of_birth", "fieldtype": "Date", "label": _("Date of Birth")},
        {"fieldname": "city", "fieldtype": "Data", "label": _("City")},
        {"fieldname": "case_type", "fieldtype": "Data", "label": _("Case Type")},
        {"fieldname": "status", "fieldtype": "Data", "label": _("Status")},
        {"fieldname": "advocate", "fieldtype": "Data", "label": _("Advocate")},
        {"fieldname": "assigned_date", "fieldtype": "Date", "label": _("Assigned Date")}
    ]

def get_values(filters):
    conditions = "1=1"

    if filters.get("client"):
        conditions += f" AND client = '{filters.get('client')}'"
    if filters.get("client_name"):
        conditions += f" AND client_name LIKE '%{filters.get('client_name')}%'"
    if filters.get("client_type"):
        conditions += f" AND client_type = '{filters.get('client_type')}'"
    if filters.get("gender"):
        conditions += f" AND gender = '{filters.get('gender')}'"
    if filters.get("contact_number"):
        conditions += f" AND contact_number LIKE '%{filters.get('contact_number')}%'"
    if filters.get("company_name"):
        conditions += f" AND company_name LIKE '%{filters.get('company_name')}%'"
    if filters.get("date_of_birth"):
        conditions += f" AND date_of_birth = '{filters.get('date_of_birth')}'"
    if filters.get("city"):
        conditions += f" AND city LIKE '%{filters.get('city')}%'"
    if filters.get("case_type"):
        conditions += f" AND case_type = '{filters.get('case_type')}'"
    if filters.get("status"):
        conditions += f" AND status = '{filters.get('status')}'"
    if filters.get("advocate"):
        conditions += f" AND advocate LIKE '%{filters.get('advocate')}%'"
    if filters.get("assigned_date"):
        conditions += f" AND assigned_date = '{filters.get('assigned_date')}'"

    query = f"""
        SELECT name, client, client_name, client_type, gender, contact_number,
               company_name, date_of_birth, city, case_type, status, advocate, assigned_date
        FROM `tabCase Details`
        WHERE {conditions}
        ORDER BY assigned_date DESC
    """

    return frappe.db.sql(query, as_dict=True)
