export default function getSocket() {
    const url = window.location.host + '/watch';
    const protocol = (window.location.protocol === "https:") ? "wss://" : "ws://";

    const socket = new WebSocket(`${protocol}${url}`);

    socket.onmessage = function (e) {
        const data = JSON.parse(e.data);
        console.log(e.data);
    };

    socket.onopen = (e) => {
        console.log(e);
    };

    socket.onerror = (e) => {
        console.log(e);
    };

    socket.onclose = function (e) {
        if (e.code === 1006) {
            getSocket();
        };
    };
}