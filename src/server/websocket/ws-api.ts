import { WebSocketMessage, WebSocketMessageType } from "../../common/ws-message.js"

export class WebSocketAPI {

	private static command_table: {[name:string]: Function} = {
		'ping': WebSocketAPI.ping,
		'echo': WebSocketAPI.echo
	}

	public static handle(message: WebSocketMessage): Promise<WebSocketMessage> {

		return new Promise((resolve, reject) => {

			if (message.msg_type in WebSocketAPI.command_table) {
				return resolve(WebSocketAPI.command_table[message.msg_type](message.data))
			}
			
			reject('invalid command')
		})
	}

	private static ping(): WebSocketMessage { return new WebSocketMessage(WebSocketMessageType.PING, 'pong') }

	private static echo (data: Object): WebSocketMessage { return new WebSocketMessage(WebSocketMessageType.ECHO, data) }
	
}