frappe.ui.form.on("Case Details", {
    refresh(frm) {
        set_case_stage_options(frm);
        toggle_payment_fields(frm);
        add_pay_now_button(frm);
        apply_junior_advocate_restrictions(frm);
        frm.add_custom_button(__('Bail'), function () {
            create_bail_record(frm);
        });

        // Junior Advocate role
        // if (frappe.user_roles.includes("Junior Advocate")) {
        //     if (frm.doc.senior_lawyer_status !== "Approved") {
        //         // Make all input fields read-only
        //         Object.values(frm.fields_dict).forEach(f => {
        //             if (["Data", "Link", "Select", "Date", "Datetime", "Int", "Float", "Currency", "Small Text", "Long Text", "Check"].includes(f.df.fieldtype)) {
        //                 frm.set_df_property(f.df.fieldname, "read_only", 1);
        //             }
        //         });
        //         frm.set_intro("⛔ You cannot edit until Senior Lawyer approves.");
        //     } else {
        //         // Allow edit again
        //         Object.values(frm.fields_dict).forEach(f => {
        //             if (["Data", "Link", "Select", "Date", "Datetime", "Int", "Float", "Currency", "Small Text", "Long Text", "Check"].includes(f.df.fieldtype)) {
        //                 frm.set_df_property(f.df.fieldname, "read_only", 0);
        //             }
        //         });
        //         frm.set_intro("");
        //     }
        // }
    },

    case_type(frm) {
        set_case_stage_options(frm);
        frm.refresh();
    },

    payment_mode(frm) {
        toggle_payment_fields(frm)
        add_pay_now_button(frm)
    },
    senior_lawyer_status(frm) {
        apply_junior_advocate_restrictions(frm);
    }
});


// ================= Helper Function =================
function apply_junior_advocate_restrictions(frm) {
    if (frappe.user_roles.includes("Junior Advocate")) {
        if (frm.doc.senior_lawyer_status !== "Approved") {
            // Lock fields
            Object.values(frm.fields_dict).forEach(f => {
                if (["Data", "Link", "Select", "Date", "Datetime", "Int", "Float", "Currency", "Small Text", "Long Text", "Check"].includes(f.df.fieldtype)) {
                    frm.set_df_property(f.df.fieldname, "read_only", 1);
                }
            });
            // Lock child tables too
            if (frm.fields_dict["case_proceedings"]) frm.fields_dict["case_proceedings"].grid.toggle_enable(false);
            if (frm.fields_dict["case_invoice"]) frm.fields_dict["case_invoice"].grid.toggle_enable(false);

            frm.set_intro("⛔ You cannot edit until Senior Lawyer approves.");
        } else {
            // Unlock fields
            Object.values(frm.fields_dict).forEach(f => {
                if (["Data", "Link", "Select", "Date", "Datetime", "Int", "Float", "Currency", "Small Text", "Long Text", "Check"].includes(f.df.fieldtype)) {
                    frm.set_df_property(f.df.fieldname, "read_only", 0);
                }
            });
            // Unlock child tables
            if (frm.fields_dict["case_proceedings"]) frm.fields_dict["case_proceedings"].grid.toggle_enable(true);
            if (frm.fields_dict["case_invoice"]) frm.fields_dict["case_invoice"].grid.toggle_enable(true);

            frm.set_intro("");
        }
    }
}

// ================= Case Stage Options =================
function set_case_stage_options(frm) {
    if (!frm.doc.case_type) return;

    let stages = [];
    switch (frm.doc.case_type) {
        case "Civil":
            stages = ["Admission/Notice", "Pleadings/WS", "Issues", "Plaintiff Evidence", "Defendant Evidence", "Arguments", "Judgment"];
            break;
        case "Criminal":
            stages = ["Cognizance", "Supply of Documents", "Charge Framing", "Prosecution Evidence", "313 Statement", "Defence Evidence", "Arguments", "Judgment", "Sentencing/Bail/Appeal"];
            break;
        case "Family":
            stages = ["Counseling/Mediation", "Interim Applications (Maintenance/Child Custody)", "Petitioner Evidence", "Respondent Evidence", "Arguments", "Decree"];
            break;
        case "Labour":
            stages = ["Reference/Complaint Filed", "Conciliation", "Framing of Issues", "Evidence", "Arguments", "Award"];
            break;
        case "Consumer Complaints":
            stages = ["Admission", "Notice", "Evidence Affidavits", "Written Arguments", "Order"];
            break;
        case "Company Law":
            stages = ["Admission", "IRP Appointment", "CoC Formation", "Resolution Process", "Plan Approval", "Liquidation/Closure"];
            break;
        case "Tax matters":
            stages = ["Show-Cause", "Personal Hearing(s)", "Order", "Appeal (CIT(A)/ITAT/HC)", "Remand/Final Order"];
            break;
        case "Service Matters":
            stages = ["Admission", "Counter", "Rejoinder", "Evidence (if any)", "Final Hearing", "Order"];
            break;
        case "Constitutional Issues":
            stages = ["Admission", "Counter", "Rejoinder", "Final Arguments", "Judgment"];
            break;
        case "Other":
            stages = ["Custom stages as per need"];
            break;
    }

    // Apply dynamic options to Case Proceedings child table → case_stage field
    if (frm.fields_dict["case_proceedings"] && frm.fields_dict["case_proceedings"].grid) {
        let grid_field = frm.fields_dict["case_proceedings"].grid.get_field("case_stage");
        grid_field.df.options = stages.join("\n");
        frm.fields_dict["case_proceedings"].refresh();
    }
}

