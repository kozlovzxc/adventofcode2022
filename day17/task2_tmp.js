import { readFileSync } from 'node:fs'

const BASE_Y = 4
const BASE_X = 2
const WORLD_WIDTH = 7
const MAX_ROCKS = 2022

let pattern = readFileSync('input.txt', 'utf8').trim()
// pattern = '>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>'

class BaseItem {
	static height = undefined

	constructor(world) {
		this.world = world
		this.x = BASE_X
		this.y = world.length() - 1
	}

	canFall() {
		throw new Error('fall is not implemented')
	}

	fall() {
		this.y--;
	}

	canMoveRight() {
		throw new Error('canMoveRight is not implemented')
	}

	moveRight() {
		this.x++;
	}

	canMoveLeft() {
		throw new Error('canMoveLeft is not implemented')
	}

	moveLeft() {
		this.x--;
	}

	embedToWorld() {
		throw new Error('embedToWorld is not implemented')
	}
}

// ####
class HorizontalLine extends BaseItem {
	static height = 1

	canFall() {
		return this.y >= 1 && 
			this.world.get(this.y - 1, this.x) !== '#' &&
			this.world.get(this.y - 1, this.x + 1) !== '#' &&
			this.world.get(this.y - 1, this.x + 2) !== '#' &&
			this.world.get(this.y - 1, this.x + 3) !== '#'
	}

	canMoveRight() {
		return this.x + 4 < WORLD_WIDTH &&
			this.world.get(this.y, this.x + 4) !== '#'
	}

	canMoveLeft() {
		return this.x > 0 &&
			this.world.get(this.y, this.x - 1) !== '#'
	}

	embedToWorld() {
		this.world.set(this.y, this.x, '#')
		this.world.set(this.y, this.x + 1, '#')
		this.world.set(this.y, this.x + 2, '#')
		this.world.set(this.y, this.x + 3, '#')
	}
}

// .#.
// ###
// .#.
class Cross extends BaseItem {
	static height = 3 

	canFall() {
		return this.y >= 3 && 
			this.world.get(this.y - 2, this.x) != '#' &&
			this.world.get(this.y - 3, this.x + 1) != '#' &&
			this.world.get(this.y - 2, this.x + 2) != '#'
	}
	canMoveRight() {
		return this.x + 3 < WORLD_WIDTH &&
			this.world.get(this.y, this.x + 2) !== '#' &&
			this.world.get(this.y - 1, this.x + 3) !== '#' &&
			this.world.get(this.y - 2, this.x + 2) !== '#'
	}

	canMoveLeft() {
		return this.x > 0 &&
			this.world.get(this.y, this.x) !== '#' &&
			this.world.get(this.y - 1, this.x - 1) !== '#' &&
			this.world.get(this.y - 2, this.x) !== '#'
	}

	embedToWorld() {
		this.world.set(this.y, this.x + 1, '#')
		this.world.set(this.y - 1, this.x, '#')
		this.world.set(this.y - 1, this.x + 1, '#')
		this.world.set(this.y - 1, this.x + 2, '#')
		this.world.set(this.y - 2, this.x + 1, '#')
	}
}

// ..#
// ..#
// ###
class ReversedL extends BaseItem {
	static height = 3

	canFall() {
		return this.y >= 3 &&
			this.world.get(this.y - 3, this.x) !== '#' &&
			this.world.get(this.y - 3, this.x + 1) !== '#' &&
			this.world.get(this.y - 3, this.x + 2) !== '#'
	}

	canMoveRight() {
		return this.x + 3 < WORLD_WIDTH &&
			this.world.get(this.y, this.x + 3) !== '#' &&
			this.world.get(this.y - 1, this.x + 3) !== '#' &&
			this.world.get(this.y - 2, this.x + 3) !== '#'
	}

	canMoveLeft() {
		return this.x > 0 &&
			this.world.get(this.y, this.x + 1) !== '#' &&
			this.world.get(this.y - 1, this.x + 1) !== '#' &&
			this.world.get(this.y - 2, this.x - 1) !== '#'
	}

	embedToWorld() {
		this.world.set(this.y, this.x + 2, '#')
		this.world.set(this.y - 1, this.x + 2, '#')
		this.world.set(this.y - 2, this.x, '#')
		this.world.set(this.y - 2, this.x + 1, '#')
		this.world.set(this.y - 2, this.x + 2, '#')
	}
}

// #
// #
// #
// #
class VerticalLine extends BaseItem {
	static height = 4

	canFall() {
		return this.y >= 4 &&
			this.world.get(this.y - 4, this.x) !== '#'
	}

	canMoveRight() {
		return this.x + 1 < WORLD_WIDTH &&
			this.world.get(this.y, this.x + 1) !== '#' &&
			this.world.get(this.y - 1, this.x + 1) !== '#' &&
			this.world.get(this.y - 2, this.x + 1) !== '#' &&
			this.world.get(this.y - 3, this.x + 1) !== '#'
	}

