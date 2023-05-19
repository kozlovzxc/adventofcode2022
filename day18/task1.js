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

const coordinates = input
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

for (let i = 0; i < coordinates.length - 1; i++) {
	for (let j = i + 1; j < coordinates.length; j++) {
		if (areNeighbours(coordinates[i], coordinates[j])) {
			coordinates[i][3]--
			coordinates[j][3]--
		}
	}
}

console.log(coordinates)
const sum = coordinates.reduce((acc, [x1, y1, z1, sides]) => acc + sides, 0)
console.log(sum)
