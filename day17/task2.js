import { readFileSync } from 'node:fs'

const BASE_Y = 4
const BASE_X = 2
const WORLD_WIDTH = 7
const MAX_ROCKS = 1000000000000

let pattern = readFileSync('input.txt', 'utf8').trim()
// pattern = '>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>'

class BaseItem {
	static height = undefined

	constructor(world) {
		this.world = world
		this.x = BASE_X
		this.y = world.length - 1
	}

	canFall() {
		throw new Error('fall is not implemented')
	}

	fall() {
		this.y--;
	}

	tryToFall() {
		if (this.canFall()) {
			this.fall()
		}
	}

	adjustDirection(direction) {
		switch(direction) {
			case '>':
				if (this.canMoveRight()) {
					this.moveRight()
				}
				break
			case '<':
				if (this.canMoveLeft()) {
					this.moveLeft()
				}
				break
		}
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
			this.world[this.y - 1][this.x] !== '#' &&
			this.world[this.y - 1][this.x + 1] !== '#' &&
			this.world[this.y - 1][this.x + 2] !== '#' &&
			this.world[this.y - 1][this.x + 3] !== '#'
	}

	canMoveRight() {
		return this.x + 4 < WORLD_WIDTH &&
			this.world[this.y][this.x + 4] !== '#'
	}

	canMoveLeft() {
		return this.x > 0 &&
			this.world[this.y][this.x - 1] !== '#'
	}

	embedToWorld() {
		this.world[this.y][this.x] = '#'
		this.world[this.y][this.x + 1] = '#'
		this.world[this.y][this.x + 2] = '#'
		this.world[this.y][this.x + 3] = '#'
	}
}

// .#.
// ###
// .#.
class Cross extends BaseItem {
	static height = 3 

	canFall() {
		return this.y >= 3 && 
			this.world[this.y - 2][this.x] != '#' &&
			this.world[this.y - 3][this.x + 1] != '#' &&
			this.world[this.y - 2][this.x + 2] != '#'
	}
	canMoveRight() {
		return this.x + 3 < WORLD_WIDTH &&
			this.world[this.y][this.x + 2] !== '#' &&
			this.world[this.y - 1][this.x + 3] !== '#' &&
			this.world[this.y - 2][this.x + 2] !== '#'
	}

	canMoveLeft() {
		return this.x > 0 &&
			this.world[this.y][this.x] !== '#' &&
			this.world[this.y - 1][this.x - 1] !== '#' &&
			this.world[this.y - 2][this.x] !== '#'
	}

	embedToWorld() {
		this.world[this.y][this.x + 1] = '#'
		this.world[this.y - 1][this.x] = '#'
		this.world[this.y - 1][this.x + 1] = '#'
		this.world[this.y - 1][this.x + 2] = '#'
		this.world[this.y - 2][this.x + 1] = '#'
	}
}

// ..#
// ..#
// ###
class ReversedL extends BaseItem {
	static height = 3

	canFall() {
		return this.y >= 3 &&
			this.world[this.y - 3][this.x] !== '#' &&
			this.world[this.y - 3][this.x + 1] !== '#' &&
			this.world[this.y - 3][this.x + 2] !== '#'
	}

	canMoveRight() {
		return this.x + 3 < WORLD_WIDTH &&
			this.world[this.y][this.x + 3] !== '#' &&
			this.world[this.y - 1][this.x + 3] !== '#' &&
			this.world[this.y - 2][this.x + 3] !== '#'
	}

	canMoveLeft() {
		return this.x > 0 &&
			this.world[this.y][this.x + 1] !== '#' &&
			this.world[this.y - 1][this.x + 1] !== '#' &&
			this.world[this.y - 2][this.x - 1] !== '#'
	}

	embedToWorld() {
		this.world[this.y][this.x + 2] = '#'
		this.world[this.y - 1][this.x + 2] = '#'
		this.world[this.y - 2][this.x] = '#'
		this.world[this.y - 2][this.x + 1] = '#'
		this.world[this.y - 2][this.x + 2] = '#'
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
			this.world[this.y - 4][this.x] !== '#'
	}

	canMoveRight() {
		return this.x + 1 < WORLD_WIDTH &&
			this.world[this.y][this.x + 1] !== '#' &&
			this.world[this.y - 1][this.x + 1] !== '#' &&
			this.world[this.y - 2][this.x + 1] !== '#' &&
			this.world[this.y - 3][this.x + 1] !== '#'
	}

	canMoveLeft() {
		return this.x > 0 &&
			this.world[this.y][this.x - 1] !== '#' &&
			this.world[this.y - 1][this.x - 1] !== '#' &&
			this.world[this.y - 2][this.x - 1] !== '#' &&
			this.world[this.y - 3][this.x - 1] !== '#'
	}

	embedToWorld() {
		this.world[this.y][this.x] = '#'
		this.world[this.y - 1][this.x] = '#'
		this.world[this.y - 2][this.x] = '#'
		this.world[this.y - 3][this.x] = '#'
	}
}

// ##
// ##
class Box extends BaseItem { 
	static height = 2