	canMoveLeft() {
		return this.x > 0 &&
			this.world.get(this.y, this.x - 1) !== '#' &&
			this.world.get(this.y - 1, this.x - 1) !== '#' &&
			this.world.get(this.y - 2, this.x - 1) !== '#' &&
			this.world.get(this.y - 3, this.x - 1) !== '#'
	}

	embedToWorld() {
		this.world.set(this.y, this.x, '#')
		this.world.set(this.y - 1, this.x, '#')
		this.world.set(this.y - 2, this.x, '#')
		this.world.set(this.y - 3, this.x, '#')
	}
}

// ##
// ##
class Box extends BaseItem { 
	static height = 2

	canFall() {
		return this.y >= 2 &&
			this.world.get(this.y - 2, this.x) !== '#' &&
			this.world.get(this.y - 2, this.x + 1) !== '#'
	}

	canMoveRight() {
		return this.x + 2 < WORLD_WIDTH &&
			this.world.get(this.y, this.x + 2) !== '#' &&
			this.world.get(this.y - 1, this.x + 2) !== '#'
	}

	canMoveLeft() {
		return this.x > 0 &&
			this.world.get(this.y, this.x - 1) !== '#' &&
			this.world.get(this.y - 1, this.x - 1) !== '#'
	}

	embedToWorld() {
		this.world.set(this.y, this.x, '#')
		this.world.set(this.y, this.x + 1, '#')
		this.world.set(this.y - 1, this.x, '#')
		this.world.set(this.y - 1, this.x + 1, '#')
	}

}

class Orderer {
	order = [HorizontalLine, Cross, ReversedL, VerticalLine, Box]
	index = 0

	getNext() {
		let item = this.order[this.index % this.order.length]
		this.index++
		return item
	}
}

class Gas {
	pattern = pattern
	index = 0

	getNext() {
		let item = this.pattern[this.index % this.pattern.length]
		this.index++
		return item
	}
}

class WorldMap {
	offset = 0
	world = []
	adjustmentCounter = 0
	adjustmentRate = 10000000
	newLine = new Array(WORLD_WIDTH).fill('.')

	constructor() {
		this.world = new Array(BASE_Y)
			.fill(undefined)
			.map(_ => new Array(WORLD_WIDTH).fill('.'))
	}

	getLine(y) {
		return this.world[y - this.offset]
	}

	get(y, x) {
		return this.world[y - this.offset][x]
	}

	set(y, x, char) {
		this.world[y - this.offset][x] = char
	}

	length() {
		return this.offset + this.world.length
	}

	addLine() {
		this.world.push(this.newLine.slice())
	}

	removeLine() {
		this.world.pop()
	}

	adjustHeight() {
		// this.adjustmentCounter++
		// if (this.adjustmentCounter % this.adjustmentRate === 0) {
		// 	console.log('Adjustment...')
		// 	for (let i = this.world.length - 1; i >= 0; i--) {
		// 		if (this.world[i].join('') === '#######') {
		// 			this.offset += i
		// 			this.world.splice(0, i)
		// 			break;
		// 		}
		// 	}
		// }
	}

	toString() {
		return this.world.slice().reverse().map(line => `|${line.join('')}|`).join('\n') + '\n' +
			`offset: ${this.offset}` 
	}
}


let gas = new Gas()
let orderer = new Orderer()
let world = new WorldMap()

let rocks = 0
let maxY = -1
let activeItem = undefined
while(true) {
	if (activeItem == null) {
		const Item = orderer.getNext()

		const newWorldLength = maxY + Item.height + 4
		const diff = newWorldLength - world.length()
		if (diff > 0) {
			for (let i = 0; i < diff; i++) {
				world.addLine()
			}
		} else if (diff < 0) {
			for (let i = diff; i < 0; i++) {
				world.removeLine()
			}
		}
		activeItem = new Item(world)
	}
	const direction = gas.getNext()
	switch(direction) {
		case '>':
			if (activeItem.canMoveRight()) {
				activeItem.moveRight()
			}
			break
		case '<':
			if (activeItem.canMoveLeft()) {
				activeItem.moveLeft()
			}
			break
	}
	if (activeItem.canFall()) {
		activeItem.fall()
	} else {
		activeItem.embedToWorld()
		if (activeItem.y > maxY) {
			maxY = activeItem.y
		}
		activeItem = undefined

		world.adjustHeight()

		rocks++
		if (rocks % 100000 === 0) {
			console.log(rocks / MAX_ROCKS * 100)
		}
		if (rocks === MAX_ROCKS) {
			break
		}
	}
}

console.log(world.toString())
console.log(maxY + 1)

