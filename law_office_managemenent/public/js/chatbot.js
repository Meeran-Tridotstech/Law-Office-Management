frappe.ready(function () {
    console.log("✅ Chatbot Loaded in Desk");

    // Open button
    let button = $('<button class="btn btn-primary">Chat 💬</button>')
        .css({
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            'z-index': 1000
        })
        .appendTo('body');

    // Chat window
    let chatWindow = $('<div id="chat-window"></div>')
        .css({
            display: 'none',
            position: 'fixed',
            bottom: '70px',
            right: '20px',
            width: '340px',
            height: '450px',
            background: 'white',
            border: '1px solid #ddd',
            'border-radius': '10px',
            'z-index': 1000,
            padding: '10px',
            overflow: 'auto'
        })
        .appendTo('body');

    // Input box
    let inputBox = $(`
        <div style="position:absolute; bottom:10px; left:10px; right:10px;">
            <input type="text" id="chat-input" class="form-control" placeholder="Type here..."/>
        </div>
    `).appendTo(chatWindow);

    // Toggle
    button.on('click', function () {
        chatWindow.toggle();
    });

    // Conversation Questions
    let questions = [
        "👤 Client Name?",
        "📂 Case Type?",
        "⚖️ Advocate Name?",
        "💰 Consultation Fee?",
        "💻 Mode of Consultation (Online/Offline)?",
        "📍 Location Address?",
        "📱 WhatsApp Number?",
        "🔗 Meeting Link?",
        "📅 Preferred Date 1?",
        "📅 Preferred Date 2?",
        "📌 Status?",
        "💳 Payment Status?",
        "🧾 Payment ID?",
        "✅ Confirmed Date?",
        "📝 Case Summary?"
    ];

    let fieldKeys = [
        "client_name",
        "case_type",
        "advocate",
        "consultation_fee",
        "mode_of_consultation",
        "location_address",
        "whatsapp_number",
        "meeting_link",
        "preferred_date_1",
        "preferred_date_2",
        "status",
        "payment_status",
        "payment_id",
        "confirmed_date",
        "case_summary"
    ];

    let answers = {};
    let currentQuestion = 0;

    function askQuestion() {
        if (currentQuestion < questions.length) {
            $("#chat-window").append(`<div><b>Bot:</b> ${questions[currentQuestion]}</div>`);
        } else {
            // Submit to server
            frappe.call({
                method: "law_office_managemenent.api.create_consultation",
                args: answers,
                callback: function (r) {
                    if (r.message) {
                        $("#chat-window").append(`<div><b>Bot:</b> ✅ Record Created: ${r.message}</div>`);
                    } else {
                        $("#chat-window").append(`<div><b>Bot:</b> ❌ Failed to save record</div>`);
                    }
                }
            });
        }
    }

    // Handle input
    $(document).on("keypress", "#chat-input", function (e) {
        if (e.which === 13 && $(this).val().trim() !== "") {
            let userInput = $(this).val();
            $("#chat-window").append(`<div><b>You:</b> ${userInput}</div>`);
            answers[fieldKeys[currentQuestion]] = userInput;
            $(this).val("");
            currentQuestion++;
            askQuestion();
        }
    });

    // Start first question
    askQuestion();
});
