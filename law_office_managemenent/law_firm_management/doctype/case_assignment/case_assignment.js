
frappe.ui.form.on("Case Assignment", {
    refresh(frm) {
        // Check if the user has the Junior Advocate role
        const is_junior = frappe.user_roles.includes("Junior Advocate");

        if (is_junior) {
            if (frm.doc.senior_lawyer_status !== "Approved") {
                // Show message
                frm.set_intro("⛔ You cannot edit until Senior Lawyer approves.");

                // Make all fields read-only
                Object.values(frm.fields_dict).forEach(f => {
                    if (f.df && f.df.fieldname && !["Section Break", "Column Break", "HTML", "Table"].includes(f.df.fieldtype)) {
                        frm.set_df_property(f.df.fieldname, "read_only", 1);
                    }
                });

                // Disable Save button
                frm.disable_save();
            } else {
                // Approved – allow editing
                frm.set_intro("✅ Approved by Senior Lawyer. You can now edit.");

                Object.values(frm.fields_dict).forEach(f => {
                    if (f.df && f.df.fieldname && !["Section Break", "Column Break", "HTML", "Table"].includes(f.df.fieldtype)) {
                        frm.set_df_property(f.df.fieldname, "read_only", 0);
                    }
                });

                frm.enable_save();
            }
        } else {
            // Non-Junior users: make form completely read-only
            frm.set_intro("⛔ Only Junior Advocates can edit this form.");
            Object.values(frm.fields_dict).forEach(f => {
                if (f.df && f.df.fieldname && !["Section Break", "Column Break", "HTML", "Table"].includes(f.df.fieldtype)) {
                    frm.set_df_property(f.df.fieldname, "read_only", 1);
                }
            });
            frm.disable_save();
        }
    }
});