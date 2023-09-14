import * as fs from 'node:fs'

export enum ContentType {
	html = 'text/html',
	css = 'text/css',
	js = 'application/javascript',
	ts = 'application/typescript',
	map = 'application/octet-stream'
}

export class StaticAppFile {

	public type: ContentType
	public data: Buffer

	constructor(fp: string) {

		let x = fp.substring(1 + fp.lastIndexOf('.'))
		this.data = fs.readFileSync(fp)
		this.type = ContentType[x]
	}
}
