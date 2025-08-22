// Copyright (c) 2025, Meeran and contributors
// For license information, please see license.txt

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
        }
    },

    mode_of_consultation: function (frm) {
        // hide all first
        frm.toggle_display("location__address", false);
        frm.toggle_display("meeting_link", false);
        frm.toggle_display("whatsapp_number", false);

        // show based on selection
        if (frm.doc.mode_of_consultation === "In-Person") {
            frm.toggle_display("location__address", true);
            frm.toggle_display("meeting_link", false);
            frm.toggle_display("whatsapp_number", false);


        }
        else if (frm.doc.mode_of_consultation === "Google Meet") {
            frm.toggle_display("meeting_link", true);
            frm.toggle_display("location__address", false);
            frm.toggle_display("whatsapp_number", false);

            let randomString = Math.random().toString(36).substring(2, 10);
            let meet_link = "https://meet.google.com/" + randomString;

            frm.set_value("meeting_link", meet_link);

        }
        else if (frm.doc.mode_of_consultation === "WhatsApp") {
            frm.toggle_display("whatsapp_number", true);
            frm.toggle_display("meeting_link", false);
            frm.toggle_display("location__address", false);
            
        }
    },

    refresh: function (frm) {
        // Show "Make Payment" button only if payment_id is not set
        if (!frm.doc.payment_id) {
            frm.add_custom_button('Make Payment', () => {
                let amount_in_paise = frm.doc.total_amount * 100 || 10000;
 
                let options = {
                    key: "rzp_test_1DP5mmOlF5G5ag",
                    amount: amount_in_paise,
                    currency: "INR",
                    name: frm.doc.passenger || "Demo User",
                    description: "Airplane Ticket Payment",
                    handler: function (response) {
                        // Store payment ID and update status
                        frm.set_value("payment_id", response.razorpay_payment_id);
                        frm.set_value("status", "Booked");
 
                        // Save the form and show message
                        frm.save().then(() => {
                            frappe.msgprint("Payment Successful. Ticket Booked!");
                            // Reload form to remove button
                            frm.reload_doc();
                        });
                    },
                    prefill: {
                        name: frm.doc.passenger || "Test User",
                        email: frm.doc.email || "test@example.com",
                        contact: frm.doc.mobile || "9999999999"
                    },
                    theme: {
                        color: "#3399cc"
                    },
                    modal: {
                        ondismiss: function () {
                            frappe.msgprint("You closed the Razorpay popup.");
                        }
                    }
                };
 
                let rzp = new Razorpay(options);
                rzp.open();
            });
        }
    }

    
});
