import { readFileSync } from "node:fs"

let input

input = `        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5`

input = readFileSync('input.txt', 'utf8')

const lines = input.split('\n')
const breakIndex = lines.findIndex(item => item === '')

const rawMap = lines.slice(0, breakIndex)
const key = lines[breakIndex+1].match(/(\d+)|([RL])/g)
const height = rawMap.length
const width = rawMap.map(line => line.length).reduce((acc, cur) => cur > acc ? cur : acc)

const getNextTop = (y, x) => {
	const node = world[y][x]
	if (node.side === 1 && y === 0) {
		return [199, x - 100, 'top']
	}
	if (node.side === 2 && y === 0) {
		return [150 + (x - 50), 0, 'right']
	}
	if (node.side === 5 && y === 100) {
		return [50 + x, 50, 'right']
	}
	return [y - 1, x]
}

const getNextBottom = (y, x) => {
	const node = world[y][x]
	if (node.side === 1 && y === 49) {
		// goes to 3 from right
		return [50 + (x - 100), 99, 'left']
	}
	if (node.side === 4 && y === 149) {
		// goes to 6 from right
		return [150 + (x - 50), 49, 'left']
	}
	if (node.side === 6 && y === 199) {
		// goes to 1 from top
		return [0, 100 + x, 'bottom']
	}
	return [y + 1, x]
}

const getNextRight = (y, x) => {
	const node = world[y][x]
	if (node.side === 1 && x === 149) {
		// goes to 4 from right, reversed
		return [149 - y, 99,'left']
	}
	if (node.side === 3 && x === 99) {
		// goes to 1 from bottom
		return [49, 100 + (y - 50), 'top']
	}
	if (node.side === 4 && x === 99) {
		// goes to 1 from right, reversed
		return [149 - y, 149, 'left']
	}
	if (node.side === 6 && x === 49) {
		// goes to 4 from bottom
		return [149, 50 + (y - 150), 'top']
	}
	return [y, x + 1]
}

const getNextLeft = (y, x) => {
	const node = world[y][x]
	if (node.side === 2 && x === 50) {
		// goes to 5 from left, reversed
		return [100 + (49 - y), 0, 'right']
	}
	if (node.side === 3 && x === 50) {
		// goes to 5 from top
		return [100, y - 50, 'bottom']
	}
	if (node.side === 5 && x === 0) {
		// goes to 2 from left, reversed
		return [149 - y, 50, 'right']
	}
	if (node.side === 6 && x === 0) {
		// goes to 2 from top
		return [0, 50 + (y - 150), 'bottom']
	}
	return [y, x - 1]
}

const getSide = (y, x) => {
	if (y < 50) {
		if (x < 100) {
			return 2
		}
		return 1
	}
	if (y < 100) {
		return 3
	}
	if (y < 150) {
		if (x < 50) {
			return 5
		}
		return 4
	}
	return 6
}

const initNode = (y, x) => {
	const value = rawMap[y][x] ?? ' '
	const baseNode = {
		value,
		y,
		x,
	}
	if (value !== ' ') {
		return {
			...baseNode,
			side: getSide(y, x)
		}
	}
	return baseNode
}

const preProcessNode = (y, x) => {
	const node = world[y][x]
	if (node.value !== ' ') {
		return {
			...node,
			top: getNextTop(y, x),
			right: getNextRight(y, x),
			bottom: getNextBottom(y, x),
			left: getNextLeft(y, x),
		}
	}
	return node
}

const world = Array.from({ length: height }).map(_ => Array.from({ length: width }))

let startX = undefined
let startY = undefined
for (let y = 0; y < height; y++) {
	for (let x = 0; x < width; x++) {
		if (rawMap[y][x] === '.' && startX == null && startY == null) {
			startX = x
			startY = y
		}
		world[y][x] = initNode(y, x)
	}
}
for (let y = 0; y < height; y++) {
	for (let x = 0; x < width; x++) {
		world[y][x] = preProcessNode(y, x)
	}
}

let x = startX
let y = startY
let direction = 'right'
const rotation = {
	'top': {
		'L': 'left',
		'R': 'right',
	},
	'right': {
		'L': 'top',
		'R': 'bottom'
	},
	'bottom': {
		'L': 'right',
		'R': 'left'
	},
	'left': {
		'L': 'bottom',
		'R': 'top'
	}
}

for (const command of key) {
	if (command.match(/\d+/)) {
		const steps = +command
		for (let step = 0; step < steps; step++) {
			const [nextY, nextX, nextDirection] = world[y][x][direction];
			// console.log(y, x, world[y][x], direction)
			// console.log(nextY, nextX, world[nextY][nextX])
			if (world[nextY][nextX].value === '#') {
				break
			} else {
				direction = nextDirection ?? direction
				x = nextX
				y = nextY
			}
		}
	}
	if (command.match(/[RL]/)) {
		direction = rotation[direction][command]
	}
}

const directionScore = {
	'top': 3,
	'right': 0,
	'bottom': 1,
	'left': 2
}

console.log((y+1) * 1000 + (x+1) * 4 + directionScore[direction])

