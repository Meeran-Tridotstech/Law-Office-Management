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
frappe.ui.form.on("Case Details", {
    refresh(frm) {
        set_case_stage_options(frm);
    },
    case_type(frm) {
        set_case_stage_options(frm);
    }
});

// Payment mode toggle for child table fields
frappe.ui.form.on("Case Invoice", {
    payment_mode(frm, cdt, cdn) {
        let row = locals[cdt][cdn];

        // Reset all related fields
        frappe.model.set_value(cdt, cdn, "upi_id", "");
        frappe.model.set_value(cdt, cdn, "card_number", "");
        frappe.model.set_value(cdt, cdn, "card_type", "");
        frappe.model.set_value(cdt, cdn, "bank_name", "");
        frappe.model.set_value(cdt, cdn, "cheque_number", "");

        // Toggle fields based on payment mode
        frm.fields_dict['case_invoice'].grid.toggle_display('upi_id', row.payment_mode === "UPI", row.name);
        frm.fields_dict['case_invoice'].grid.toggle_display('card_number', row.payment_mode === "Card", row.name);
        frm.fields_dict['case_invoice'].grid.toggle_display('card_type', row.payment_mode === "Card", row.name);
        frm.fields_dict['case_invoice'].grid.toggle_display('bank_name', row.payment_mode === "Bank Transfer", row.name);
        frm.fields_dict['case_invoice'].grid.toggle_display('cheque_number', row.payment_mode === "Bank Transfer", row.name);
    }
});

// ================= Case Stage Options =================
function set_case_stage_options(frm) {
    if (!frm.doc.case_type) return;

    let stages = [];
    switch (frm.doc.case_type) {
        case "Civil":
            stages = ["Admission/Notice","Pleadings/WS","Issues","Plaintiff Evidence","Defendant Evidence","Arguments","Judgment"];
            break;
        case "Criminal":
            stages = ["Cognizance","Supply of Documents","Charge Framing","Prosecution Evidence","313 Statement","Defence Evidence","Arguments","Judgment","Sentencing/Bail/Appeal"];
            break;
        case "Family":
            stages = ["Counseling/Mediation","Interim Applications (Maintenance/Child Custody)","Petitioner Evidence","Respondent Evidence","Arguments","Decree"];
            break;
        case "Labour":
            stages = ["Reference/Complaint Filed","Conciliation","Framing of Issues","Evidence","Arguments","Award"];
            break;
        case "Consumer Complaints":
            stages = ["Admission","Notice","Evidence Affidavits","Written Arguments","Order"];
            break;
        case "Company Law":
            stages = ["Admission","IRP Appointment","CoC Formation","Resolution Process","Plan Approval","Liquidation/Closure"];
            break;
        case "Tax matters":
            stages = ["Show-Cause","Personal Hearing(s)","Order","Appeal (CIT(A)/ITAT/HC)","Remand/Final Order"];
            break;
        case "Service Matters":
            stages = ["Admission","Counter","Rejoinder","Evidence (if any)","Final Hearing","Order"];
            break;
        case "Constitutional Issues":
            stages = ["Admission","Counter","Rejoinder","Final Arguments","Judgment"];
            break;
        case "Other":
            stages = ["Custom stages as per need"];
            break;
    }

    let grid_field = frm.fields_dict["case_proceedings"].grid.get_field("case_stage");
    grid_field.df.options = stages.join("\n");
    frm.fields_dict["case_proceedings"].refresh();
}

// ================= Case Invoice Calculation =================
frappe.ui.form.on("Case Invoice", {
    qty(frm, cdt, cdn) { calculate_amount(frm, cdt, cdn); },
    rate(frm, cdt, cdn) { calculate_amount(frm, cdt, cdn); },
    tax_percent(frm, cdt, cdn) { calculate_amount(frm, cdt, cdn); }
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

    // Update parent total_amount
    let total = 0;
    (frm.doc.case_invoice || []).forEach(r => {
        total += parseFloat(r.amount_with_tax || 0);
    });
    frm.set_value("total_amount", total);
}
