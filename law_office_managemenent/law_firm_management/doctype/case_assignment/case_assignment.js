frappe.ui.form.on("Case Assignment", {
    refresh(frm) {
        // Check if user is Junior Advocate
        if (frappe.user_roles.includes("Senior Advocate")) {

            // Restrict editing if NOT approved
            if (frm.doc.senior_lawyer_status !== "Approved") {
                frm.set_intro("⛔ You cannot edit until Senior Lawyer approves.");

                // Make all fields read-only
                frm.fields_dict && Object.values(frm.fields_dict).forEach(f => {
                    if (f.df && f.df.fieldname && !["Section Break", "Column Break", "HTML", "Table"].includes(f.df.fieldtype)) {
                        frm.set_df_property(f.df.fieldname, "read_only", 1);
                    }
                });

                // Disable Save button also
                frm.disable_save();

            } else {
                // ✅ Approved, allow editing again
                frm.set_intro("✅ Approved by Senior Lawyer. You can now edit.");

                Object.values(frm.fields_dict).forEach(f => {
                    if (f.df && f.df.fieldname && !["Section Break", "Column Break", "HTML", "Table"].includes(f.df.fieldtype)) {
                        frm.set_df_property(f.df.fieldname, "read_only", 0);
                    }
                });

                frm.enable_save();
            }
        }
    }
});

