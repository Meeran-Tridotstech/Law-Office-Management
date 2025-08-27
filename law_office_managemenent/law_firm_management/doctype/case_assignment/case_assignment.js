frappe.ui.form.on("Case Assignment", {
    refresh(frm) {
        // Junior Advocate role
        if (frappe.user_roles.includes("Junior Advocate")) {
            if (frm.doc.senior_lawyer_status !== "Approved") {
                // Make fields read-only until approved
                frm.fields.forEach(f => frm.set_df_property(f.fieldname, "read_only", 1));
                frm.set_intro("⛔ You cannot edit until Senior Lawyer approves.");
            } else {
                frm.fields.forEach(f => frm.set_df_property(f.fieldname, "read_only", 0));
                frm.set_intro("");
            }
        }
    }
});
