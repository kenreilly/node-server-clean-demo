import { WebSocketMessage, WebSocketMessageType } from "../common/ws-message.js"

class ClientApp {

	static body: HTMLBodyElement
	static wsc: WebSocket

	static ws_send(msg: WebSocketMessage) {

		if (!ClientApp.wsc) return
		ClientApp.wsc.send(msg.toString())
		this.print_event('message sent', msg)
	}

	static ws_receive(msg: WebSocketMessage) { this.print_event('message received', msg) }

	static print_event(title: string, msg: WebSocketMessage) {

		let div = document.createElement('div')
		let label = document.createElement('label')
		let span = document.createElement('span')

		label.innerText = (new Date()).toLocaleTimeString()
		span.innerText = title + " - type: " + msg.msg_type + ", data: " + msg.data.toString()
		div.appendChild(label)
		div.appendChild(span)

		ClientApp.body.appendChild(div)
		div.scrollIntoView()
	}

	static init() {

		ClientApp.body = document.querySelector('body')

		ClientApp.wsc = new WebSocket('ws://' + window.location.hostname + ':3001')
		ClientApp.wsc.onopen = () => { ClientApp.ws_send(new WebSocketMessage(WebSocketMessageType.PING, 'ping')) }
		ClientApp.wsc.onmessage = (ev: MessageEvent) => { this.ws_receive(WebSocketMessage.parse(ev.data)) }
		ClientApp.wsc.onerror = (ev: MessageEvent) => { console.log(ev) }

		window.onkeyup = (ev: KeyboardEvent) => { this.ws_send(new WebSocketMessage(WebSocketMessageType.ECHO, ev.key)) }
	}
}

ClientApp.init()
window['BiziaClient'] = ClientApp