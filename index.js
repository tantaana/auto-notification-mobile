const fetch = require('node-fetch');

const CHECK_INTERVAL_MS = 5000; // every 5 seconds
const BUTTON_CLASS = 'btn btn-lg btn-icon bg-green-400'; // or use actual selector
const API_TOKEN = 'o.7ZKR2Elty8IkpNpV4E253q4payHoU6ES'; // replace this!

const { JSDOM } = require('jsdom');

async function checkButton() {
    const url = 'https://www.goethe.de/ins/in/en/spr/prf/gzb1.cfm?examId=595AC2DA858CF8808AD605C27A9D58052BD3DA74EA97AAE20DFE51A280C19DF8DDCDBCCA8E1F2E4FDBEEAB8653851AD6EEAEDF90548256C9A02CD01298D69FBC';
    try {
        const res = await fetch(url);
        const html = await res.text();

        const dom = new JSDOM(html);
        const button = dom.window.document.querySelector(`.${BUTTON_CLASS.split(' ').join('.')}`);

        if (button && !button.disabled) {
            console.log('✅ Button is active! Sending notification.');
            await sendPushNotification('Goethe Slot Open', 'The module selection button is now clickable!');
        } else {
            console.log('🔁 Button not clickable yet.');
        }
    } catch (err) {
        console.error('❌ Error:', err);
    }
}

async function sendPushNotification(title, body) {
    const response = await fetch('https://api.pushbullet.com/v2/pushes', {
        method: 'POST',
        headers: {
            'Access-Token': API_TOKEN,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: 'note', title, body })
    });

    if (response.ok) {
        console.log('📱 Notification sent.');
    } else {
        console.log('❌ Pushbullet failed.');
    }
}

setInterval(checkButton, CHECK_INTERVAL_MS);
