import { readFileSync } from 'node:fs'

let input = readFileSync('./input.txt', 'utf8').trim()
// Task 1 input
// input = `R 4
// U 4
// L 3
// D 1
// R 4
// D 1
// L 5
// R 2`
// Task 2 input
// input = `R 5
// U 8
// L 8
// D 3
// R 17
// D 10
// L 25
// U 20`
const commands = input.split('\n')

class Tail {
	_x = 0
	_y = 0
	_head = undefined
	_history = []

	constructor(head) {
		this._head = head
	}

	_step() {
		const [headX, headY] = this._head.getPosition()

		const xDiff = headX - this._x
		const xSign = Math.sign(xDiff)
		const xRange = Math.abs(xDiff)

		const yDiff = headY - this._y
		const ySign = Math.sign(yDiff)
		const yRange = Math.abs(yDiff)

		if (xRange === 2 || yRange === 2) {
			this._x += xSign
			this._y += ySign
		} else if (yRange > 1) {
			this._y += ySign
		} else if (xRange > 1) {
			this._x += xSign
		}
	}

	step() {
		this._step()
		this._history.push([this._x, this._y])
	}

	getPosition() {
		return [this._x, this._y]
	}

	getHistory() {
		return this._history
	}
}

class Head {
	_x = 0
	_y = 0

	step(direction) {
		switch(direction) {
			case 'U':
				this._y++
				break
			case 'D':
				this._y--
				break
			case 'L':
				this._x--
				break
			case 'R':
				this._x++
				break
			default:
				throw new Error(`Unknown direction: ${direction}`)
		}
	}

	getPosition() {
		return [this._x, this._y]
	}
}

const head = new Head()
const tail1 = new Tail(head)
const tail2 = new Tail(tail1)
const tail3 = new Tail(tail2)
const tail4 = new Tail(tail3)
const tail5 = new Tail(tail4)
const tail6 = new Tail(tail5)
const tail7 = new Tail(tail6)
const tail8 = new Tail(tail7)
const tail9 = new Tail(tail8)

for (let command of commands) {
	const [direction, _distance] = command.split(' ')
	const distance = +_distance
	for (let i = 0; i < distance; i++) {
		head.step(direction)
		tail1.step()
		tail2.step()
		tail3.step()
		tail4.step()
		tail5.step()
		tail6.step()
		tail7.step()
		tail8.step()
		tail9.step()
	}
}

console.log(Array.from(new Set(tail9._history.map(([x,y]) => `${x},${y}`)).values()))
console.log(Array.from(new Set(tail9._history.map(([x,y]) => `${x},${y}`)).values()).length)

