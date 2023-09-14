
export enum WebSocketOpcode {

	CONTINUE = 0x0,
	TEXT = 0x1,
	BINARY = 0x2,
	CLOSE = 0x8
}

export abstract class WebSocketFrame {

	public static parse(data: Buffer): Buffer {

		try {
			let masked: boolean = Boolean(data[1] >>> 7)
			let lvalue: number = (data[1] & 0b01111111)
			let length: number = ((lvalue == 126) ? data.readUInt16LE(2) : lvalue)
			let big_length: bigint = ((lvalue == 127) ? data.readBigUint64LE(2) : null)
			let mask: Array<number> = []
			let offset: number = 2
			offset += (lvalue == 127) ? 8 : (offset == 126 ? 2 : 0)

			if (masked) {
				for (i = 0; i != 4; ++i) { mask[i] = data[offset + i] }
				offset += 4
			}

			let payload: Buffer = data.subarray(offset)
			let content: Buffer = Buffer.alloc(data.length - offset)
			for (var i = 0; i != payload.length; ++i) {
				content.writeUint8(payload[i] ^ mask[i % 4], i)
			}

			return content
		}
		catch (e) { console.log(e) }
	}

	public static build(data: object): Buffer {

		try {
			let json = JSON.stringify(data)
			let buffer: Buffer = Buffer.alloc(2 + json.length)
			buffer.writeUint8(0b10000001, 0)
			buffer.writeUint8(json.length, 1)
			buffer.write(json, 2)
			return buffer
		}
		catch (e) { console.log(e) }
	}
}