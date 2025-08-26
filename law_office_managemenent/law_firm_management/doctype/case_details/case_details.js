// frappe.ui.form.on("Case Details", {
//     refresh(frm) {
//         set_case_stage_options(frm);
//     },
//     case_type(frm) {
//         set_case_stage_options(frm);
//     },
//     payment_mode(frm, cdt, cdn) {
//         let row = locals[cdt][cdn];

//         frappe.model.set_value(cdt, cdn, "upi_id", "");
//         frappe.model.set_value(cdt, cdn, "card_number", "");
//         frappe.model.set_value(cdt, cdn, "card_type", "");
//         frappe.model.set_value(cdt, cdn, "bank_name", "");
//         frappe.model.set_value(cdt, cdn, "cheque_number", "");

//         if (row.payment_mode == "UPI") {
//             frm.fields_dict['case_invoice'].grid.toggle_display('upi_id', true, row.name);
//         } else {
//             frm.fields_dict['case_invoice'].grid.toggle_display('upi_id', false, row.name);
//         }

//         if (row.payment_mode == "Card") {
//             frm.fields_dict['case_invoice'].grid.toggle_display('card_number', true, row.name);
//             frm.fields_dict['case_invoice'].grid.toggle_display('card_type', true, row.name);
//         } else {
//             frm.fields_dict['case_invoice'].grid.toggle_display('card_number', false, row.name);
//             frm.fields_dict['case_invoice'].grid.toggle_display('card_type', false, row.name);
//         }

//         if (row.payment_mode == "Bank Transfer") {
//             frm.fields_dict['case_invoice'].grid.toggle_display('bank_name', true, row.name);
//             frm.fields_dict['case_invoice'].grid.toggle_display('cheque_number', true, row.name);
//         } else {
//             frm.fields_dict['case_invoice'].grid.toggle_display('bank_name', false, row.name);
//             frm.fields_dict['case_invoice'].grid.toggle_display('cheque_number', false, row.name);
//         }
//     }

// });

// function set_case_stage_options(frm) {
//     if (!frm.doc.case_type) return;

//     let stages = [];

//     switch (frm.doc.case_type) {
//         case "Civil":
//             stages = [
//                 "Admission/Notice",
//                 "Pleadings/WS",
//                 "Issues",
//                 "Plaintiff Evidence",
//                 "Defendant Evidence",
//                 "Arguments",
//                 "Judgment"
//             ];
//             break;

//         case "Criminal":
//             stages = [
//                 "Cognizance",
//                 "Supply of Documents",
//                 "Charge Framing",
//                 "Prosecution Evidence",
//                 "313 Statement",
//                 "Defence Evidence",
//                 "Arguments",
//                 "Judgment",
//                 "Sentencing/Bail/Appeal"
//             ];
//             break;

//         case "Family":
//             stages = [
//                 "Counseling/Mediation",
//                 "Interim Applications (Maintenance/Child Custody)",
//                 "Petitioner Evidence",
//                 "Respondent Evidence",
//                 "Arguments",
//                 "Decree"
//             ];
//             break;

//         case "Labour":
//             stages = [
//                 "Reference/Complaint Filed",
//                 "Conciliation",
//                 "Framing of Issues",
//                 "Evidence",
//                 "Arguments",
//                 "Award"
//             ];
//             break;

//         case "Consumer Complaints":
//             stages = [
//                 "Admission",
//                 "Notice",
//                 "Evidence Affidavits",
//                 "Written Arguments",
//                 "Order"
//             ];
//             break;

//         case "Company Law":
//             stages = [
//                 "Admission",
//                 "IRP Appointment",
//                 "CoC Formation",
//                 "Resolution Process",
//                 "Plan Approval",
//                 "Liquidation/Closure"
//             ];
//             break;

//         case "Tax matters":
//             stages = [
//                 "Show-Cause",
//                 "Personal Hearing(s)",
//                 "Order",
//                 "Appeal (CIT(A)/ITAT/HC)",
//                 "Remand/Final Order"
//             ];
//             break;

//         case "Service Matters":
//             stages = [
//                 "Admission",
//                 "Counter",
//                 "Rejoinder",
//                 "Evidence (if any)",
//                 "Final Hearing",
//                 "Order"
//             ];
//             break;

//         case "Constitutional Issues":
//             stages = [
//                 "Admission",
//                 "Counter",
//                 "Rejoinder",
//                 "Final Arguments",
//                 "Judgment"
//             ];
//             break;

//         case "Other":
//             stages = ["Custom stages as per need"];
//             break;
//     }

//     // Apply dynamic options to Case Proceedings child table → case_stage field
//     let grid_field = frm.fields_dict["case_proceedings"].grid.get_field("case_stage");
//     grid_field.df.options = stages.join("\n");
//     frm.fields_dict["case_proceedings"].refresh();



// }




