export enum WebSocketMessageType { 
	PING = 'ping',
	ECHO = 'echo'
}

export class WebSocketMessage {

	public msg_type: WebSocketMessageType
	public data: Object

	constructor(msg_type: WebSocketMessageType, data: Object) {

		this.msg_type = msg_type
		this.data = data
	}

	public static parse(message: string): WebSocketMessage {

		try {
			let x: Object = JSON.parse(message)
			return new WebSocketMessage(x['msg_type'], x['data'] ?? {})
		}
		catch (e) { console.log(e) }
	}

	public toString() {

		return JSON.stringify({ msg_type: this.msg_type, data: this.data })
	}
}