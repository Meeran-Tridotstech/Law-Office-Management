import frappe

def execute(filters=None):
    filters = filters or {}

    # Columns for report
    columns = [
        "Client:Data:150",
        "Client Name:Data:150",
        "Client Type:Data:100",
        "Gender:Data:80",
        "Date of Birth:Date:100",
        "Contact Number:Data:120",
        "Company Name:Data:150",
        "City:Data:100",
        "State:Data:100",
        "Status:Data:100",
        "Case ID:Data:120",
        "Case Title:Data:200",
        "Filed Date:Date:100",
        "Typical Court:Data:150",
        "Court Name:Data:150",
        "Court Address:Data:200",
        "Court Location:Data:150",
        "Opponent Name:Data:150",
        "Advocate:Data:150",
        "Assigned Date:Date:100",
        "Senior Lawyer Status:Data:100",
        "Case Type:Data:100",
        "Total Amount:Currency:100",
        "Payment Mode:Data:100"
    ]

    # Fetch all data
    data = frappe.db.get_all(
        "Case Details",
        fields=[c.split(":")[0].lower().replace(" ", "_") for c in columns],
        filters=filters
    )

    # Convert dict to list of lists for report
    result = []
    for row in data:
        result.append([row.get(c.split(":")[0].lower().replace(" ", "_")) for c in columns])

    return columns, result
