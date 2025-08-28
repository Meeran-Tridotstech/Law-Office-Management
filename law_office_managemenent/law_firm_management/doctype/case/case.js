// // Copyright (c) 2025, Meeran and contributors
// // For license information, please see license.txt

// frappe.ui.form.on("Case", {
//     refresh(frm) {
//         if (!frm.is_new()) {
//             frm.add_custom_button("Go to Case Assignment", function () {
//                 frappe.call({
//                     method: "law_office_managemenent.law_firm_management.doctype.case.case.create_case_assignment",
//                     args: {
//                         case_id: frm.doc.name,
//                         case_title: frm.doc.case_title
//                     },
//                     callback: function (r) {
//                         if (r.message) {
//                             frappe.set_route("Form", "Case Assignment", r.message);
//                         }
//                     }
//                 });
//             }, __("Create"));
//         }
//     },
//     case_type: function (frm) {
//         const courtOptions = {
//             "Civil": ["District Munsif Court", "Subordinate Court"],
//             "Criminal": ["Judicial Magistrate Court", "Sessions Court"],
//             "Family": ["Family Court"],
//             "Labour": ["Labour Court", "Industrial Tribunal"],
//             "Consumer Complaints": ["Consumer Disputes Redressal Commission"],
//             "Company Law": ["National Company Law Tribunal (NCLT)"],
//             "Tax matters": ["Income Tax Appellate Tribunal (ITAT)"],
//             "Service Matters": ["Central Administrative Tribunal (CAT)"],
//             "Constitutional Issues": ["High Court"],
//             "Other": ["High Court", "Supreme Court"]
//         };

//         const selected = frm.doc.case_type;
//         if (courtOptions[selected]) {
//             frm.set_df_property('typical_court', 'options', courtOptions[selected].join('\n'));
//             frm.set_value('typical_court', courtOptions[selected][0]); // default first option
//         } else {
//             frm.set_df_property('typical_court', 'options', '');
//             frm.set_value('typical_court', '');
//         }
//         let series_map = {
//             'Civil': 'CIV-.YY.-',
//             'Criminal': 'CRIM-.YY.-',
//             'Family': 'FAM-.YY.-',
//             'Labour': 'LAB-.YY.-',
//             'Consumer Complaints': 'CC-.YY.-',
//             'Company Law': 'COMP-.YY.-',
//             'Tax Matters': 'TAX-.YY.-',
//             'Service Matters': 'SERV-.YY.-',
//             'Constitutional Issues': 'CONST-.YY.-',
//             'Other': 'OTH-.YY.-'
//         };
//         if (series_map[frm.doc.case_type]) {
//             frm.set_value('naming_series', series_map[frm.doc.case_type]);
//         }


//         let court_map = {
//             'Civil': {
//                 court_name: 'City Civil Court, Chennai',
//                 court_address: 'High Court Campus, Parrys, Chennai - 600104',
//                 court_location: 'George Town'
//             },
//             'Criminal': {
//                 court_name: 'Sessions Court, Chennai',
//                 court_address: 'Singaravelar Maligai, Rajaji Salai, George Town, Chennai - 600001',
//                 court_location: 'George Town'
//             },
//             'Family': {
//                 court_name: 'Family Court - Chennai',
//                 court_address: 'Allikulam Complex, Park Town, Chennai - 600003',
//                 court_location: 'Park Town'
//             },
//             'Labour': {
//                 court_name: 'Labour Court - Chennai I',
//                 court_address: 'City Civil Court Campus, Rajaji Salai, Chennai - 600104',
//                 court_location: 'George Town'
//             },
//             'Consumer Complaints': {
//                 court_name: 'District Consumer Commission - Chennai (South)',
//                 court_address: 'Slum Clearance Board Building, R.K. Mutt Road, Mylapore, Chennai - 600004',
//                 court_location: 'Mylapore'
//             },
//             'Company Law': {
//                 court_name: 'NCLT - Chennai Bench',
//                 court_address: 'Corporate Bhavan, No.29, Rajaji Salai, Behind RBI, Chennai - 600001',
//                 court_location: 'George Town'
//             },
//             'Tax matters': {
//                 court_name: 'ITAT - Chennai Bench',
//                 court_address: 'Aayakar Bhavan Annexe, MG Road, Nungambakkam, Chennai - 600034',
//                 court_location: 'Nungambakkam'
//             },
//             'Service Matters': {
//                 court_name: 'CAT - Chennai Bench',
//                 court_address: 'City Civil Court Buildings, Rajaji Salai, Chennai - 600104',
//                 court_location: 'George Town'
//             },
//             'Constitutional Issues': {
//                 court_name: 'Madras High Court - Constitutional Bench',
//                 court_address: 'High Court Campus, Parrys, Chennai - 600104',
//                 court_location: 'George Town'
//             },

//         };

//         if (court_map[frm.doc.case_type]) {
//             frm.set_value('court_name', court_map[frm.doc.case_type].court_name);
//             frm.set_value('court_address', court_map[frm.doc.case_type].court_address);
//             frm.set_value('court_location', court_map[frm.doc.case_type].court_location);
//         }

//         if (frm.doc.case_type) {
//             frm.set_query("advocate", function () {
//                 return {
//                     filters: {
//                         specialization: frm.doc.case_type,
//                         status: "Active"
//                     }
//                 };
//             });
//         }
//     }

// });





// Copyright (c) 2025, Meeran and contributors
// For license information, please see license.txt