	canFall() {
		return this.y >= 2 &&
			this.world[this.y - 2][this.x] !== '#' &&
			this.world[this.y - 2][this.x + 1] !== '#'
	}

	canMoveRight() {
		return this.x + 2 < WORLD_WIDTH &&
			this.world[this.y][this.x + 2] !== '#' &&
			this.world[this.y - 1][this.x + 2] !== '#'
	}

	canMoveLeft() {
		return this.x > 0 &&
			this.world[this.y][this.x - 1] !== '#' &&
			this.world[this.y - 1][this.x - 1] !== '#'
	}

	embedToWorld() {
		this.world[this.y][this.x] = '#'
		this.world[this.y][this.x + 1] = '#'
		this.world[this.y - 1][this.x] = '#'
		this.world[this.y - 1][this.x + 1] = '#'
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

class Runner {
	constructor() {
		this.gas = new Gas()
		this.orderer = new Orderer()

		this.world = new Array(BASE_Y)
			.fill(undefined)
			.map(_ => new Array(WORLD_WIDTH).fill('.'))
	}

	runSimulation(rocksLimit) {
		let rocks = 0
		let maxY = -1
		let activeItem = undefined

		while(true) {
			if (activeItem == null) {
				const Item = this.orderer.getNext()
				const newWorldHeight = maxY + Item.height + 4
				this.adjustWorldHeight(newWorldHeight)
				activeItem = new Item(this.world)
			}
			const direction = this.gas.getNext()
			activeItem.adjustDirection(direction)
			if (activeItem.canFall()) {
				activeItem.fall()
			} else {
				activeItem.embedToWorld()
				if (activeItem.y > maxY) {
					maxY = activeItem.y
				}
				activeItem = undefined

				rocks++
				if (rocks === rocksLimit) {
					break
				}
			}
		}
		return this.world
	}

	runQuickSimulation(rocksLimit, offset, patternSize) {
		let rocks = 0
		let maxY = -1
		let activeItem = undefined

		let offsetRocks = 0
		let patternRocks = 0
		let patterns = 0
		let skipped = false

		while(true) {
			if (maxY === offset - 1) {
				offsetRocks = rocks
			}
			if (maxY === offset + patternSize - 1) {
				patternRocks = rocks - offsetRocks
			}
			if (!skipped && maxY > offset + patternSize - 1) {
				patterns = Math.trunc((rocksLimit - rocks - 1) / patternRocks)
				console.log('offsetRocks', offsetRocks)
				console.log('patternRocks', patternRocks)
				console.log('patterns', patterns)
				rocks += (patterns - 1) * patternRocks
				skipped = true
			}

			if (activeItem == null) {
				const Item = this.orderer.getNext()
				const newWorldHeight = maxY + Item.height + 4
				this.adjustWorldHeight(newWorldHeight)
				activeItem = new Item(this.world)
			}
			const direction = this.gas.getNext()
			activeItem.adjustDirection(direction)
			if (activeItem.canFall()) {
				activeItem.fall()
			} else {
				activeItem.embedToWorld()
				if (activeItem.y > maxY) {
					maxY = activeItem.y
				}
				activeItem = undefined

				rocks++
				if (rocks === rocksLimit) {
					break
				}
			}
		}
		console.log(maxY + (patterns - 1) * patternSize + 1)
		return this.world
	}
	

	adjustWorldHeight(newWorldHeight) {
		const diff = newWorldHeight - this.world.length
		if (diff > 0) {
			for (let i = 0; i < diff; i++) {
				this.world.push(new Array(WORLD_WIDTH).fill('.'))
			}
		} else if (diff < 0) {
			for (let i = diff; i < 0; i++) {
				this.world.pop()
			}
		}
	}
}


const tmpRunner = new Runner()
const tmpWorld = tmpRunner.runSimulation(10000)

const eq = (arr1, arr2) => {
	if (arr1.length !== arr2.length) {
		return false
	}
	for (let i = 0; i < arr1.length; i++) {
		if (arr1[i] !== arr2[i]) {
			return false
		}
	}
	return true
}

const PATTERN_LENGTH = 20
const findPattern = (arr) => {
	const maxLength = arr.length - PATTERN_LENGTH
	for (let offset = 0; offset < maxLength; offset++) {
		const arr1 = arr.slice(offset, offset + PATTERN_LENGTH)

		for (let offset2 = offset + 1; offset2 < maxLength; offset2++) {
			const arr2 = arr.slice(offset2, offset2 + PATTERN_LENGTH)
			if (eq(arr1, arr2)) {
				const patternSize = offset2 - offset
				const test1 = arr.slice(offset, offset2)
				const test2 = arr.slice(offset2, offset2 + patternSize)
				if (eq(test1, test2)) {
					return [offset, offset2 - offset]
				}
			}
		}
	}
}

const rows = tmpWorld.map(line => line.join(''))

const [offset, patternSize] = findPattern(rows)
console.log('offset',offset)
console.log('patternSize', patternSize)

const prodRunner = new Runner()
const world = prodRunner.runQuickSimulation(MAX_ROCKS, offset, patternSize)

