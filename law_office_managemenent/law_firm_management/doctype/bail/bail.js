// Copyright (c) 2025, Meeran and contributors
// For license information, please see license.txt

frappe.ui.form.on("Bail", {
    refresh(frm) {
        // Set the filter for the case link field when the form is refreshed
        filter_cases_based_on_client(frm);
    },

    client(frm) {
        // Filter cases when client is selected or changed
        filter_cases_based_on_client(frm);
    }
});

function filter_cases_based_on_client(frm) {
    if (frm.doc.client) {
        frm.set_query("case", function () {
            return {
                filters: {
                    client: frm.doc.client // Only show cases related to this client
                }
            };
        });
    }
}