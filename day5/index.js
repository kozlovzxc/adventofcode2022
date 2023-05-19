import { readFileSync } from 'node:fs'

const file = readFileSync('./input.txt', 'utf8')
let lines = file.split('\n')
// lines = [
// '    [D]    ',
// '[N] [C]    ',
// '[Z] [M] [P]',
// ' 1   2   3 ',
// '',
// 'move 1 from 2 to 1',
// 'move 3 from 1 to 3',
// 'move 2 from 2 to 1',
// 'move 1 from 1 to 2',
// ]

const separatorIndex = lines.findIndex(item => item == '')
const cratesRaw = lines.slice(0, separatorIndex - 1)
const commandsRaw = lines.slice(separatorIndex + 1).filter(item => item != '')
// console.log(cratesRaw)
// console.log(commandsRaw)

const cratesReversed = cratesRaw.map(line => line
	.match(/(\[\w\]|   ) ?/g)
	.map(item => item[1])
)
// console.log(cratesReversed)

let crates = []
for (let i = 0; i < cratesReversed.length; i++) {
	for (let j = 0; j < cratesReversed[0].length; j++) {
		if (crates[j] == null) {
			crates[j] = []
		}
		crates[j][i] = cratesReversed[i][j]
	}
}
crates = crates.map(cratesLine => cratesLine.filter(crate => crate != ' '))
console.log(crates)

// move ${amount} ${fromIndex} ${toIndex}
const commands = commandsRaw
	.map(line => line
		.match(/move (\d+) from (\d+) to (\d+)/)
		.filter(item => item != null)
		.slice(1,4)
		.map(item => +item)
	)
console.log(commands)

console.log('---')

for (let command of commands) {
	let [amount, fromIndexRaw, toIndexRaw] = command
	const fromIndex = fromIndexRaw - 1
	const toIndex = toIndexRaw - 1

	const take = crates[fromIndex].slice(0, amount)
	crates[fromIndex] = crates[fromIndex].slice(amount)
	// Task1
	// crates[toIndex] = [...take.reverse(), ...crates[toIndex]]
	// Task 2
	crates[toIndex] = [...take, ...crates[toIndex]]
	console.log(crates)
}

const result = crates.map(crateLine => crateLine[0]).filter(item => item != null).join('')
console.log(result)
