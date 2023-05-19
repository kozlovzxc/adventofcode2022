import { readFileSync } from 'node:fs'

const file = readFileSync('./input.txt', 'utf8')
let lines = file.split('\n').filter(line => line != '')
// lines = [
// 	'2-4,6-8',
// 	'2-3,4-5',
// 	'5-7,7-9',
// 	'2-8,3-7',
// 	'6-6,4-6',
// 	'2-6,4-8',
// ]

// [['2-4', '6-8']]
const paris = lines.map(line => line.split(','))

const isOverlapping = ([range1, range2]) => {
	const [start1, end1] = range1.split('-').map(str => +str)
	const [start2, end2] = range2.split('-').map(str => +str)
	if (
		start2 <= start1 && end1 <= end2 ||
		start1 <= start2 && end2 <= end1
	) {
		return true
	}
	return false
}

const result = paris.filter(isOverlapping)
console.log(result.length)

const isOverlappingNew = ([range1, range2]) => {
	const [start1, end1] = range1.split('-').map(str => +str)
	const [start2, end2] = range2.split('-').map(str => +str)
	if (
		end1 < start2 ||
		end2 < start1
	) {
		return false
	}
	return true
}

const resultNew = paris.filter(isOverlappingNew)
console.log(resultNew.length)
