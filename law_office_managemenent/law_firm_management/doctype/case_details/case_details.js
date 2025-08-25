frappe.ui.form.on("Case Details", {
    refresh(frm) {
        set_case_stage_options(frm);
    },
    case_type(frm) {
        set_case_stage_options(frm);
    },

});

function set_case_stage_options(frm) {
    if (!frm.doc.case_type) return;

    let stages = [];

    switch (frm.doc.case_type) {
        case "Civil":
            stages = [
                "Admission/Notice",
                "Pleadings/WS",
                "Issues",
                "Plaintiff Evidence",
                "Defendant Evidence",
                "Arguments",
                "Judgment"
            ];
            break;

        case "Criminal":
            stages = [
                "Cognizance",
                "Supply of Documents",
                "Charge Framing",
                "Prosecution Evidence",
                "313 Statement",
                "Defence Evidence",
                "Arguments",
                "Judgment",
                "Sentencing/Bail/Appeal"
            ];
            break;

        case "Family":
            stages = [
                "Counseling/Mediation",
                "Interim Applications (Maintenance/Child Custody)",
                "Petitioner Evidence",
                "Respondent Evidence",
                "Arguments",
                "Decree"
            ];
            break;

        case "Labour":
            stages = [
                "Reference/Complaint Filed",
                "Conciliation",
                "Framing of Issues",
                "Evidence",
                "Arguments",
                "Award"
            ];
            break;

        case "Consumer Complaints":
            stages = [
                "Admission",
                "Notice",
                "Evidence Affidavits",
                "Written Arguments",
                "Order"
            ];
            break;

        case "Company Law":
            stages = [
                "Admission",
                "IRP Appointment",
                "CoC Formation",
                "Resolution Process",
                "Plan Approval",
                "Liquidation/Closure"
            ];
            break;

        case "Tax matters":
            stages = [
                "Show-Cause",
                "Personal Hearing(s)",
                "Order",
                "Appeal (CIT(A)/ITAT/HC)",
                "Remand/Final Order"
            ];
            break;

        case "Service Matters":
            stages = [
                "Admission",
                "Counter",
                "Rejoinder",
                "Evidence (if any)",
                "Final Hearing",
                "Order"
            ];
            break;

        case "Constitutional Issues":
            stages = [
                "Admission",
                "Counter",
                "Rejoinder",
                "Final Arguments",
                "Judgment"
            ];
            break;

        case "Other":
            stages = ["Custom stages as per need"];
            break;
    }

    // Apply dynamic options to Case Proceedings child table → case_stage field
    let grid_field = frm.fields_dict["case_proceedings"].grid.get_field("case_stage");
    grid_field.df.options = stages.join("\n");
    frm.fields_dict["case_proceedings"].refresh();



}

