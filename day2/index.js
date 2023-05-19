import { readFileSync } from 'node:fs'

const file = readFileSync('./input.txt', 'utf8')
let lines = file.split('\n').filter(line => line != '')
// lines = [
// 	'A Y',
// 	'B X',
// 	'C Z',
// ]
const shapes = lines.map(line => line.split(' '))

const getShapeScore = (shape) => {
	switch (shape) {
		case 'X':
			return 1
		case 'Y':
			return 2
		case 'Z':
			return 3
		default:
			throw new Error('Unknown shape:' + shape)
	}
}

const getResultScore = (result) => {
	if (result < 0) {
		return 0
	} else if (result === 0) {
		return 3
	} else if (result > 0) {
		return 6
	}
}

/* Results table
 *    A  B  C
 * X  0 -1  1
 * Y  1  0 -1
 * Z -1  1  0
*/
const getResult = (shape1, shape2) => {
	if (shape1 === 'A' && shape2 === 'X') { return 0 }
	if (shape1 === 'A' && shape2 === 'Y') { return 1 }
	if (shape1 === 'A' && shape2 === 'Z') { return -1 }

	if (shape1 === 'B' && shape2 === 'X') { return -1 }
	if (shape1 === 'B' && shape2 === 'Y') { return 0 }
	if (shape1 === 'B' && shape2 === 'Z') { return 1 }

	if (shape1 === 'C' && shape2 === 'X') { return 1 }
	if (shape1 === 'C' && shape2 === 'Y') { return -1 }
	if (shape1 === 'C' && shape2 === 'Z') { return 0 }
}

const getTrueResult = (shape1, shape2) => {
	// Score table
	// Rock - 1
	// Paper - 2
	// Scissors - 3

	// Rock
	if (shape1 === 'A' && shape2 === 'X') { return 0 + 3 }
	if (shape1 === 'A' && shape2 === 'Y') { return 3 + 1 }
	if (shape1 === 'A' && shape2 === 'Z') { return 6 + 2}

	// Paper
	if (shape1 === 'B' && shape2 === 'X') { return 0 + 1}
	if (shape1 === 'B' && shape2 === 'Y') { return 3 + 2}
	if (shape1 === 'B' && shape2 === 'Z') { return 6 + 3}

	// Scissors
	if (shape1 === 'C' && shape2 === 'X') { return 0 + 2}
	if (shape1 === 'C' && shape2 === 'Y') { return 3 + 3}
	if (shape1 === 'C' && shape2 === 'Z') { return 6 + 1}
}

const result = shapes.reduce((acc, [shape1, shape2]) => acc + getShapeScore(shape2) + getResultScore(getResult(shape1, shape2)), 0)
console.log('result', result)

const trueResult = shapes.reduce((acc, [shape1, shape2]) => acc + getTrueResult(shape1, shape2), 0)
console.log('true result', trueResult)