// ================= Payment Mode Toggle =================
function toggle_payment_fields(frm, cdt, cdn) {
    if (cdt && cdn) {
        let row = locals[cdt][cdn];

        // hide all dependent fields
        frappe.model.set_value(cdt, cdn, "upi_id", null);
        frappe.model.set_value(cdt, cdn, "card_number", null);
        frappe.model.set_value(cdt, cdn, "card_type", null);
        frappe.model.set_value(cdt, cdn, "bank_name", null);

        if (row.payment_mode === "UPI") frappe.model.set_value(cdt, cdn, "upi_id_hidden", 0);
        else if (row.payment_mode === "Card") {
            frappe.model.set_value(cdt, cdn, "card_number_hidden", 0);
            frappe.model.set_value(cdt, cdn, "card_type_hidden", 0);
        }
        else if (row.payment_mode === "Bank Transfer") frappe.model.set_value(cdt, cdn, "bank_name_hidden", 0);
    } else {
        // parent form
        frm.set_df_property("upi_id", "hidden", 1);
        frm.set_df_property("card_number", "hidden", 1);
        frm.set_df_property("card_type", "hidden", 1);
        frm.set_df_property("bank_name", "hidden", 1);

        if (frm.doc.payment_mode === "UPI") frm.set_df_property("upi_id", "hidden", 0);
        else if (frm.doc.payment_mode === "Card") {
            frm.set_df_property("card_number", "hidden", 0);
            frm.set_df_property("card_type", "hidden", 0);
        }
        else if (frm.doc.payment_mode === "Bank Transfer") frm.set_df_property("bank_name", "hidden", 0);
    }
}

// ================= Pay Now Button =================
function add_pay_now_button(frm) {
    // Remove old button if exists
    frm.page.remove_inner_button('Pay Now');

    if (["UPI", "Card", "Bank Transfer"].includes(frm.doc.payment_mode) && frm.doc.total_amount > 0 && frm.doc.payment_status !== "Paid") {
        frm.add_custom_button('Pay Now', () => {
            let options = {
                "key": "rzp_test_R7xDdI0dwGlmRA",  // Your Key ID
                "amount": frm.doc.total_amount * 100,  // in paise
                "currency": "INR",
                "name": "Law Firm Management",
                "description": "Case Payment",
                "handler": function (response) {
                    frappe.call({
                        method: "law_office_managemenent.law_firm_management.doctype.case_details.case_details.mark_payment_success",
                        args: {
                            docname: frm.doc.name,
                            razorpay_payment_id: response.razorpay_payment_id
                        },
                        callback: function (r) {
                            if (r.message.status === "success") {
                                frappe.msgprint("Payment Successful!");
                                frm.reload_doc();
                            }
                        }
                    });
                },
                "prefill": {
                    "name": frappe.session.user_fullname,
                    "email": frappe.session.user,
                },
                "theme": {
                    "color": "#528FF0"
                }
            };
            let rzp = new Razorpay(options);
            rzp.open();
        });
    }
}

// ================= Case Invoice Calculation =================
frappe.ui.form.on("Case Invoice", {
    qty(frm, cdt, cdn) { calculate_amount(frm, cdt, cdn); },
    rate(frm, cdt, cdn) { calculate_amount(frm, cdt, cdn); },
    tax_percent(frm, cdt, cdn) { calculate_amount(frm, cdt, cdn); },
    payment_mode(frm, cdt, cdn) { toggle_payment_fields(frm, cdt, cdn); }
});

function calculate_amount(frm, cdt, cdn) {
    let row = locals[cdt][cdn];
    if (!row.qty || !row.rate) return;

    let qty = parseFloat(row.qty);
    let rate = parseFloat(row.rate);
    let tax = parseFloat(row.tax_percent || 0);

    row.amount = qty * rate;
    row.amount_with_tax = row.amount + (row.amount * tax / 100);

    frappe.model.set_value(cdt, cdn, "amount", row.amount);
    frappe.model.set_value(cdt, cdn, "amount_with_tax", row.amount_with_tax);

    // Update parent total_amount only if workflow state is not Closed
    let total = 0;
    (frm.doc.case_invoice || []).forEach(r => {
        total += parseFloat(r.amount_with_tax || 0);
    });

    if (frm.doc.workflow_state !== "Closed") {
        frm.set_value("total_amount", total);
    }
}


function create_bail_record(frm) {
    frappe.model.get_new_doc('Bail', null, null, function (bail_doc) {
        // Set case_id from Case Details
        bail_doc.case_id = frm.doc.name;  // or frm.doc.case_id if you have a custom field

        // You can also pass more values if needed
        // bail_doc.client = frm.doc.client;
        // bail_doc.case_type = frm.doc.case_type;

        // Redirect to new Bail form
        frappe.set_route('Form', 'Bail', bail_doc.name);
    });
}