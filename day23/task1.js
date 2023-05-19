import { readFileSync } from "fs"

let input

input = `..............
..............
.......#......
.....###.#....
...#...#.#....
....#...##....
...#.###......
...##.#.##....
....#..#......
..............
..............
..............`

// input = `.....
// ..##.
// ..#..
// .....
// ..##.
// .....`

input = readFileSync('input.txt', 'utf8')

let startingMap = input.split('\n').map(line => line.split(''))

const getNumberKeys = (object) => Object.keys(object).map(key => +key)

const safeSet = (obj, y, x, value) => {
	if (obj[y] == null) {
		obj[y] = {}
	}
	obj[y][x] = value
}

const safeGet = (obj, y, x, defaultValue = undefined) => {
	if (obj[y] == null) {
		return defaultValue
	}
	return obj[y][x] ?? defaultValue
}

const getCoordinatesList = (positions) => getNumberKeys(positions).reduce((acc, y) => [
		...acc,
		...getNumberKeys(positions[y]).reduce((acc, x) => [...acc, [y, x]], [])
	], 
	[]
)

const getMinMax = (positions) => {
	let minX = Number.MAX_SAFE_INTEGER;
	let maxX = Number.MIN_SAFE_INTEGER;
	let minY = Number.MAX_SAFE_INTEGER;
	let maxY = Number.MIN_SAFE_INTEGER;
	for (let y of getNumberKeys(positions)) {
		for (let x of getNumberKeys(positions[y])) {
			if (x < minX) {
				minX = x
			}
			if (x > maxX) {
				maxX = x
			}
			if (y < minY) {
				minY = y
			}
			if (y > maxY) {
				maxY = y
			}
		}
	}
	return [minY, maxY, minX, maxX]
}

const printPositions = (positions) => {
	const [minY, maxY, minX, maxX] = getMinMax(positions)
	const delta = 2
	for (let y = minY - delta; y <= maxY + delta; y++) {
		let line = ''
		for (let x = minX - delta; x <= maxX + delta; x++) {
			line += safeGet(positions, y, x) != null ? '#' : '.'
		}
		console.log(line)
	}
}

const positions = {}

for (let y = 0; y < startingMap.length; y++) {
	for (let x = 0; x < startingMap[0].length; x++) {
		if (startingMap[y][x] === '#') {
			safeSet(positions, y, x, true)
		}
	}
}

console.log('=== Initial state ===')
printPositions(positions)

let directions = [
	'north',
	'south',
	'west',
	'east'
]
for (let round = 0; round < 10; round++) {
	// before round 
	const proposals = {}

	// first half
	for (let [y, x] of getCoordinatesList(positions)) {
		if (
			safeGet(positions, y-1, x-1) == null &&
			safeGet(positions, y-1, x) == null &&
			safeGet(positions, y-1, x+1) == null &&

			safeGet(positions, y, x-1) == null &&
			safeGet(positions, y, x+1) == null &&

			safeGet(positions, y+1, x-1) == null &&
			safeGet(positions, y+1, x) == null &&
			safeGet(positions, y+1, x+1) == null
		) {
			continue
		}
		for (let direction of directions) {
			if (direction === 'north') {
				if (
					safeGet(positions, y - 1, x - 1) == null &&
					safeGet(positions, y - 1, x) == null &&
					safeGet(positions, y - 1, x + 1) == null
				) {
					safeSet(proposals, y - 1, x, [...safeGet(proposals, y - 1, x, []), [y, x]])
					break
				}
			}
			if (direction === 'south') {
				if (
					safeGet(positions, y + 1, x - 1) == null &&
					safeGet(positions, y + 1, x) == null &&
					safeGet(positions, y + 1, x + 1) == null
				) {
					safeSet(proposals, y + 1, x, [...safeGet(proposals, y + 1, x, []), [y, x]])
					break
				}
			}
			if (direction === 'west') {
				if (
					safeGet(positions, y - 1, x - 1) == null &&
					safeGet(positions, y, x - 1) == null &&
					safeGet(positions, y + 1, x - 1) == null
				) {
					safeSet(proposals, y, x - 1, [...safeGet(proposals, y, x - 1, []), [y, x]])
					break
				}
			}
			if (direction === 'east') {
				if (
					safeGet(positions, y - 1, x + 1) == null &&
					safeGet(positions, y, x + 1) == null &&
					safeGet(positions, y + 1, x + 1) == null
				) {
					safeSet(proposals, y, x + 1, [...safeGet(proposals, y, x + 1, []), [y, x]])
					break
				}
			}
		}
	}

	// second half
	for (let y of getNumberKeys(proposals)) {
		for (let x of getNumberKeys(proposals[y])) {
			const proposal = safeGet(proposals, y, x)
			if (proposal.length !== 1) {
				continue
			} 
			const [oldY, oldX] = proposal[0]
			delete positions[oldY][oldX]
			if (Object.keys(positions[oldY]).length === 0) {
				delete positions[oldY]
			}
			safeSet(positions, y, x, true)
		}
	}

	// end of round
	console.log()
	console.log(`=== Round ${round + 1} ===`)
	printPositions(positions)

	directions.push(directions.shift())
}

const [minY, maxY, minX, maxX] = getMinMax(positions)
console.log(minY, maxY, minX, maxX)
const elves = getCoordinatesList(positions).length
console.log((maxY - minY + 1) * (maxX - minX + 1) - elves)
