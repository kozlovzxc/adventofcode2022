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

const add = (a, b) => a + b
const minus = (a, b) => a - b
const multiply = (a, b) => a * b
const divide = (a, b) => a / b
const parseOperation = (line) => {
	switch(line) {
		case '+':
			return add
		case '-':
			return minus
		case '*':
			return multiply
		case '/':
			return divide
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

const findPath = () => {
	const queue = [
		[nodes['root'], 'root', []]
	]
	while (queue.length !== 0) {
		const [node, name, path] = queue.shift()
		if (name === 'humn') {
			return [...path, name]
		}
		if (node.arguments != null) {
			queue.push([
				nodes[node.arguments[0]],
				node.arguments[0],
				[...path, name]
			])
			queue.push([
				nodes[node.arguments[1]],
				node.arguments[1],
				[...path, name]
			])
		}
	}
}

execute(nodes['root'])
const humnPath = findPath()

const root = nodes['root']
const child1 = nodes[root.arguments[0]]
const child2 = nodes[root.arguments[1]]
const humn = nodes['humn']
// humn.value = 102400000
humn.value = 1
// humn.shift = -105900000
// let index = -1
// humn.value = 0
let start = 0
let end = Number.MAX_SAFE_INTEGER
while(true) {
	for (const nodeName of humnPath) {
		if (nodes[nodeName].arguments != null) {
			nodes[nodeName].value = undefined
		}
	}
	const mid = Math.trunc((start / 2 + end / 2))
	humn.value = mid
	execute(root)
	if (child1.value === child2.value){
		break
	}
	console.log(start, end, humn.value, child1.value - child2.value)
	if (child1.value > child2.value) {
		start = mid + 1
	} else {
		end = mid - 1
	}
}
console.log(humn.value)