// Copyright (c) 2025, Meeran and contributors
// For license information, please see license.txt

frappe.ui.form.on("Client", {
    refresh(frm) {
        toggle_fields(frm);
    },
    client_type(frm) {
        toggle_fields(frm);
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
                "Aadhar": "Enter 12-digit Aadhar Number",
                "Passport": "Enter 8-character Passport No (e.g., N1234567)",
                "Driving License": "Enter Driving License No (e.g., TN0120250001234)"
            };

            // Set label and placeholder
            frm.set_df_property("id_proof_number", "label", label_map[frm.doc.id_proof_type]);
            frm.set_df_property("id_proof_number", "placeholder", placeholder_map[frm.doc.id_proof_type]);
            frm.set_df_property("id_proof_number", "description", "");
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
            let regex = /^[0-9]{12}$/;
            if (!regex.test(value)) {
                error_msg = "Invalid Aadhar. Must be 12 digits.";
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
            // Show error message under the field (not popup)
            frm.set_df_property("id_proof_number", "description", `<span style="color:red;">${error_msg}</span>`);
            frappe.validated = false; // prevent save
        } else {
            // Clear description if valid
            frm.set_df_property("id_proof_number", "description", "");
        }
    }

    
});

function toggle_fields(frm) {
    if (frm.doc.client_type === "Individual") {
        frm.set_df_property("dob", "hidden", 0);
        frm.set_df_property("company_name", "hidden", 1);
    }
    else if (frm.doc.client_type === "Company") {
        frm.set_df_property("dob", "hidden", 1);
        frm.set_df_property("company_name", "hidden", 0);
    }
}