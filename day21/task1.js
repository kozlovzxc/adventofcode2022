import { readFileSync } from 'node:fs' 

let input

input = `root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32`

input = readFileSync('input.txt', 'utf8')

const lines = input
	.trim()
	.split('\n')

const numberPattern = /\d+/
const operationPattern = /(\w+) ([+\-*/]) (\w+)/ 

const parseOperation = (line) => {
	switch(line) {
		case '+':
			return (a, b) => a + b
		case '-':
			return (a, b) => a - b
		case '*':
			return (a, b) => a * b
		case '/':
			return (a, b) => a / b
	}
}
const parseNodeValue = (line) => {
	if (line.match(numberPattern) != null) {
		return {
			value: +line
		}
	}
	const operationMatch = line.match(operationPattern)
	if (operationMatch != null) {
		const [name1, operationRaw, name2] = Array.from(operationMatch).slice(1)
		return {
			operation: parseOperation(operationRaw),
			arguments: [name1, name2]
		}
	}
}

const parseNode = (line) => {
	const [name, value] = line.split(':')
	return {
		[name]: parseNodeValue(value)
	}
}

const nodes = lines.reduce((acc, cur) => ({...acc, ...parseNode(cur)}), {})
console.log(nodes)

const execute = (node) => {
	if (node.value != null) {
		return node.value
	}
	const val0 = execute(nodes[node.arguments[0]])
	const val1 = execute(nodes[node.arguments[1]])
	const value = node.operation(val0, val1)
	node.value = value
	return value
}

const rootVal = execute(nodes['root'])
console.log(rootVal)