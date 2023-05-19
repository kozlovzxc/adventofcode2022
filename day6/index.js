import { readFileSync } from 'node:fs'

let input = readFileSync('./input.txt', 'utf8').trim()
// input = 'bvwbjplbgvbhsrlpgdmjqwftvncz'

const MARKER_LENGTH = 14
for (let i = MARKER_LENGTH; i < input.length; i++) {
	const uniqueSet = new Set(input.slice(i - MARKER_LENGTH, i))
	const unique = Array.from(uniqueSet.values())
	if (unique.length === MARKER_LENGTH) {
		console.log(i)
		process.exit(0)
	}
}