// frappe.ui.form.on("Case Invoice", {
//     qty(frm, cdt, cdn) { calculate_amount(frm, cdt, cdn); },
//     rate(frm, cdt, cdn) { calculate_amount(frm, cdt, cdn); },
//     tax_percent(frm, cdt, cdn) { calculate_amount(frm, cdt, cdn); }
// });

// function calculate_amount(frm, cdt, cdn) {
//     let row = locals[cdt][cdn];
//     if (!row.qty || !row.rate) return;

//     let qty = parseFloat(row.qty);
//     let rate = parseFloat(row.rate);
//     let tax_percent = parseFloat(row.tax_percent || 0);

//     row.amount = qty * rate;
//     row.amount_with_tax = row.amount + (row.amount * tax_percent / 100);

//     frappe.model.set_value(cdt, cdn, "amount", row.amount);
//     frappe.model.set_value(cdt, cdn, "amount_with_tax", row.amount_with_tax);

//     // Update parent totals
//     let total = 0, total_with_tax = 0;
//     (frm.doc.case_invoice || []).forEach(r => {
//         total += parseFloat(r.amount || 0);
//         total_with_tax += parseFloat(r.amount_with_tax || 0);
//     });
//     frm.set_value("amount", total);
//     frm.set_value("amount_with_tax", total_with_tax);
// }









// ================= Case Details =================
// frappe.ui.form.on("Case Details", {
//     refresh(frm) {
//         set_case_stage_options(frm);
//         toggle_payment_fields(frm);

//         // Add Pay Now button only for online payments (UPI/Card/Bank Transfer)
//         if (["UPI", "Card", "Bank Transfer"].includes(frm.doc.payment_mode)) {
//             frm.add_custom_button('Pay Now', () => {
//                 let options = {
//                     "key": "rzp_test_1DP5mmOlF5G5ag", // Replace with your Razorpay Test Key
//                     "amount": frm.doc.payable_amount * 100, // in paise
//                     "currency": "INR",
//                     "name": "Freeqube Inc.",
//                     "description": "Task Payment",
//                     "handler": function (response) {
//                         frappe.call({
//                             method: "freeqube.freeqube.doctype.task_payment_request.task_payment_request.mark_payment_success",
//                             args: {
//                                 docname: frm.doc.name,
//                                 razorpay_payment_id: response.razorpay_payment_id
//                             },
//                             callback: function (r) {
//                                 if (r.message.status === "success") {
//                                     frappe.msgprint("Payment Successful!");
//                                     frm.reload_doc();
//                                 }
//                             }
//                         });
//                     },
//                     "prefill": {
//                         "name": frappe.session.user_fullname,
//                         "email": frappe.session.user,
//                     },
//                     "theme": {
//                         "color": "#528FF0"
//                     }
//                 };
//                 let rzp = new Razorpay(options);
//                 rzp.open();
//             });
//         }
//     },
//     case_type(frm) {
//         set_case_stage_options(frm);
//         frm.refresh(); // refresh to update Pay Now button visibility
//     },
//     // submit_invoice(frm) {
//     //     // Show Payment Tab
//     //     frm.toggle_display("payment_tab", true);

//     //     // Switch to Payment Tab
//     //     if (frm.tab_manager) {
//     //         frm.tab_manager.show_tab("Payment");
//     //     }
//     // }

//     payment_mode(frm) {
//         toggle_payment_fields(frm);
//     }
// });

// // ================= Case Stage Options =================
// function set_case_stage_options(frm) {
//     if (!frm.doc.case_type) return;

//     let stages = [];
//     switch (frm.doc.case_type) {
//         case "Civil":
//             stages = ["Admission/Notice", "Pleadings/WS", "Issues", "Plaintiff Evidence", "Defendant Evidence", "Arguments", "Judgment"];
//             break;
//         case "Criminal":
//             stages = ["Cognizance", "Supply of Documents", "Charge Framing", "Prosecution Evidence", "313 Statement", "Defence Evidence", "Arguments", "Judgment", "Sentencing/Bail/Appeal"];
//             break;
//         case "Family":
//             stages = ["Counseling/Mediation", "Interim Applications (Maintenance/Child Custody)", "Petitioner Evidence", "Respondent Evidence", "Arguments", "Decree"];
//             break;
//         case "Labour":
//             stages = ["Reference/Complaint Filed", "Conciliation", "Framing of Issues", "Evidence", "Arguments", "Award"];
//             break;
//         case "Consumer Complaints":
//             stages = ["Admission", "Notice", "Evidence Affidavits", "Written Arguments", "Order"];
//             break;
//         case "Company Law":
//             stages = ["Admission", "IRP Appointment", "CoC Formation", "Resolution Process", "Plan Approval", "Liquidation/Closure"];
//             break;
//         case "Tax matters":
//             stages = ["Show-Cause", "Personal Hearing(s)", "Order", "Appeal (CIT(A)/ITAT/HC)", "Remand/Final Order"];
//             break;
//         case "Service Matters":
//             stages = ["Admission", "Counter", "Rejoinder", "Evidence (if any)", "Final Hearing", "Order"];
//             break;
//         case "Constitutional Issues":
//             stages = ["Admission", "Counter", "Rejoinder", "Final Arguments", "Judgment"];
//             break;
//         case "Other":
//             stages = ["Custom stages as per need"];
//             break;
//     }

