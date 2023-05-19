import { readFileSync } from "fs"

let input = readFileSync('input.txt', 'utf8').trim()
let row = 2000000

// row = 10
// input = `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
// Sensor at x=9, y=16: closest beacon is at x=10, y=16
// Sensor at x=13, y=2: closest beacon is at x=15, y=3
// Sensor at x=12, y=14: closest beacon is at x=10, y=16
// Sensor at x=10, y=20: closest beacon is at x=10, y=16
// Sensor at x=14, y=17: closest beacon is at x=10, y=16
// Sensor at x=8, y=7: closest beacon is at x=2, y=10
// Sensor at x=2, y=0: closest beacon is at x=2, y=10
// Sensor at x=0, y=11: closest beacon is at x=2, y=10
// Sensor at x=20, y=14: closest beacon is at x=25, y=17
// Sensor at x=17, y=20: closest beacon is at x=21, y=22
// Sensor at x=16, y=7: closest beacon is at x=15, y=3
// Sensor at x=14, y=3: closest beacon is at x=15, y=3
// Sensor at x=20, y=1: closest beacon is at x=15, y=3`

const analysis = input
	.split('\n')
	.map(line => line.match(/Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/))
	// .map(match => new Array(match)[0])
	.map(line => line.slice(1, 5).map(i => +i))

// console.log(analysis)

const minX = analysis
	.reduce((acc, [x1, y1, x2, y2]) => Math.min(x1, x2, acc), Number.MAX_SAFE_INTEGER)
const maxX = analysis
	.reduce((acc, [x1, y1, x2, y2]) => Math.max(x1, x2, acc), 0)

const minY = analysis
	.reduce((acc, [x1, y1, x2, y2]) => Math.min(y1, y2, acc), Number.MAX_SAFE_INTEGER)
const maxY = analysis
	.reduce((acc, [x1, y1, x2, y2]) => Math.max(y1, y2, acc), 0)

console.log('X:', minX, maxX)
console.log('Y:', minY, maxY)

class AreaMap {
	constructor(minX, minY, maxX, maxY) {
		this.minX = minX
		this.maxX = maxX
		this.minY = minY
		this.maxY = maxY
		const width = maxX - minX + 1
		const height = maxY - minY + 1

		console.log('width:', width)
		console.log('height:', height)
		this.areaMap = {}
		// this.areaMap = new Array(height).fill(undefined)
		// 	.map(_ => new Array(width).fill('.'))
	}

	set(x, y, char) {
		const newX = x - this.minX
		const newY = y - this.minY
		if (this.areaMap[newY] == null) {
			this.areaMap[newY] = {}
		}
		if (this.areaMap[newY][newX] == null) {
			this.areaMap[newY][newX] = char
		}
	}

	getRow(y) {
		return this.areaMap[y - this.minY]
	}

	toString() {
		return `\t${this.minX} -> ${this.maxX}\n` +
			this.areaMap.map((line, i) => `${i + this.minY}\t` + line.join('')).join('\n')
	}
}

const areaMap = new AreaMap(minX, minY, maxX, maxY)

for (let [x1, y1, x2, y2] of analysis) {
	areaMap.set(x1, y1, 'S')
	areaMap.set(x2, y2, 'B')
}

const manhattanDistance = (x1, y1, x2, y2) => Math.abs(x2-x1) + Math.abs(y2-y1)

for (let [x1, y1, x2, y2] of analysis) {
	const distance = manhattanDistance(x1, y1, x2, y2)
	// let y = row
	for (let x = -distance + x1; x <= distance + x1; x++) {
		for (let y = -distance + y1; y <= distance + y1; y++) {
			const curDistance = manhattanDistance(x, y, x1, y1)
			if (curDistance > distance) {
				continue
			}
			areaMap.set(x, y, '#')
		}
	}
}

// console.log()
// console.log(areaMap.toString())
// console.log('Answer:')
// console.log(areaMap.areaMap[row].join(''))
// console.log(areaMap)
// console.log(Object.values(areaMap.getRow(row)).join(''))
console.log(Object.values(areaMap.getRow(row)).reduce((acc, cur) => cur === '#' ? acc + 1 : acc, 0))
