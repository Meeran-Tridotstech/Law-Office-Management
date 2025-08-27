frappe.query_reports["Case Details Report"] = {
    "filters": [
        { "fieldname": "client", "label": "Client", "fieldtype": "Data" },
        { "fieldname": "client_name", "label": "Client Name", "fieldtype": "Data" },
        { "fieldname": "client_type", "label": "Client Type", "fieldtype": "Select", "options": ["Individual","Company"] },
        { "fieldname": "gender", "label": "Gender", "fieldtype": "Select", "options": ["Male","Female","Other"] },
        { "fieldname": "date_of_birth", "label": "Date of Birth", "fieldtype": "Date" },
        { "fieldname": "contact_number", "label": "Contact Number", "fieldtype": "Data" },
        { "fieldname": "company_name", "label": "Company Name", "fieldtype": "Data" },
        { "fieldname": "city", "label": "City", "fieldtype": "Data" },
        { "fieldname": "state", "label": "State", "fieldtype": "Data" },
        { "fieldname": "status", "label": "Status", "fieldtype": "Select", "options": ["Open","Closed","Pending"] },
        { "fieldname": "case_id", "label": "Case ID", "fieldtype": "Data" },
        { "fieldname": "case_title", "label": "Case Title", "fieldtype": "Data" },
        { "fieldname": "filed_date", "label": "Filed Date", "fieldtype": "Date" },
        { "fieldname": "typical_court", "label": "Typical Court", "fieldtype": "Data" },
        { "fieldname": "court_name", "label": "Court Name", "fieldtype": "Data" },
        { "fieldname": "court_address", "label": "Court Address", "fieldtype": "Data" },
        { "fieldname": "court_location", "label": "Court Location", "fieldtype": "Data" },
        { "fieldname": "opponent_name", "label": "Opponent Name", "fieldtype": "Data" },
        { "fieldname": "advocate", "label": "Advocate", "fieldtype": "Link", "options":"Employee" },
        { "fieldname": "assigned_date", "label": "Assigned Date", "fieldtype": "Date" },
        { "fieldname": "senior_lawyer_status", "label": "Senior Lawyer Status", "fieldtype": "Select", "options": ["Approved","Pending","Rejected"] },
        { "fieldname": "case_type", "label": "Case Type", "fieldtype": "Link", "options":"Case Type" },
        { "fieldname": "total_amount", "label": "Total Amount", "fieldtype": "Float" },
        { "fieldname": "payment_mode", "label": "Payment Mode", "fieldtype": "Select", "options":["Cash","Bank","Online"] }
    ]
};