//     // Apply dynamic options to Case Proceedings child table → case_stage field
//     let grid_field = frm.fields_dict["case_proceedings"].grid.get_field("case_stage");
//     grid_field.df.options = stages.join("\n");
//     frm.fields_dict["case_proceedings"].refresh();
// }

// // ================= Case Invoice Calculation =================
// frappe.ui.form.on("Case Invoice", {
//     qty(frm, cdt, cdn) { calculate_amount(frm, cdt, cdn); },
//     rate(frm, cdt, cdn) { calculate_amount(frm, cdt, cdn); },
//     tax_percent(frm, cdt, cdn) { calculate_amount(frm, cdt, cdn); },
//     payment_mode(frm, cdt, cdn) { toggle_payment_fields(frm, cdt, cdn); }
// });

// function calculate_amount(frm, cdt, cdn) {
//     let row = locals[cdt][cdn];
//     if (!row.qty || !row.rate) return;

//     let qty = parseFloat(row.qty);
//     let rate = parseFloat(row.rate);
//     let tax = parseFloat(row.tax_percent || 0);

//     row.amount = qty * rate;
//     row.amount_with_tax = row.amount + (row.amount * tax / 100);

//     frappe.model.set_value(cdt, cdn, "amount", row.amount);
//     frappe.model.set_value(cdt, cdn, "amount_with_tax", row.amount_with_tax);

//     // Update parent total_amount only if workflow state is not Closed
//     let total = 0;
//     (frm.doc.case_invoice || []).forEach(r => {
//         total += parseFloat(r.amount_with_tax || 0);
//     });

//     if (frm.doc.workflow_state !== "Closed") {
//         frm.set_value("total_amount", total);
//     }
// }

// // ================= Payment Mode Toggle =================
// function toggle_payment_fields(frm) {
//     // First hide all dependent fields
//     frm.set_df_property("upi_id", "hidden", 1);
//     frm.set_df_property("card_number", "hidden", 1);
//     frm.set_df_property("card_type", "hidden", 1);
//     frm.set_df_property("bank_name", "hidden", 1);

//     // Show fields based on payment method
//     if (frm.doc.payment_mode === "Cash") {
//         // Cash - show nothing or any cash related field if needed
//     }
//     else if (frm.doc.payment_mode === "UPI") {
//         frm.set_df_property("upi_id", "hidden", 0);
//     }
//     else if (frm.doc.payment_mode === "Card") {
//         frm.set_df_property("card_number", "hidden", 0);
//         frm.set_df_property("card_type", "hidden", 0);
//     }
//     else if (frm.doc.payment_mode === "Bank Transfer") {
//         frm.set_df_property("bank_name", "hidden", 0);
//     }
// }








frappe.ui.form.on("Case Details", {
    refresh(frm) {
        set_case_stage_options(frm);
        toggle_payment_fields(frm);
        add_pay_now_button(frm);
    },

    case_type(frm) {
        set_case_stage_options(frm);
        frm.refresh();
    },

    payment_mode(frm) {
        toggle_payment_fields(frm);
        add_pay_now_button(frm);
    }
});

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
    if(frm.fields_dict["case_proceedings"] && frm.fields_dict["case_proceedings"].grid) {
        let grid_field = frm.fields_dict["case_proceedings"].grid.get_field("case_stage");
        grid_field.df.options = stages.join("\n");
        frm.fields_dict["case_proceedings"].refresh();
    }
}

// ================= Payment Mode Toggle =================
function toggle_payment_fields(frm, cdt, cdn) {
    if(cdt && cdn) {
        let row = locals[cdt][cdn];

        // hide all dependent fields
        frappe.model.set_value(cdt, cdn, "upi_id", null);
        frappe.model.set_value(cdt, cdn, "card_number", null);
        frappe.model.set_value(cdt, cdn, "card_type", null);
        frappe.model.set_value(cdt, cdn, "bank_name", null);

        if(row.payment_mode === "UPI") frappe.model.set_value(cdt, cdn, "upi_id_hidden", 0);
        else if(row.payment_mode === "Card") {
            frappe.model.set_value(cdt, cdn, "card_number_hidden", 0);
            frappe.model.set_value(cdt, cdn, "card_type_hidden", 0);
        }
        else if(row.payment_mode === "Bank Transfer") frappe.model.set_value(cdt, cdn, "bank_name_hidden", 0);
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
                "handler": function(response) {
                    frappe.call({
                        method: "law_office_managemenent.law_firm_management.doctype.case_details.case_details.mark_payment_success",
                        args: {
                            docname: frm.doc.name,
                            razorpay_payment_id: response.razorpay_payment_id
                        },
                        callback: function(r) {
                            if(r.message.status === "success") {
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
