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
console.log(key)
const height = rawMap.length
const width = rawMap.map(line => line.length).reduce((acc, cur) => cur > acc ? cur : acc)

const getNextTop = (y, x) => {
	let nextY = (y - 1 + height) % height
	while (rawMap[nextY][x] !== '.' && rawMap[nextY][x] !== '#') {
		nextY = (nextY - 1 + height) % height
	}
	return [nextY, x]
}

const getNextBottom = (y, x) => {
	let nextY = (y + 1) % height
	while (rawMap[nextY][x] !== '.' && rawMap[nextY][x] !== '#') {
		nextY = (nextY + 1) % height
	}
	return [nextY, x]
}

const getNextRight = (y, x) => {
	let nextX = (x + 1) % width
	while (rawMap[y][nextX] !== '.' && rawMap[y][nextX] !== '#') {
		nextX = (nextX + 1) % width
	}
	return [y, nextX]
}

const getNextLeft = (y, x) => {
	let nextX = (x - 1 + width) % width
	while (rawMap[y][nextX] !== '.' && rawMap[y][nextX] !== '#') {
		nextX = (nextX - 1 + width) % width
	}
	return [y, nextX]
}

const preProcessNode = (y, x) => {
	const value = rawMap[y][x] ?? ' '
	if (value === ' ') {
		return {
			value,
		}
	} else {
		return {
			value,
			top: getNextTop(y, x),
			right: getNextRight(y, x),
			bottom: getNextBottom(y, x),
			left: getNextLeft(y, x),
		}
	}
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
	console.log(y, x, direction, '<->', command)
	if (command.match(/\d+/)) {
		const steps = +command
		for (let step = 0; step < steps; step++) {
			const [nextY, nextX] = world[y][x][direction]
			if (world[nextY][nextX].value === '#') {
				break
			} else {
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

