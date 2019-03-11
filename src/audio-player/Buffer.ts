export class Buffer {
	private _sourceData: { [key: number]: AudioBufferSourceNode } = {};
	private _bufferData: { [key: number]: AudioBuffer } = {};

	constructor(private _context: AudioContext) {}

	private _createSourceNode(index: number) {
		const sourceNode = this._context.createBufferSource();
		sourceNode.connect(this._context.destination);
		sourceNode.buffer = this._bufferData[index];
		this._sourceData[index] = sourceNode;
	}

	private _playSourceNode(index: number, startTime: number) {
		Object.keys(this._sourceData).forEach(key => {
				if (Number(key) === index) {
					this._sourceData[Number(key)].start(0, startTime);
				} else {
					this._sourceData[Number(key)].stop();
				}
		});
	}

	public play(
		url: string,
		index: number,
		startTime: number = 0
	): Promise<AudioBuffer> {
		return new Promise((res, reject) => {
			if (this._bufferData[index]) {
				this._createSourceNode(index);
				this._playSourceNode(index, startTime);
				res(this._bufferData[index]);
			} else {
				fetch(url)
					.then(response => response.arrayBuffer())
					.then(buffer => {
						this._context.decodeAudioData(
							buffer,
							(decodedBuffer: AudioBuffer) => {
								this._bufferData[index] = decodedBuffer;
								this._createSourceNode(index);
								this._playSourceNode(index, startTime);
								res(decodedBuffer);
							}
						);
					})
					.catch(error => {
						reject(error);
					});
			}
		});
	}

	public stop(index: number) {
		this._sourceData[index].stop();
	}
}
