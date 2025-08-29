// frappe.ui.form.on("Case Assignment", {
//     refresh(frm) {
//         // Junior Advocate role
//         if (frappe.user_roles.includes("Junior Advocate")) {
//             if (frm.doc.senior_lawyer_status !== "Approved") {
//                 // Make fields read-only until approved
//                 frm.fields.forEach(f => frm.set_df_property(f.fieldname, "read_only", 1));
//                 frm.set_intro("⛔ You cannot edit until Senior Lawyer approves.");
//             } else {
//                 frm.fields.forEach(f => frm.set_df_property(f.fieldname, "read_only", 0));
//                 frm.set_intro("");
//             }
//         }
//     }
// });


// frappe.ui.form.on("Case Assignment", {
//     refresh(frm) {
//         // Junior Advocate role
//         if (frappe.user_roles.includes("Junior Advocate")) {
//             if (frm.doc.senior_lawyer_status !== "Approved") {
//                 // Make fields read-only until approved
//                 frm.fields.forEach(f => frm.set_df_property(f.fieldname, "read_only", 1));
//                 frm.set_intro("⛔ You cannot edit until Senior Lawyer approves.");
                
//                 frappe.msgprint("🔒 Junior Advocate access restricted! <br>⛔ Wait for Senior Lawyer approval.");
//             } else {
//                 frm.fields.forEach(f => frm.set_df_property(f.fieldname, "read_only", 0));
//                 frm.set_intro("✅ Approved by Senior Lawyer. You can now edit.");
                
//                 frappe.msgprint("🎉 Access Granted! <br>✅ You may now edit this Case Assignment.");
//             }
//         }
//     }
// });




frappe.ui.form.on("Case Assignment", {
    refresh(frm) {
        if (frappe.user_roles.includes("Junior Advocate")) {
            if (frm.doc.senior_lawyer_status !== "Approved") {
                // Make fields read-only until approved
                Object.values(frm.fields_dict).forEach(f => {
                    if (f.df && f.df.fieldname && !["Section Break", "Column Break", "HTML", "Table"].includes(f.df.fieldtype)) {
                        frm.set_df_property(f.df.fieldname, "read_only", 1);
                    }
                });
                frm.set_intro("⛔ You cannot edit until Senior Lawyer approves.");
                frappe.msgprint("🔒 Junior Advocate access restricted! <br>⛔ Wait for Senior Lawyer approval.");
            } else {
                // Allow editing again
                Object.values(frm.fields_dict).forEach(f => {
                    if (f.df && f.df.fieldname && !["Section Break", "Column Break", "HTML", "Table"].includes(f.df.fieldtype)) {
                        frm.set_df_property(f.df.fieldname, "read_only", 0);
                    }
                });
                frm.set_intro("✅ Approved by Senior Lawyer. You can now edit.");
                frappe.msgprint("🎉 Access Granted! <br>✅ You may now edit this Case Assignment.");
            }
        }
    }
});
