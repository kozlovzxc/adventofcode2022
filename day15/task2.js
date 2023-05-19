import { readFileSync } from "fs"

let input = readFileSync('input.txt', 'utf8').trim()

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

const manhattanDistance = (x1, y1, x2, y2) => Math.abs(x2-x1) + Math.abs(y2-y1)

const scannerDistance = analysis.map(([x1, y1, x2, y2]) => [x1, y1, manhattanDistance(x1, y1, x2, y2)])

const minX = Math.max(
	analysis.reduce((acc, [x1, y1]) => Math.min(x1, acc), Number.MAX_SAFE_INTEGER),
	0,
)
const maxX = Math.min(
	analysis.reduce((acc, [x1, y1]) => Math.max(x1, acc), 0),
	4000000,
)
const minY = Math.max(
	analysis.reduce((acc, [x1, y1]) => Math.min(y1, acc), Number.MAX_SAFE_INTEGER),
	0,
)
const maxY = Math.min(
	analysis.reduce((acc, [x1, y1]) => Math.max(y1, acc), 0),
	4000000,
)


for (let x = minX; x <= maxX; x++) {
	for (let y = minY; y <= maxY; y++) {
		let counter = 0
		for (let [x1, y1, baseDistance] of scannerDistance) {
			const distance = manhattanDistance(x, y, x1, y1)
			// console.log(`x1=${x1} y1=${y1} distance=${baseDistance}`)
			// console.log(`x=${x} y=${y} distance=${distance}`)
			if (distance <= baseDistance) {
				y = Math.max(
					baseDistance - Math.abs(x - x1) + y1,
					baseDistance - Math.abs(x - x1) - y1,
				)
				break
			} else {
				counter++
			}
		}
		if (counter === scannerDistance.length) {
			console.log('Found!', x, y, '=>', x * 4000000 + y)
			process.exit(0)
		}
	}
}
