import { readFileSync } from 'node:fs'

let input

input = `#.######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#`

input = readFileSync('input.txt', 'utf8')

class World {
	constructor(height, width) {
		this.height = height
		this.width = width
		this.blizzards = []
	}

	addStart(y, x) {
		this.startX = x
		this.startY = y
	}

	addEnd(y, x) {
		this.endX = x
		this.endY = y
	}

	addBlizzard(item) {
		this.blizzards.push(item)
	}

	turn() {
		this.blizzards.forEach(blizzard => blizzard.turn())
	}

	_getBlizzard(y, x) {
		return this.blizzards.find(blizzard => blizzard.x === x && blizzard.y === y)
	}

	getMap() {
		const map = Array.from({ length: this.height }).map(_ => Array.from({ length: this.width }))
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				if (
					x === this.startX && y === this.startY ||
					x === this.endX && y === this.endY
				) {
					map[y][x] = '.'
				} else if (
					x === 0 || 
					x === this.width-1 ||
					y === 0 ||
					y === this.height-1
				) {
					map[y][x] = '#'
				} else {
					const blizzard = this._getBlizzard(y, x)
					map[y][x] = blizzard != null ? blizzard.direction : '.'
				}
			}
		}
		return map
	}

	toString() {
		return this.getMap().map(line => line.join('')).join('\n')
	}
}

class Blizzard {
	constructor(y, x, direction, world) {
		this.x = x
		this.y = y
		this.direction = direction
		this.world = world
	}

	turn() {
		switch(this.direction) {
			case '^':
				this.y = this.y - 1
				if (this.y === 0) {
					this.y = this.world.height - 2
				}
				break
			case "v":
				this.y = this.y + 1
				if (this.y === this.world.height - 1) {
					this.y = 1
				}
				break
			case ">":
				this.x = this.x + 1
				if (this.x === this.world.width - 1) {
					this.x = 1
				}
				break
			case "<":
				this.x = this.x - 1
				if (this.x === 0) {
					this.x = this.world.width - 2
				}
				break
		}
	}
}

const lines = input.split('\n')
const world = new World(lines.length, lines[0].length)

for (let y = 0; y < lines.length; y++) {
	for (let x = 0; x < lines[y].length; x++) {
		if (y === 0 && lines[y][x] === '.') {
			world.addStart(y, x)
		}
		if (y === lines.length - 1 && lines[y][x] === '.') {
			world.addEnd(y, x)
		}
		if (lines[y][x].match(/[\^v><]/)) {
			const blizzard = new Blizzard(y, x, lines[y][x], world)
			world.addBlizzard(blizzard)
		}
	}
}

const getAvailableSpots = (world) => {
	const worldMap = world.getMap()
	const available = []
	for (let y = 0; y < world.height; y++) {
		for (let x = 0; x < world.width; x ++) {
			if (worldMap[y][x] === '.') {
				available.push([y, x])
			}
		}
	}
	return available.reverse()
}

const dummyLeastCommonMultipler = (a, b) => {
	let attempt = Math.max(a, b)
	while (true) {
		if (attempt % a === 0 && attempt % b === 0) {
			return attempt
		}
		attempt++
	}
}

const spotsPerTurn = [
	getAvailableSpots(world)
]
for (let i = 1; i < dummyLeastCommonMultipler(world.height - 2, world.width - 2); i++) {
	world.turn()
	const available = getAvailableSpots(world)
	spotsPerTurn.push(available)
}

const solve = (startY, startX, endY, endX, turn) => {
	const cache = {}
	let queue = [[startY, startX, turn]]
	while(queue.length !== 0) {
		let [y, x, turn] = queue.shift() 
		const key = `${y}_${x}_${turn % spotsPerTurn.length}`
		if (cache[key] != null) {
			continue
		} 
		cache[key] = true
		if (y === endY && x === endX) {
			return turn
		}
		const spots = spotsPerTurn[(turn + 1) % spotsPerTurn.length]
		for (const [spotY, spotX] of spots) {
			if (
				spotX === x && Math.abs(y - spotY) < 2 ||
				spotY === y && Math.abs(x - spotX) < 2
			) {
				queue.push([spotY, spotX, turn + 1])
			}
		}
	}
}

// task 1
const startToEnd = solve(world.startY, world.startX, world.endY, world.endX, 0)
console.log(startToEnd)

// task 2
const endToStart = solve(world.endY, world.endX, world.startY, world.startX, startToEnd)
console.log(endToStart)

const startToEnd1 = solve(world.startY, world.startX, world.endY, world.endX, endToStart)
console.log(startToEnd1)
