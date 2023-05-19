import { readFileSync } from 'node:fs'

const DEBUG = 0

const debugLog = (...args) => {
	if (DEBUG === 1) {
		console.log(...args)
	}
}

const parseIndex = (input) => +input.match(/\d+/)[0]

const parseStartingItems = (input) => 
	input
		.split(':')[1]
		.split(', ')
		.map(item => +item)

const parseOperation = (input) => {
	const operationRaw = input.split(':')[1].trim()

	const multiplyMatch = input.match(/new = old \* (\d+)/)
	if (multiplyMatch) {
		const argument = +multiplyMatch[1]
		return (old) => old * argument
	}

	const sumMatch = input.match(/new = old \+ (\d+)/)
	if (sumMatch) {
		const argument = +sumMatch[1]
		return (old) => old + argument
	}

	const squareMatch = input.match(/new = old \* old/)
	if (squareMatch) {
		return (old) => old * old
	}

	throw new Error(`Unknown operation: ${operationRaw}`)
}

const parseTest = (input) => +input.match(/Test: divisible by (\d+)/)[1]

const parseTestTrue = (input) => +input.match(/If true: throw to monkey (\d+)/)[1]

const parseTestFalse = (input) => +input.match(/If false: throw to monkey (\d+)/)[1]

const parseMonkey = (input) => {
	const [
		indexRaw,
		startingItemsRaw,
		operationRaw,
		testRaw,
		testTrueRaw,
		testFalseRaw,
	] = input.split('\n').map(line => line.trim())

	debugLog(input)

	const index = parseIndex(indexRaw)
	debugLog('index:', index)

	const items = parseStartingItems(startingItemsRaw)
	debugLog('starting items:', items)

	const operation = parseOperation(operationRaw)
	debugLog('operation:', operation.toString())

	const test = parseTest(testRaw)
	debugLog('test:', test)

	const testTrue = parseTestTrue(testTrueRaw)
	debugLog('test true:', testTrue)

	const testFalse = parseTestFalse(testFalseRaw)
	debugLog('test false:', testFalse)

	debugLog()
	return {
		index,
		items,
		operation,
		test,
		testTrue,
		testFalse,
		inspected: 0,
	}
}

const input = readFileSync('input.txt', 'utf8').trim()
const monkeyRaw = input.split(/\n\n/)
const monkeys = monkeyRaw.map(parseMonkey)

for (let round = 0; round < 20; round++) {
	debugLog(`=== Round ${round} ===`)
	for (let monkey of monkeys) {
		debugLog(`Monkey ${monkey.index}`)
		for (let item of monkey.items) {
			debugLog(`  Monkey inspects an item with a worry level of ${item}.`)
			monkey.inspected++;
			const newWorryLevel = monkey.operation(item)
			debugLog(`    Worry level is increased to ${newWorryLevel}`)
			const boredWorryLevel = Math.trunc(newWorryLevel / 3)
			debugLog(`    Monkey gets bored with item. Worry level is divided by 3 to ${boredWorryLevel}`)
			if (boredWorryLevel % monkey.test === 0) {
				debugLog(`    Current worry level is divisible by ${monkey.test}`)
				monkeys[monkey.testTrue].items.push(boredWorryLevel)
				debugLog(`    Item with worry level ${boredWorryLevel} is thrown to monkey ${monkey.testTrue}.`)
			} else {
				debugLog(`    Current worry level is not divisible by ${monkey.test}`)
				monkeys[monkey.testFalse].items.push(boredWorryLevel)
				debugLog(`    Item with worry level ${boredWorryLevel} is thrown to monkey ${monkey.testFalse}.`)
			}
		}
		monkey.items = []
		debugLog()
	}

	debugLog('=== Round result ===')
	for (let monkey of monkeys) {
		debugLog(`Monkey ${monkey.index}: ${monkey.items}`)
	}

	debugLog()
}

debugLog(`=== Task 1 results ===`)

const activeMonkeys = monkeys.sort((a, b) => a.inspected - b.inspected)
for (let monkey of monkeys) {
	console.log(`Monkey ${monkey.index} inspected items ${monkey.inspected} times.`)
}
