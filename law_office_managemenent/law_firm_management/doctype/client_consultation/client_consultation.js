
frappe.ui.form.on("Client Consultation", {
    case_type: function (frm) {
        if (frm.doc.case_type) {
            frm.set_query("advocate", function () {
                return {
                    filters: {
                        specialization: frm.doc.case_type,
                        status: "Active"
                    }
                };
            });
            frappe.msgprint("🎯 Advocate list filtered based on case type: <b>" + frm.doc.case_type + "</b>");
        }
    },

    mode_of_consultation: function (frm) {
        // hide all first
        frm.toggle_display("location__address", false);
        frm.toggle_display("meeting_link", false);
        frm.toggle_display("whatsapp_number", false);

        if (frm.doc.mode_of_consultation === "In-Person") {
            frm.toggle_display("location__address", true);
            frappe.msgprint("📍 Please provide the client's address for In-Person consultation.");
        }
        else if (frm.doc.mode_of_consultation === "Google Meet") {
            frm.toggle_display("meeting_link", true);

            let randomString = Math.random().toString(36).substring(2, 10);
            let meet_link = "https://meet.google.com/" + randomString;
            frm.set_value("meeting_link", meet_link);

            frappe.msgprint("💻 Google Meet link generated: <b>" + meet_link + "</b>");
        }
        else if (frm.doc.mode_of_consultation === "WhatsApp") {
            frm.toggle_display("whatsapp_number", true);
            frappe.msgprint("📲 Please enter client’s WhatsApp number.");
        }
    },

    refresh: function (frm) {
        // Show button only if payment_status is not Paid
        if (frm.doc.consultation_fee && frm.doc.payment_status !== "Paid") {
            frm.add_custom_button('💳 Pay Consultation Fee', () => {
                let amount_in_paise = frm.doc.consultation_fee * 100;

                let options = {
                    key: "rzp_test_R7xDdI0dwGlmRA", // replace with your Razorpay key
                    amount: amount_in_paise,
                    currency: "INR",
                    name: frm.doc.client_name || "Demo Client",
                    description: "Consultation Fee Payment",
                    handler: function (response) {
                        frappe.msgprint("⏳ Payment verification in progress...");
                        frappe.call({
                            method: "law_office_managemenent.api.mark_payment_success",
                            args: {
                                payment_id: response.razorpay_payment_id,
                                consultation_id: frm.doc.name
                            },
                            freeze: true,
                            freeze_message: "🔍 Verifying payment...",
                            callback: function (r) {
                                if (r.message && r.message.status === "success") {
                                    frappe.msgprint("✅ Payment Successful 🎉 Consultation Confirmed!");
                                    frm.reload_doc();
                                } else {
                                    frappe.msgprint("❌ Payment Failed: " + (r.message.message || "Unknown error"));
                                }
                            }
                        });
                    },
                    prefill: {
                        name: frm.doc.client_name || "Test Client",
                        email: frm.doc.email || "test@example.com",
                        contact: frm.doc.mobile || "9999999999"
                    },
                    theme: { color: "#3399cc" },
                    modal: {
                        ondismiss: function () {
                            frappe.msgprint("⚠️ You closed the Razorpay popup without completing payment.");
                        }
                    }
                };

                let rzp = new Razorpay(options);
                rzp.open();
            });
        }

        // Show only on saved docs & Paid status & no refund yet
        // if (
        //     !frm.is_new() &&
        //     frm.doc.payment_status === "Paid" &&
        //     (["Not Requested", null, undefined, ""].includes(frm.doc.refund_status))
        // ) {
        //     frm.add_custom_button('❌ Cancel Consultation', () => {
        //         frappe.confirm(
        //             __('⚠️ Are you sure you want to cancel this consultation?'),
        //             () => {
        //                 frappe.call({
        //                     method: "law_office_managemenent.api.cancel_consultation_and_refund",
        //                     args: { docname: frm.doc.name },
        //                     freeze: true,
        //                     freeze_message: __("💸 Processing refund..."),
        //                     callback: function (r) {
        //                         if (r && r.message) {
        //                             const msg = r.message.message || __("Cancelled");
        //                             frappe.msgprint("🔄 " + msg);
        //                             frm.reload_doc();
        //                         }
        //                     }
        //                 });
        //             },
        //             () => { frappe.msgprint("❎ Cancellation aborted."); }
        //         );
        //     }).addClass("btn-danger");
        // }
    }
});