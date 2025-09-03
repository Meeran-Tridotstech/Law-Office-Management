frappe.ui.form.on("Case Details", {
    refresh: function(frm) {

        frm.add_custom_button("Send Invoice Email", function () {
            frappe.call({
                method: "law_office_managemenent.law_firm_management.doctype.case_details.case_details.send_case_invoice_email",
                args: { docname: frm.doc.name },
                callback: function(r) {
                    if(!r.exc) frappe.msgprint(r.message);
                }
            });
        }, "Email");


        if (!frm.custom_buttons_added) {
            frm.add_custom_button("🎤 Voice Record", function() {
                startRecording(frm);
            });
            frm.custom_buttons_added = true;
        }

        toggle_payment_fields(frm);
        add_pay_now_button(frm);
        apply_junior_advocate_restrictions(frm);
        set_case_stage_options(frm);

        // Send Invoice Email button
        
    },

    case_type(frm) {
        set_case_stage_options(frm);
    },

    payment_mode(frm) {
        toggle_payment_fields(frm);
        add_pay_now_button(frm);
    },

    senior_lawyer_status(frm) {
        apply_junior_advocate_restrictions(frm);
    },
    bail_amount: function(frm) {
    frappe.db.get_doc('Bail', frm.doc.bail_amount)
      .then(doc => {
        frm.set_value('bail_amount', doc.bail_amount);
      });
  }

});

// ================= Helper Functions =================
function apply_junior_advocate_restrictions(frm) {
    if (!frappe.user_roles.includes("Junior Advocate")) return;

    const read_only = frm.doc.senior_lawyer_status !== "Approved";

    // Lock/unlock form fields
    Object.values(frm.fields_dict).forEach(f => {
        if (["Data", "Link", "Select", "Date", "Datetime", "Int", "Float", "Currency", "Small Text", "Long Text", "Check"].includes(f.df.fieldtype)) {
            frm.set_df_property(f.df.fieldname, "read_only", read_only ? 1 : 0);
        }
    });

    // Lock/unlock child tables
    if (frm.fields_dict["case_proceedings"]) frm.fields_dict["case_proceedings"].grid.toggle_enable(!read_only);
    if (frm.fields_dict["case_invoice"]) frm.fields_dict["case_invoice"].grid.toggle_enable(!read_only);

    frm.set_intro(read_only ? "⛔ You cannot edit until Senior Lawyer approves." : "");
}

