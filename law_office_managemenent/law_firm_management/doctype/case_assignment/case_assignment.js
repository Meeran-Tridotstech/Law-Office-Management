frappe.ui.form.on("Case Assignment", {
    refresh(frm) {
        const is_junior = frappe.user_roles.includes("Junior Advocate");
        if (is_junior) {
            if (frm.doc.senior_lawyer_status !== "Approved") {
                frm.set_intro("You cannot edit until Senior Lawyer approves.");
                Object.values(frm.fields_dict).forEach(f => {
                    if (f.df && f.df.fieldname && !["Section Break", "Column Break", "HTML", "Table"].includes(f.df.fieldtype)) {
                        frm.set_df_property(f.df.fieldname, "read_only", 1);
                    }
                });
                frm.disable_save();
            } else {
                frm.set_intro("Approved by Senior Lawyer. You can now edit.");
                Object.values(frm.fields_dict).forEach(f => {
                    if (f.df && f.df.fieldname && !["Section Break", "Column Break", "HTML", "Table"].includes(f.df.fieldtype)) {
                        frm.set_df_property(f.df.fieldname, "read_only", 0);
                    }
                });
                frm.enable_save();
            }
        } else {
            frm.set_intro("Only Junior Advocates can edit this form.");
            Object.values(frm.fields_dict).forEach(f => {
                if (f.df && f.df.fieldname && !["Section Break", "Column Break", "HTML", "Table"].includes(f.df.fieldtype)) {
                    frm.set_df_property(f.df.fieldname, "read_only", 1);
                }
            });
            frm.disable_save();
        }
    }
});