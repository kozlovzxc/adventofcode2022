import { readFileSync } from 'node:fs'

let input = readFileSync('input.txt', 'utf8').trim()

// input = `2,2,2
// 1,2,2
// 3,2,2
// 2,1,2
// 2,3,2
// 2,2,1
// 2,2,3
// 2,2,4
// 2,2,6
// 1,2,5
// 3,2,5
// 2,1,5
// 2,3,5`

const rockCoordinates = input
	.split('\n')
	.map(line => line
		.split(',')
		.map(item => +item)
	)
	.map(item => [...item, 6])

const areNeighbours = ([x1, y1, z1], [x2, y2, z2]) => {
	return x1 === x2 && y1 === y2 && Math.abs(z1 - z2) === 1 ||
		x1 === x2 && z1 === z2 && Math.abs(y1 - y2) === 1 ||
		y1 === y2 && z1 === z2 && Math.abs(x1 - x2) === 1
}

let minX = Number.MAX_SAFE_INTEGER
let minY = Number.MAX_SAFE_INTEGER
let minZ = Number.MAX_SAFE_INTEGER
let maxX = Number.MIN_SAFE_INTEGER
let maxY = Number.MIN_SAFE_INTEGER
let maxZ = Number.MIN_SAFE_INTEGER
for (let i = 0; i < rockCoordinates.length - 1; i++) {
	const [x, y, z] = rockCoordinates[i]
	if (x < minX) minX = x
	if (y < minY) minY = y
	if (z < minZ) minZ = z
	if (x > maxX) maxX = x
	if (y > maxY) maxY = y
	if (z > maxZ) maxZ = z
}
minX--
maxX++
minY--
maxY++
minZ--
maxZ++

console.log('Creating World:')
console.log(`${minX} <= x <= ${maxX}`)
console.log(`${minY} <= y <= ${maxY}`)
console.log(`${minZ} <= z <= ${maxZ}`)
const worldMap = {}
for (let x = minX; x <= maxX; x++) {
	for (let y = minY; y <= maxY; y++) {
		for (let z = minZ; z <= maxZ; z++) {
			if (worldMap[x] == null) worldMap[x] = {}
			if (worldMap[x][y] == null) worldMap[x][y] = {}
			worldMap[x][y][z] = { type: 'air', visited: false, open: undefined }
		}
	}
}

for (let [x, y, z] of rockCoordinates) {
	worldMap[x][y][z] = { ...worldMap[x][y][z], type: 'rock' }
}

const isOnBoarder = (x, y, z) => x === minX ||
	x === maxX ||
	y === minY ||
	y === maxY ||
	z === minZ ||
	z === maxZ

const getNode = (x, y, z) => {
	if (worldMap[x] == null) {
		return undefined
	}
	if (worldMap[x][y] == null) {
		return undefined
	}
	return worldMap[x][y][z]
}

const getNeigbours = (x, y, z) => [
	[x+1, y, z, getNode(x+1, y, z)],
	[x-1, y, z, getNode(x-1, y, z)],

	[x, y+1, z, getNode(x, y+1, z)],
	[x, y-1, z, getNode(x, y-1, z)],

	[x, y, z+1, getNode(x, y, z+1)],
	[x, y, z-1, getNode(x, y, z-1)],
]
	.filter(([x, y, z, details]) => details != null)

const anyExposed = (nodes) => nodes.reduce((acc, cur) => acc || cur[3].exposed, false)

let queue = [
	[minX, minY, minZ, getNode(minX, minY, minZ)]
]
while (queue.length !== 0) {
	const [x, y, z, node] = queue.shift()
	if (node.visited) {
		continue
	}
	node.visited = true

	const neigbours = getNeigbours(x, y, z)
	const nextNeighbours = neigbours.filter(([x, y, z, node]) => !node.visited && node.type === 'air')
	queue = [...queue, ...nextNeighbours]

	if (
		isOnBoarder(x, y, z) ||
		anyExposed(neigbours)
	) {
		node.exposed = true
		continue
	}
}

let sum = 0
for(let [x, y, z] of rockCoordinates) {
	let neighbours = getNeigbours(x, y, z)
	let base = 6
	for (let neighbour of neighbours) {
		const details = neighbour[3]
		if (details.type === 'rock' || details.type === 'air' && !details.exposed) {
			base--
		}
	}
	sum += base
}
console.log(sum)

