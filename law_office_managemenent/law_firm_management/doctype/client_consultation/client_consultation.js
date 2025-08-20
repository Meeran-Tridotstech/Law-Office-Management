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

    refresh: function(frm) {
        if (frm.doc.meeting_link) {
            frm.add_custom_button("Join Meeting", function() {
                window.open(frm.doc.meeting_link, "_blank");
            }, "Actions");
        }
    },


    // refresh: function(frm) {
    //     frm.add_custom_button("Generate Google Meet", function() {
    //         window.open(
    //             "https://accounts.google.com/o/oauth2/v2/auth?" +
    //             "client_id=" + frappe.boot.google_client_id +
    //             "&redirect_uri=http://localhost:8004/api/method/law_office_management.api.auth.google_callback" +
    //             "&response_type=code&scope=https://www.googleapis.com/auth/calendar.events"
    //         );
    //     });
    // }

    
});
