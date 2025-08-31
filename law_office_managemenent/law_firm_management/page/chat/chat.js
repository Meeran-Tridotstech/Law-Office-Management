frappe.pages['chat'].on_page_load = function (wrapper) {
	const page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Chat',
		single_column: true
	});

	// Load HTML (from chat.html)
	$(wrapper).append(frappe.render_template("chat", {}));

	// Realtime subscription
	frappe.realtime.on('new_chat_message', (data) => {
		$("#messages").append(
			`<p><b>${data.sender}:</b> ${data.message}</p>`
		);
		scrollToBottom();
	});

	// Send button
	$("#send-btn").on("click", () => {
		sendMessage();
	});
};

function sendMessage() {
	const message = document.getElementById("message-input").value;
	if (!message) return;

	const sender = frappe.session.user;
	const receiver = "advocate@example.com";  // TODO: dynamic receiver

	frappe.call({
		method: "your_app.chat.send_message",
		args: { sender, receiver, message },
		callback: function () {
			document.getElementById("message-input").value = "";
		}
	});
}

function scrollToBottom() {
	const messagesDiv = document.getElementById("messages");
	messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
