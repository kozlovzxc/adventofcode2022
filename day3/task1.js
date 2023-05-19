import { readFileSync } from 'node:fs'

const file = readFileSync('./input.txt', 'utf8')
let lines = file.split('\n').filter(line => line != '')
// lines = [
// 	'vJrwpWtwJgWrhcsFMMfFFhFp',
// 	'jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL',
// 	'PmmdzqPrVvPwwTWBwg',
// 	'wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn',
// 	'ttgJtRGJQctTZtZT',
// 	'CrZsJsPPZsGzwwsLwLmpwMDw',
// ]

const isLowerCase = (char) => char === char.toLowerCase()

const getCharScore = (char) => 
	isLowerCase(char) ? 
	1 + char.charCodeAt(0) - 'a'.charCodeAt(0) :
	27 + char.charCodeAt(0) - 'A'.charCodeAt(0)

const intersection = (setA, setB) => {
  const _intersection = new Set();
  for (const elem of setB) {
    if (setA.has(elem)) {
      _intersection.add(elem);
    }
  }
  return _intersection;
}


const getCharIntersection = (str1, str2) => Array.from(intersection(new Set(str1), new Set(str2)).values())[0]

const getScore = (line) => 
	getCharScore(
		getCharIntersection(
			line.slice(0, line.length/2), 
			line.slice(line.length/2)
		)
	)


const result = lines
	.map(getScore)
	.reduce((acc, cur) => acc + cur)

console.log(result)