import { readFileSync } from 'node:fs'

const file = readFileSync('./input.txt', 'utf8')
const calories = file.split('\n')

const elves = calories
	.reduce(
		({ elves, sum }, cur) => 
			cur === '' ? 
			{
				elves: [...elves, sum],
				sum: 0
			} :
			{
				elves,
				sum: sum + +cur
			}
		, 
		{ elves: [], sum: 0 }
	)
	.elves

const topCalories = elves.reduce(({ max, index}, cur, curIndex) => cur > max ? { max: cur, index: curIndex} : { max, index }, { max: -1, index: -1 })
console.log(JSON.stringify(topCalories, null, 4))

const topThreeCalories = elves.map((value, index) => [value, index]).sort(([v1, i1], [v2, i2]) => v2 - v1).slice(0, 3)
console.log(topThreeCalories)



