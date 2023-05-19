import { readFileSync } from 'node:fs'

let input = readFileSync('./input.txt', 'utf8').trim()
let lines = input.split('\n')
lines = [
	'$ cd /',
	'$ ls',
	'dir a',
	'14848514 b.txt',
	'8504156 c.dat',
	'dir d',
	'$ cd a',
	'$ ls',
	'dir e',
	'29116 f',
	'2557 g',
	'62596 h.lst',
	'$ cd e',
	'$ ls',
	'584 i',
	'$ cd ..',
	'$ cd ..',
	'$ cd d',
	'$ ls',
	'4060174 j',
	'8033020 d.log',
	'5626152 d.ext',
	'7214296 k',
]

const isCommand = (line) => line.startsWith('$')

const processCommand = (node, line) => {
	const [_, command, argument] = line.split(' ')
	switch (command) {
		case 'ls':
			return node
		case 'cd':
			switch (argument) {
				case '/':
					return node
				case '..':
					return node.parent
				default: 
					const newdir = {
						type: 'dir',
						name: argument,
						parent: node,
						children: []
					}
					node.children.push(newdir)
					return newdir
			}
		default: 
			throw new Error(`Unknown command: ${command}`)
	}
}

const processOutput = (node, line) => {
	if (line.startsWith('dir')) {
		return node
	}
	const [size, name] = line.split(' ')
	const newFile = {
		type: 'file',
		size: +size,
		name,
	}
	node.children.push(newFile)
	return node
}

const parseCommands = (tree, line) => {
	return isCommand(line)
		? processCommand(tree, line)
		: processOutput(tree, line)
}

const printTree = (node, prefix='') => {
	console.log(`${prefix}- ${node.name} (${node.type}, size=${node.size ?? '??'})`)
	if (node.type === 'file') {
		return
	}
	for (let child of node.children) {
		printTree(child, prefix+'  ')
	}
}

const root = {
	type: 'dir',
	name: '/',
	parent: undefined,
	children: []
}

lines.reduce(parseCommands, root)
// printTree(root)

const calculateSize = (node) => {
	if (node.type === 'file') {
		return node.size
	}
	node.size = node.children.map(calculateSize).reduce((acc, cur) => acc + cur)
	return node.size
}

calculateSize(root)
printTree(root)

// Task 1
console.log()
console.log('❤️‍🔥  Task 1')
const findSmallDirs = (node) => {
	if (node.type === 'file') {
		return []
	}
	if (node.size <= 100000) {
		return [node, ...node.children.map(findSmallDirs).reduce((acc, cur) => [...acc, ...cur])]
	}
	return node.children.map(findSmallDirs).reduce((acc, cur) => [...acc, ...cur])
}
const smallDirs = findSmallDirs(root)
console.log(smallDirs)
console.log(smallDirs.reduce((acc, cur) => acc + cur.size, 0))

// Task 2
console.log()
console.log('❤️‍🔥  Task 2')
const systemSize = 70000000
const requiredSize = 30000000
const occupiedSize = root.size
const freeSize = systemSize - occupiedSize
console.log('freeSize', freeSize)
const needToFreeSize = requiredSize - freeSize
console.log('needToFreeSize', needToFreeSize)

const findPossibleDirs = (node) => {
	if (node.type === 'file') {
		return []
	}
	return [
		...(node.size >= needToFreeSize ? [node] : []),
		...node.children.map(findPossibleDirs).reduce((acc, cur) => [...acc, ...cur])
	]
}
const possibleDirs = findPossibleDirs(root)
// console.log(possibleDirs)
const targetDir = possibleDirs.reduce((acc, cur) => acc.size < cur.size ? acc : cur)
console.log(targetDir)