// ================= Case Stage Options =================
function set_case_stage_options(frm) {
    if (!frm.doc.case_type || !frm.fields_dict["case_proceedings"]?.grid) return;

    let stages = [];
    switch(frm.doc.case_type) {
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

    const grid_field = frm.fields_dict["case_proceedings"].grid.get_field("case_stage");
    if (grid_field) {
        grid_field.df.options = stages.join("\n");
        frm.fields_dict["case_proceedings"].grid.refresh();
    }
}

// ================= Payment Fields =================
function toggle_payment_fields(frm, cdt, cdn) {
    if (cdt && cdn) {
        let row = locals[cdt][cdn];

        // Only reset if no payment ID exists
        if (!row.razorpay_payment_id) {
            frappe.model.set_value(cdt, cdn, "upi_id", null);
            frappe.model.set_value(cdt, cdn, "card_number", null);
            frappe.model.set_value(cdt, cdn, "card_type", null);
            frappe.model.set_value(cdt, cdn, "bank_name", null);
        }

        if (row.payment_mode === "UPI") frappe.model.set_value(cdt, cdn, "upi_id_hidden", 0);
        else if (row.payment_mode === "Card") {
            frappe.model.set_value(cdt, cdn, "card_number_hidden", 0);
            frappe.model.set_value(cdt, cdn, "card_type_hidden", 0);
        }
        else if (row.payment_mode === "Bank Transfer") frappe.model.set_value(cdt, cdn, "bank_name_hidden", 0);
    } else {
        ["upi_id","card_number","card_type","bank_name"].forEach(f => frm.set_df_property(f, "hidden", 1));

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
    frm.page.remove_inner_button('Pay Now');

    if (["UPI", "Card", "Bank Transfer"].includes(frm.doc.payment_mode) && frm.doc.total_amount > 0) {
        frm.add_custom_button('Pay Now', () => {
            const options = {
                key: "rzp_test_R7xDdI0dwGlmRA",
                amount: frm.doc.total_amount * 100,
                currency: "INR",
                name: "Law Firm Management",
                description: "Case Payment",
                handler: function (response) {
                    frappe.call({
                        method: "law_office_managemenent.law_firm_management.doctype.case_details.case_details.mark_payment_success",
                        args: { 
                            docname: frm.doc.name, 
                            razorpay_payment_id: response.razorpay_payment_id 
                        },
                        callback: function (r) {
                            if (r.message?.status === "success") {
                                frappe.msgprint("Payment Successful!");
                                frm.reload_doc();
                            }
                        }
                    });
                },
                prefill: { name: frappe.session.user_fullname, email: frappe.session.user },
                theme: { color: "#528FF0" }
            };
            new Razorpay(options).open();
        });
    }
}

// ================= Case Invoice Calculation =================
// frappe.ui.form.on("Case Invoice", {
//     qty(frm, cdt, cdn) { calculate_amount(frm, cdt, cdn); },
//     rate(frm, cdt, cdn) { calculate_amount(frm, cdt, cdn); },
//     tax_percent(frm, cdt, cdn) { calculate_amount(frm, cdt, cdn); },
//     payment_mode(frm, cdt, cdn) { toggle_payment_fields(frm, cdt, cdn); }
// });

// function calculate_amount(frm, cdt, cdn) {
//     let row = locals[cdt][cdn];
//     if (!row.qty || !row.rate) return;

//     const qty = parseFloat(row.qty);
//     const rate = parseFloat(row.rate);
//     const tax = parseFloat(row.tax_percent || 0);

//     row.amount = qty * rate;
//     row.amount_with_tax = row.amount + (row.amount * tax / 100);

//     frappe.model.set_value(cdt, cdn, "amount", row.amount);
//     frappe.model.set_value(cdt, cdn, "amount_with_tax", row.amount_with_tax);

//     const total = (frm.doc.case_invoice || []).reduce((acc, r) => acc + parseFloat(r.amount_with_tax || 0), 0);
//     if (frm.doc.workflow_state !== "Closed") frm.set_value("total_amount", total);

//     // Update Pay Now button after total change
//     add_pay_now_button(frm);
// }


function calculate_amount(frm, cdt, cdn) {
    let row = locals[cdt][cdn];
    if (!row.qty || !row.rate) return;

    const qty = parseFloat(row.qty);
    const rate = parseFloat(row.rate);
    const tax = parseFloat(row.tax_percent || 0);

    row.amount = qty * rate;
    row.amount_with_tax = row.amount + (row.amount * tax / 100);

    frappe.model.set_value(cdt, cdn, "amount", row.amount);
    frappe.model.set_value(cdt, cdn, "amount_with_tax", row.amount_with_tax);

    // Sum of all amount_with_tax from child table
    const invoice_total = (frm.doc.case_invoice || []).reduce((acc, r) => {
        return acc + parseFloat(r.amount_with_tax || 0);
    }, 0);

    // Add bail_amount from parent DocType
    const bail_amount = parseFloat(frm.doc.bail_amount || 0);
    const grand_total = invoice_total + bail_amount;

    if (frm.doc.workflow_state !== "Closed") {
        frm.set_value("total_amount", grand_total);
    }

    // Update Pay Now button after total change
    add_pay_now_button(frm);
}

// ================= Bail Creation =================
// function create_bail_record(frm) {
//     frappe.model.get_new_doc('Bail', null, null, function (bail_doc) {
//         bail_doc.case_id = frm.doc.name;
//         bail_doc.client = frm.doc.client;
//         bail_doc.case_type = frm.doc.case_type;
//         bail_doc.advocate = frm.doc.advocate;

//         frappe.set_route('Form', 'Bail', bail_doc.name);
//     });
// }



// ===== Voice Recording for Notes Field =====
let mediaRecorder;
let audioChunks = [];

function startRecording(frm) {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            // ✅ Ensure correct format (Opus codec)
            mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
            mediaRecorder.start();
            frappe.msgprint("🎙️ Recording started... speak now!");

            audioChunks = []; // reset
            mediaRecorder.ondataavailable = e => {
                audioChunks.push(e.data);
            };

            mediaRecorder.onstop = () => {
                let audioBlob = new Blob(audioChunks, { type: 'audio/webm' });

                // Convert audio to Base64
                let reader = new FileReader();
                reader.readAsDataURL(audioBlob);
                reader.onloadend = function() {
                    frappe.call({
                        method: "law_office_managemenent.api.speech_to_text",
                        args: { audio_base64: reader.result },
                        callback: function(r) {
                            if (r.message) {
                                frm.set_value("notes", r.message);
                                frm.save();
                                frappe.msgprint("✅ Voice note saved in Notes field!");
                            } else {
                                frappe.msgprint("❌ No transcription received!");
                            }
                        }
                    });
                };
            };

            // Auto stop after 5 seconds
            setTimeout(() => {
                mediaRecorder.stop();
            }, 2000);
        });
    } else {
        frappe.msgprint("❌ Browser does not support audio recording!");
    }
}