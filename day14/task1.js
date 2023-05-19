import { readFileSync } from 'node:fs'

let input = readFileSync('input.txt', 'utf8').trim()

// input = `498,4 -> 498,6 -> 496,6
// 503,4 -> 502,4 -> 502,9 -> 494,9`


class ScanMap {
	static fromString(input) {
		let coordinates = input
			.split('\n')
			.map(line => line
				.split(' -> ')
				.map(coordinates => coordinates
					.split(',')
					.map(coordinate => +coordinate)
				)
			)
		return new ScanMap(coordinates)
	}

	constructor (coordinates) {
		let flatCoordinates = coordinates.flat()
		this.minX = flatCoordinates.reduce((acc, [x, _]) => x < acc ? x : acc, Number.MAX_SAFE_INTEGER)
		this.maxX = flatCoordinates.reduce((acc, [x, _]) => x > acc ? x : acc, 0)
		this.minY = flatCoordinates.reduce((acc, [_, y]) => y < acc ? y : acc, Number.MAX_SAFE_INTEGER)
		this.maxY = flatCoordinates.reduce((acc, [_, y]) => y > acc ? y : acc, 0)

		this.scanMap = new Array(this.maxY + 1).fill(undefined)
			.map(_ => new Array(this.maxX - this.minX + 1).fill('.'))

		for (let coordinatesLine of coordinates) {
			for (let i = 0; i < coordinatesLine.length - 1; i++) {
				let [fromX, fromY] = coordinatesLine[i]
				let [toX, toY] = coordinatesLine[i + 1]
				// console.log(fromX, fromY, toX, toY)
				if (fromX === toX) {
					this._drawVertical(fromX, fromY, toY)
				} else if (fromY === toY) {
					this._drawHorizontal(fromX, toX, fromY)
				} else {
					throw new Error(`Unable to produce path from ${fromX},${fromY} to ${toX},${toY}`)
				}
			}
		}
	}

	_drawVertical(x, fromY, toY) {
		const start = Math.min(fromY, toY)
		const end = Math.max(fromY, toY)
		for (let i = start; i <= end; i++) {
			this.scanMap[i][x - this.minX] = '#'
		}
	}

	_drawHorizontal(fromX, toX, y) {
		const start = Math.min(fromX, toX)
		const end = Math.max(fromX, toX)
		for (let i = start; i <= end; i++) {
			this.scanMap[y][i - this.minX] = '#'
		}
	}

	get(x, y) {
		if (
			x < this.minX ||
			x > this.maxX ||
			y < 0 ||
			y > this.maxY
		) {
			return '.'
		}
		return this.scanMap[y][x - this.minX]
	}

	set(x, y, char) {
		this.scanMap[y][x - this.minX] = char
	} 

	toString() {
		return `${this.minX} -> ${this.maxX}\n` + 
			this.scanMap
				.map((line, i) => `${i} ` + line.join(''))
				.join('\n')
	}
}

const scanMap = ScanMap.fromString(input)
console.log(scanMap.toString())

let x = 500
let y = 0
while (true) {
	if (y > scanMap.maxY) {
		break
	}
	const item = scanMap.get(x, y + 1)
	if (item === '.') {
		y++
		continue
	}
	const itemLeft = scanMap.get(x - 1, y + 1)
	if (itemLeft === '.') {
		x--
		y++
		continue
	}
	const itemRight = scanMap.get(x + 1, y + 1)
	if (itemRight === '.') {
		x++
		y++
		continue
	}
	scanMap.set(x, y, 'o')
	x = 500;
	y = 0;
	console.log(scanMap.toString())
}

console.log(scanMap.scanMap.reduce((acc, cur) => acc + cur.reduce((acc, cur) => cur === 'o' ? acc + 1 : acc, 0), 0))

