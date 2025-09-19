frappe.ui.form.on("Client", {
    // refresh(frm) {
    //     toggle_fields(frm);
    // },

    client_type(frm) {
        // toggle_fields(frm);
        if (frm.doc.client_type === "Individual") {
            frm.set_df_property("date_of_birth", "hidden", 0);
            frm.set_df_property("company_name", "hidden", 1);
        }
        else if (frm.doc.client_type === "Company") {
            frm.set_df_property("date_of_birth", "hidden", 1);
            frm.set_df_property("company_name", "hidden", 0);
        }
    },

    id_proof_type(frm) {
        if (frm.doc.id_proof_type) {
            let label_map = {
                "PAN": "PAN Number",
                "Aadhar": "Aadhar Number",
                "Passport": "Passport Number",
                "Driving License": "Driving License Number"
            };

            let placeholder_map = {
                "PAN": "Enter 10-character PAN (e.g., ABCDE1234F)",
                "Aadhar": "Enter 16-digit Aadhar Number",
                "Passport": "Enter 8-character Passport No (e.g., N1234567)",
                "Driving License": "Enter Driving License No (e.g., TN0120250001234)"
            };

            frm.set_df_property("id_proof_number", "label", label_map[frm.doc.id_proof_type]);
            frm.set_df_property("id_proof_number", "placeholder", placeholder_map[frm.doc.id_proof_type]);
            frm.set_df_property("id_proof_number", "description", `<b><span style="color:blue;">${placeholder_map[frm.doc.id_proof_type]}</span></b>`);
            frm.refresh_field("id_proof_number");

        }
    },

    validate(frm) {
        let value = frm.doc.id_proof_number || "";
        let type = frm.doc.id_proof_type;
        let error_msg = "";

        if (type === "PAN") {
            let regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
            if (!regex.test(value)) {
                error_msg = "Invalid PAN. Format: 5 letters + 4 digits + 1 letter (e.g., ABCDE1234F)";
            }
        }

        if (type === "Aadhar") {
            let regex = /^[0-9]{16}$/;
            if (!regex.test(value)) {
                error_msg = "Invalid Aadhar. Must be 16 digits.";
            }
        }

        if (type === "Passport") {
            let regex = /^[A-PR-WY][1-9]\d{6}$/;
            if (!regex.test(value)) {
                error_msg = "Invalid Passport. Format: 1 letter + 7 digits (e.g., N1234567)";
            }
        }

        if (type === "Driving License") {
            let regex = /^[A-Z]{2}[0-9]{2}[0-9]{4}[0-9]{7}$/;
            if (!regex.test(value)) {
                error_msg = "Invalid Driving License. Format: SS00YYYY0000000 (e.g., TN0120250001234)";
            }
        }

        if (error_msg) {
            frm.set_df_property("id_proof_number", "description", `<span style="color:red;">${error_msg}</span>`);
            frappe.validated = false;
            frappe.msgprint(error_msg);
        } else {
            frm.set_df_property("id_proof_number", "description", "");
            frappe.msgprint(`${type} Verified Successfully!`);
        }
    },

    after_save(frm) {
        frappe.confirm(
            __('Do you want to create a Bail for this Client?'),
            function () {
                frappe.call({
                    method: 'law_office_managemenent.law_firm_management.doctype.client.client.create_bail_for_client',
                    args: {
                        client_id: frm.doc.name
                    },
                    callback: function (r) {
                        if (!r.exc) {
                            frappe.msgprint(__('Bail record created successfully.'));
                            frm.reload_doc();
                        }
                    }
                });
            },
            function () {
                frappe.msgprint(__('Bail creation canceled.'));
            }
        );
    }
});

// function toggle_fields(frm) {
//     if (frm.doc.client_type === "Individual") {
//         frm.set_df_property("date_of_birth", "hidden", 0);
//         frm.set_df_property("company_name", "hidden", 1);
//     }
//     else if (frm.doc.client_type === "Company") {
//         frm.set_df_property("date_of_birth", "hidden", 1);
//         frm.set_df_property("company_name", "hidden", 0);
//     }
// }