frappe.ui.form.on("Case", {
    refresh(frm) {
        if (!frm.is_new()) {
            frm.add_custom_button("Go to Case Assignment", function () {
                frappe.call({
                    method: "law_office_managemenent.law_firm_management.doctype.case.case.create_case_assignment",
                    args: {
                        case_id: frm.doc.name,
                        case_title: frm.doc.case_title
                    },
                    callback: function (r) {
                        if (r.message) {
                            frappe.msgprint(`📂 Opening Case Assignment: <b>${r.message}</b>`);
                            frappe.set_route("Form", "Case Assignment", r.message);
                        } else {
                            frappe.msgprint("⚠️ Case Assignment not found / created.");
                        }
                    }
                });
            }, __("Create"));
        }
    },

    case_type: function (frm) {
        frappe.msgprint(`⚖️ Case Type selected: <b>${frm.doc.case_type || "None"}</b>`);

        const courtOptions = {
            "Civil": ["District Munsif Court", "Subordinate Court"],
            "Criminal": ["Judicial Magistrate Court", "Sessions Court"],
            "Family": ["Family Court"],
            "Labour": ["Labour Court", "Industrial Tribunal"],
            "Consumer Complaints": ["Consumer Disputes Redressal Commission"],
            "Company Law": ["National Company Law Tribunal (NCLT)"],
            "Tax matters": ["Income Tax Appellate Tribunal (ITAT)"],
            "Service Matters": ["Central Administrative Tribunal (CAT)"],
            "Constitutional Issues": ["High Court"],
            "Other": ["High Court", "Supreme Court"]
        };

        const selected = frm.doc.case_type;
        if (courtOptions[selected]) {
            frm.set_df_property('typical_court', 'options', courtOptions[selected].join('\n'));
            frm.set_value('typical_court', courtOptions[selected][0]); 
            frappe.msgprint(`🏛️ Default Court set to: <b>${courtOptions[selected][0]}</b>`);
        } else {
            frm.set_df_property('typical_court', 'options', '');
            frm.set_value('typical_court', '');
        }

        let series_map = {
            'Civil': 'CIV-.YY.-',
            'Criminal': 'CRIM-.YY.-',
            'Family': 'FAM-.YY.-',
            'Labour': 'LAB-.YY.-',
            'Consumer Complaints': 'CC-.YY.-',
            'Company Law': 'COMP-.YY.-',
            'Tax Matters': 'TAX-.YY.-',
            'Service Matters': 'SERV-.YY.-',
            'Constitutional Issues': 'CONST-.YY.-',
            'Other': 'OTH-.YY.-'
        };
        if (series_map[frm.doc.case_type]) {
            frm.set_value('naming_series', series_map[frm.doc.case_type]);
            frappe.msgprint(`🆔 Naming Series applied: <b>${series_map[frm.doc.case_type]}</b>`);
        }

        let court_map = {
            'Civil': {
                court_name: 'City Civil Court, Chennai',
                court_address: 'High Court Campus, Parrys, Chennai - 600104',
                court_location: 'George Town'
            },
            'Criminal': {
                court_name: 'Sessions Court, Chennai',
                court_address: 'Singaravelar Maligai, Rajaji Salai, George Town, Chennai - 600001',
                court_location: 'George Town'
            },
            'Family': {
                court_name: 'Family Court - Chennai',
                court_address: 'Allikulam Complex, Park Town, Chennai - 600003',
                court_location: 'Park Town'
            },
            'Labour': {
                court_name: 'Labour Court - Chennai I',
                court_address: 'City Civil Court Campus, Rajaji Salai, Chennai - 600104',
                court_location: 'George Town'
            },
            'Consumer Complaints': {
                court_name: 'District Consumer Commission - Chennai (South)',
                court_address: 'Slum Clearance Board Building, R.K. Mutt Road, Mylapore, Chennai - 600004',
                court_location: 'Mylapore'
            },
            'Company Law': {
                court_name: 'NCLT - Chennai Bench',
                court_address: 'Corporate Bhavan, No.29, Rajaji Salai, Behind RBI, Chennai - 600001',
                court_location: 'George Town'
            },
            'Tax matters': {
                court_name: 'ITAT - Chennai Bench',
                court_address: 'Aayakar Bhavan Annexe, MG Road, Nungambakkam, Chennai - 600034',
                court_location: 'Nungambakkam'
            },
            'Service Matters': {
                court_name: 'CAT - Chennai Bench',
                court_address: 'City Civil Court Buildings, Rajaji Salai, Chennai - 600104',
                court_location: 'George Town'
            },
            'Constitutional Issues': {
                court_name: 'Madras High Court - Constitutional Bench',
                court_address: 'High Court Campus, Parrys, Chennai - 600104',
                court_location: 'George Town'
            },
        };

        if (court_map[frm.doc.case_type]) {
            frm.set_value('court_name', court_map[frm.doc.case_type].court_name);
            frm.set_value('court_address', court_map[frm.doc.case_type].court_address);
            frm.set_value('court_location', court_map[frm.doc.case_type].court_location);
            frappe.msgprint(`📌 Court Auto-filled: <b>${court_map[frm.doc.case_type].court_name}</b>`);
        }

        if (frm.doc.case_type) {
            frm.set_query("advocate", function () {
                return {
                    filters: {
                        specialization: frm.doc.case_type,
                        status: "Active"
                    }
                };
            });
            frappe.msgprint("👨‍⚖️ Advocate filter applied for specialization.");
        }
    }
});
