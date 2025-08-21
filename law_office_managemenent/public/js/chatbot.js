frappe.ready(function () {
    console.log("✅ Chatbot Loaded in Desk");

    let button = $('<button class="btn btn-primary">Chat 💬</button>')
        .css({
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            'z-index': 1000
        })
        .appendTo('body');

    let chatWindow = $('<div id="chat-window"></div>')
        .css({
            display: 'none',
            position: 'fixed',
            bottom: '70px',
            right: '20px',
            width: '320px',
            height: '420px',
            background: 'white',
            border: '1px solid #ddd',
            'border-radius': '10px',
            'z-index': 1000,
            'overflow-y': 'auto',
            padding: '10px'
        })
        .appendTo('body');

    button.on('click', function () {
        chatWindow.toggle();
    });
});
