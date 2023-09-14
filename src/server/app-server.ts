// import * as http from 'node:https'
import * as http from 'node:http'
import { IncomingMessage, ServerResponse } from 'node:http'
import { StaticAppRouter } from './static-app/static-app-router.js'
import { WebSocketRouter } from './websocket/ws-router.js'
import { AppConfig } from './app-config.js'

class AppServer {

	private config: AppConfig
		
	private http_server: http.Server
	private ws_server: http.Server

	private app_router: StaticAppRouter
	private ws_router: WebSocketRouter
	
	constructor(config: AppConfig) {
	
		this.config = config
		// this.server = http.createServer(cfg.ssl, this.on_http.bind(this))
		this.http_server = http.createServer(this.on_http.bind(this))
		this.ws_server = http.createServer()

		this.app_router = new StaticAppRouter(this.config)
		this.ws_router = new WebSocketRouter()
		this.ws_server.on('upgrade', this.ws_router.on_upgrade.bind(this.ws_router))
	}

	private on_http(req: IncomingMessage, res: ServerResponse): void {
		
		if (req.method == 'GET') { return this.app_router.handle(req, res) }		
		res.statusCode = 400
		res.end()
	}

	public run(): void {

		this.http_server.listen(this.config.http_port)
		this.ws_server.listen(this.config.ws_port)

		console.log('http running on port ' + this.config.http_port)
		console.log('ws running on port ' + this.config.ws_port)
	}
}

let server: AppServer = new AppServer(new AppConfig)
server.run()