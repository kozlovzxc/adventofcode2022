import { readFileSync } from 'node:fs'

let input = readFileSync('input.txt', 'utf8').trim()
// input = `noop
// addx 3
// addx -5`
let lines = input.split('\n')

let tick = (history, command) => {
	const [operator, argument] = command.split(' ')
	const last = history.at(-1)
	switch(operator) {
		case 'noop':
			return [...history, last]
		case 'addx':
			return [...history, last, last + +argument]
		default:
			throw new Error(`Unknown operator: ${operator}`)
	}
}

let history = lines.reduce(tick, [0, 1])
// console.log(JSON.stringify(history.map((value, index) => [index, value]), null, 2))
// Task 1
// console.log(
// 	20, history[20], 20 * history[20], '\n',
// 	60, history[60], 60 * history[60], '\n',
// 	100, history[100], 100 * history[100], '\n',
// 	140, history[140], 140 * history[140], '\n',
// 	180, history[180], 180 * history[180], '\n',
// 	220, history[220], 220 * history[220], '\n',
// )
// console.log(
// 	20 * history[20] + 
// 	60 * history[60] + 
// 	100 * history[100] + 
// 	140 * history[140] + 
// 	180 * history[180] + 
// 	220 * history[220] 
// )

// Task 2
history.splice(0, 1)
const linesToDraw = [
	history.slice(0, 40),
	history.slice(40, 80),
	history.slice(80, 120),
	history.slice(120, 160),
	history.slice(160, 200),
	history.slice(200, 240),
]

const drawLine = (spritePositions) => {
	const line = new Array(40).fill('.')
	for (let i = 0; i < 40; i++) {
		const crtPosition = i
		const spritePosition = spritePositions[i]
		if (Math.abs(crtPosition - spritePosition) < 2) {
			line[crtPosition] = '#'
		}
	}
	console.log(line.join(''))
}

linesToDraw.forEach(drawLine)