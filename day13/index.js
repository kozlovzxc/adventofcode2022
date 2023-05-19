
import { readFileSync } from 'node:fs'

let input = readFileSync('input.txt', 'utf8').trim();
// input = `[1,1,3,1,1]
// [1,1,5,1,1]

// [[1],[2,3,4]]
// [[1],4]

// [9]
// [[8,7,6]]

// [[4,4],4,4]
// [[4,4],4,4,4]

// [7,7,7,7]
// [7,7,7]

// []
// [3]

// [[[]]]
// [[]]

// [1,[2,[3,[4,[5,6,7]]]],8,9]
// [1,[2,[3,[4,[5,6,0]]]],8,9]`

const isArray = Array.isArray

const zip = (arr1, arr2) => {
	let length = Math.max(arr1.length, arr2.length)
	return new Array(length).fill(undefined).map((_, i) => [arr1[i], arr2[i]])
}

const compare = (left, right, space = '') => {
	// console.log(`${space}Comparing`, left, right)
	if (right == null) {
		return -1
	}
	if (left == null) {
		return 1
	}
	if (!isArray(left) && !isArray(right)) {
		return right - left
	}
	if (isArray(left) && !isArray(right)) {
		return compare(left, [right], space + ' ')
	}
	if (!isArray(left) &&isArray(right)) {
		return compare([left], right, space + ' ')
	}
	const result = zip(left, right).reduce((acc, [left, right]) => acc !== 0 ? acc : compare(left, right, space + ' '), 0)
	return result !== 0 ? result : right.length - left.length
}


// Task 1
// let pairs = input
// 	.split('\n\n')
// 	.map(line => line.split('\n'))
// 	.map(([left, right]) => [JSON.parse(left),JSON.parse(right)])
// let comparsion = pairs.map(([left, right]) => compare(left, right, ''))
// console.log(comparsion)
// console.log(comparsion.reduce((acc, cur, curIndex) => cur > 0 ? acc + curIndex + 1 : acc, 0))

// Task 2
const origPairs = input
	.split('\n')
	.filter(line => line != '')
	.map(line => JSON.parse(line))
const pairs = [...origPairs, [[2]], [[6]]]
console.log(pairs)
const sortedPairs = pairs.slice().sort((a, b) => compare(b, a))
console.log(sortedPairs)

const index1 = sortedPairs.findIndex(item => JSON.stringify(item) === JSON.stringify([[2]])) + 1
const index2 = sortedPairs.findIndex(item => JSON.stringify(item) === JSON.stringify([[6]])) + 1


console.log(index1 * index2)