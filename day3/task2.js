import { group } from 'node:console'
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

const groups = lines
	.reduce(
		({ groups, group }, cur, curIndex) => 
			(curIndex + 1) % 3 === 0 ? 
			{ groups: [...groups, [...group, cur]], group: [] } :
			{ groups, group: [...group, cur]},
		{ groups: [], group: [] }
	)
	.groups

const isLowerCase = (char) => char === char.toLowerCase()

const getCharScore = (char) => 
	isLowerCase(char) ? 
	1 + char.charCodeAt(0) - 'a'.charCodeAt(0) :
	27 + char.charCodeAt(0) - 'A'.charCodeAt(0)

const intersect = (setA, setB) => {
  const _intersection = new Set();
  for (const elem of setB) {
    if (setA.has(elem)) {
      _intersection.add(elem);
    }
  }
  return _intersection;
}

const intersectMany = (...sets) => sets.reduce((acc, cur) => intersect(acc, cur))

const intersectStrings = (...strings) => 
	Array.from(
		intersectMany(
			...strings.map(string => new Set(string))
		)
		.values()
	)[0]

const getScore = (group) => 
	getCharScore(
		intersectStrings(
			...group
		)
	)

const result = groups
	.map(getScore)
	.reduce((acc, cur) => acc + cur)

console.log(result)