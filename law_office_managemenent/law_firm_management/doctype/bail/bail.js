// // Copyright (c) 2025, Meeran and contributors
// // For license information, please see license.txt

// // Copyright (c) 2025, Meeran and contributors
// // For license information, please see license.txt

// frappe.ui.form.on("Bail", {
//     refresh(frm) {
//         filter_cases_based_on_client(frm);
//     },

//     client(frm) {
//         filter_cases_based_on_client(frm);
//     },

//     next_hearing_date(frm) {
//         // Bulk update all child rows when next_hearing_date changes
//         if (frm.doc.table_pspm && frm.doc.next_hearing_date) {
//             frm.doc.table_pspm.forEach(row => {
//                 row.proceeding_date = frm.doc.next_hearing_date;
//             });
//             frm.refresh_field('table_pspm');
//         }
//     }
// });

// function filter_cases_based_on_client(frm) {
//     if (frm.doc.client) {
//         frm.set_query("case", function () {
//             return {
//                 filters: {
//                     client: frm.doc.client
//                 }
//             };
//         });
//     }
// }

// frappe.ui.form.on("table_pspm", {
//     table_pspm_add(frm, cdt, cdn) {
//         let row = locals[cdt][cdn];
//         if (frm.doc.next_hearing_date) {
//             row.proceeding_date = frm.doc.next_hearing_date;
//             frm.refresh_field('table_pspm');
//         }
//     },

//     proceeding_date(frm, cdt, cdn) {
//         let row = locals[cdt][cdn];
//         if (!row.proceeding_date && frm.doc.next_hearing_date) {
//             row.proceeding_date = frm.doc.next_hearing_date;
//             frm.refresh_field('table_pspm');
//         }
//     }
// });


frappe.ui.form.on("Bail", {
    refresh(frm) {
        filter_cases_based_on_client(frm);
    },

    client(frm) {
        filter_cases_based_on_client(frm);
    },

    next_hearing_date(frm) {
        // Auto-update all proceeding_date fields in table_pspm
        if (frm.doc.table_pspm && frm.doc.next_hearing_date) {
            frm.doc.table_pspm.forEach(row => {
                row.proceeding_date = frm.doc.next_hearing_date;
            });
            frm.refresh_field("table_pspm"); // Refresh table to reflect changes
        }
    }
});

function filter_cases_based_on_client(frm) {
    if (frm.doc.client) {
        frm.set_query("case", () => ({
            filters: {
                client: frm.doc.client
            }
        }));
    }
}

frappe.ui.form.on("table_pspm", {
    table_pspm_add(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        if (frm.doc.next_hearing_date) {
            row.proceeding_date = frm.doc.next_hearing_date;
            frm.refresh_field("table_pspm");
        }
    },

    proceeding_date(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        if (!row.proceeding_date && frm.doc.next_hearing_date) {
            row.proceeding_date = frm.doc.next_hearing_date;
            frm.refresh_field("table_pspm");
        }
    }
    
});