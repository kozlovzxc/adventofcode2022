import { readFileSync } from 'node:fs'

let input = readFileSync('input.txt', 'utf8').trim()

// input = `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
// Valve BB has flow rate=13; tunnels lead to valves CC, AA
// Valve CC has flow rate=2; tunnels lead to valves DD, BB
// Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
// Valve EE has flow rate=3; tunnels lead to valves FF, DD
// Valve FF has flow rate=0; tunnels lead to valves EE, GG
// Valve GG has flow rate=0; tunnels lead to valves FF, HH
// Valve HH has flow rate=22; tunnel leads to valve GG
// Valve II has flow rate=0; tunnels lead to valves AA, JJ
// Valve JJ has flow rate=21; tunnel leads to valve II`

let lines = input.split('\n')

class Node {
    constructor(name, rate, links = []) {
        this.name = name
        this.rate = rate
        this.links = links
    }
}

let nodesDict = {}

// Build nodes
for (let line of lines) {
    const matcher = /Valve ([^ ]+) has flow rate=(\d+); tunnels? leads? to valves? .*/
    let [name, rate] = Array.from(line.match(matcher)).slice(1, 3)
    const node = new Node(name, +rate)
    nodesDict[name] = node
}

// Set links
for (let line of lines) {
    const matcher = /Valve ([^ ]+) has flow rate=\d+; tunnels? leads? to valves? (.*)/
    let [name, rawLinks] = Array.from(line.match(matcher)).slice(1, 3)
    let links = rawLinks.split(', ')
    for (let link of links) {
        nodesDict[name].links.push(nodesDict[link])
    }
}

let nodes = Object.values(nodesDict)

// console.log(nodes)

// Search for distances
const getNodeDistance = (node1, node2) => {
    let visited = []
    let queue = [[node1, 0]]
    while (queue.length) {
        const [node, len] = queue.shift()
        visited.push(node)
        if (node.name === node2.name) {
            return len
        }
        for (let link of node.links) {
            if (visited.includes(link)) {
                continue
            }
            queue.push([link, len + 1])
        }
    }
    return -1
}

const distances = {}
for (let node1 of nodes) {
    for (let node2 of nodes) {
        const distance = getNodeDistance(node1, node2)

        if (distances[node1.name] == null) {
            distances[node1.name] = {}
        }
        distances[node1.name][node2.name] = distance

        if (distances[node2.name] == null) {
            distances[node2.name] = {}
        }
        distances[node2.name][node1.name] = distance
    }
}

// console.log(distances)

const limit = 26

const printPathScore = (path, score) => console.log(
    path.map(node => node.name).join(' -> '),
    score
)

const findBestScore = (node, availableNodes, score, leftTurns, path) => {
    const scores = [score]
    // printPathScore(path, score)
    for (let nextNode of availableNodes) {
        const nextDistance = distances[node.name][nextNode.name]
        if (nextDistance > leftTurns) {
            // printPathScore(path, score)
            continue
        }
        const nextTurns = leftTurns - nextDistance - 1
        const tmpScore = score + nextTurns * nextNode.rate
        const nextScore = findBestScore(
            nextNode,
            availableNodes.filter(node => node != nextNode),
            tmpScore,
            nextTurns,
            [...path, nextNode]
        )
        scores.push(nextScore)
    }
    return Math.max(...scores)
}

const startingNode = nodes.find(node => node.name === 'AA')
// console.log(startingNode)
const availableNodes = nodes.filter(node => node.rate !== 0)
// console.log(availableNodes)


let hash = (items) => items.map(node => node.name).sort().join('')

let combine = (array, length) => {
    const known = {}
    const results = []

    function combinator(left, right) {
        if (right.length === length) {
            let leftHash = hash(left)
            let rightHash = hash(right) 
            if (known[leftHash] || known[rightHash]) {
                return
            }
            known[leftHash] = true
            known[rightHash] = true
            results.push([right, left]);
            return;
        }
        for (let target of left) {
            combinator(
                left.filter(item => item !== target), 
                [...right, target]
            )
        }
    }
    combinator(array, []);
    return results
}

const baseLength = Math.trunc(availableNodes.length / 2)
const pairs = [
    ...combine(availableNodes, baseLength),
]

let max = 0
let i = 0
for (let [myNodes, elephantNodes] of pairs) {
    const score = findBestScore(startingNode, myNodes, 0, limit, []) +
        findBestScore(startingNode, elephantNodes, 0, limit, [])
    if (score > max) {
        max = score
    }
}
console.log(max)