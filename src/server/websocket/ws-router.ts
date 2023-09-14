import * as crypto from 'node:crypto'
import { IncomingMessage } from 'node:http'
import { Duplex } from "node:stream";
import { AppConfig } from '../app-config.js'
import { WebSocketOpcode, WebSocketFrame } from './ws-frame.js';
import { WebSocketMessage } from '../../common/ws-message.js';
import { WebSocketAPI } from './ws-api.js';

export class WebSocketRouter {

	private ws_clients: { [id: string]: Duplex } = {}

	constructor() { }

	public on_upgrade(req: IncomingMessage, socket: Duplex, head: Buffer) {

		try {
			if (req.headers['upgrade'] != 'websocket') return

			let key: string = req.headers['sec-websocket-key']
			let hash: crypto.Hash = crypto.createHash('sha1')
			let accept: string = key + AppConfig.ws_rfc_guid
			let accept_hash: string = hash.update(accept, 'binary').digest('base64')

			let headers = [
				'HTTP/1.1 101 Switching Protocols',
				'Upgrade: websocket',
				'Connection: Upgrade',
				'Sec-WebSocket-Accept: ' + accept_hash
			]

			this.ws_clients[key] = socket
			socket.on('data', this.on_data.bind(this, key))
			socket.write(headers.concat('\r\n').join('\r\n'))
		}
		catch(e) { console.log(e) }		
	}

	private on_data(id: string, data: Buffer) {

		try {
			let final: boolean = Boolean(data[0] >>> 7)
			let opcode: number = (data[0] & 0b00001111)

			switch (opcode) {

				case WebSocketOpcode.TEXT:
					return this.parse_message(id, WebSocketFrame.parse(data))

				default:
				case WebSocketOpcode.CLOSE:
					this.ws_clients[id].destroy()
					return delete this.ws_clients[id]				
			}
		}
		catch (e) { console.log(e) }
	}

	private parse_message(id: string, message: Buffer) {

		try {
			let msg = WebSocketMessage.parse(message.toString())
			WebSocketAPI.handle(msg).then(((response: WebSocketMessage) => this.send_message(id, response)).bind(this))
		}
		catch(e) { console.log(e) }
	}

	public send_message(id: string, data: object) {

		try { this.ws_clients[id].write(WebSocketFrame.build(data)) }
		catch(e) { console.log(e) }
	}
}