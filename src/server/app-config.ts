import * as path from 'node:path'
import * as fs from 'node:fs'

export class AppConfig {

	public static readonly ws_rfc_guid: string = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'

	public readonly server_root: string = process.cwd()
	public readonly app_dirs: Array<string> = [
		'css/', 
		'src/common/', 
		'dist/common/',
		'src/client-web/', 
		'dist/client-web/'
	]

	private _http_port: number = 0
	public get http_port(): number { return this._http_port }
	public set http_port(val: any) { this._http_port = parseInt(val) }

	private _ws_port: number = 0
	public get ws_port(): number { return this._ws_port }
	public set ws_port(val: any) { this._ws_port = parseInt(val )}
	
	public ssl_path: string
	public ssl_cert: Buffer
	public ssl_key: Buffer
	
	get ssl() { return { key: this.ssl_key, cert: this.ssl_cert } }

	private static assignable = ['http_port', 'ws_port', 'use_ssl']
	private parse(key: string, val: string) {  if (AppConfig.assignable.indexOf(key) != -1) { this[key] = val } }

	constructor() {

		try {
			let lines = fs.readFileSync(fs.existsSync('.env') ? '.env' : 'default.env').toString().split('\n')
			lines.forEach(((line: string) => { this.parse.apply(this, line.split('=')) }).bind(this))

			this.ssl_path = path.resolve('./ssl/')
			// this.ssl_cert = fs.readFileSync(path.resolve(this.ssl_path + '/localhost-cert.pem'))
			// this.ssl_key = fs.readFileSync(path.resolve(this.ssl_path + '/localhost-privkey.pem'))
		}
		catch (e) { console.log(e) }
	}
}