frappe.query_reports["Case Details Report"] = {
    "filters": [
        {
            'fieldname': 'client',
            'label': __('Client'),
            'fieldtype': 'Link',
            'options': 'Client'
        },
        {
            'fieldname': 'client_name',
            'label': __('Client Name'),
            'fieldtype': 'Data'
        },
        {
            'fieldname': 'client_type',
            'label': __('Client Type'),
            'fieldtype': 'Select',
            'options': ['', 'Individual', 'Company']
        },
        {
            'fieldname': 'gender',
            'label': __('Gender'),
            'fieldtype': 'Select',
            'options': ['', 'Male', 'Female', 'Other']
        },
        {
            'fieldname': 'contact_number',
            'label': __('Contact Number'),
            'fieldtype': 'Data'
        },
        {
            'fieldname': 'company_name',
            'label': __('Company Name'),
            'fieldtype': 'Data'
        },
        {
            'fieldname': 'date_of_birth',
            'label': __('Date of Birth'),
            'fieldtype': 'Date'
        },
        {
            'fieldname': 'city',
            'label': __('City'),
            'fieldtype': 'Data'
        },
        {
            'fieldname': 'case_type',
            'label': __('Case Type'),
            'fieldtype': 'Select',
            'options': ['', 'Civil', 'Criminal', 'Family', 'Labour','Consumer Complaints','Company Law','Tax matters','Service Matters','Constitutional Issues']
        },
        {
            'fieldname': 'status',
            'label': __('Status'),
            'fieldtype': 'Select',
            'options': ['', 'Draft', 'Filed', 'Hearing Scheduled','Under Trial','Judgement Pending','Closed']
        },
        {
            'fieldname': 'advocate',
            'label': __('Advocate'),
            'fieldtype': 'Data'
        },
        {
            'fieldname': 'assigned_date',
            'label': __('Assigned Date'),
            'fieldtype': 'Date'
        }
    ]
};
