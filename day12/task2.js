import { readFileSync } from 'node:fs'
import path from 'node:path'

let input = readFileSync('input.txt', 'utf8').trim()
// input = `Sabqponm
// abcryxxl
// accszExk
// acctuvwj
// abdefghi`

const heights = input.split('\n').map(line => line.split(''))

const n = heights.length
const m = heights[0].length

console.log('Dimensions:', n, m)

let startX = 0
let startY = 0
let endX = 0
let endY = 0

for (let i = 0; i < n; i++) {
	for (let j = 0; j < m; j++) {
		if (heights[i][j] === 'S') {
			startX = i
			startY = j
			heights[i][j] = 'a'
		}
		if (heights[i][j] === 'E') {
			endX = i
			endY = j
			heights[i][j] = 'z'
		}
	}
}

console.log('Start:', startX, startY)
console.log('End: ', endX, endY)

const ord = (char) => char.charCodeAt(0)

const canMove = (startHeight, endHeight) => ord(startHeight) - ord(endHeight) < 2

const visited = heights.map(line => line.map(() => false))
const paths = heights.map(line => line.map(() => Number.MAX_SAFE_INTEGER))

let queue = [[endX, endY, 0]]
visited[endX][endY] = true
let visitedCount = 0
while (queue.length != 0) {
	let [i, j, length] = queue.shift()
	if (heights[i][j] === 'a') {
		console.log('Answer:', length)
		process.exit(0)
	}
	paths[i][j] = length
	visitedCount++
	console.log('Progress:', visitedCount, '/', n*m)
	if (i > 0 && !visited[i - 1][j] && canMove(heights[i][j], heights[i - 1][j])) {
		visited[i - 1][j] = true
		queue.push([i - 1, j, length + 1])
	}
	if (i < n - 1 && !visited[i + 1][j] && canMove(heights[i][j], heights[i + 1][j])) {
		visited[i + 1][j] = true
		queue.push([i + 1, j, length + 1])
	}
	if (j > 0 && !visited[i][j - 1] && canMove(heights[i][j], heights[i][j - 1])) {
		visited[i][j - 1] = true
		queue.push([i, j - 1, length + 1])
	}
	if (j < m - 1 && !visited[i][j + 1] && canMove(heights[i][j], heights[i][j + 1])) {
		visited[i][j + 1] = true
		queue.push([i, j + 1, length + 1])
	}
}

// console.log(visited.map(line => line.map(item => item ? 'x' : 'o').join('')).join('\n'))
// console.log(paths[endX][endY])
// console.log(heights)