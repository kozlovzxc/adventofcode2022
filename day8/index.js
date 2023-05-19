import { readFileSync } from 'node:fs'

let input = readFileSync('./input.txt', 'utf8').trim()
// input = `30373
// 25512
// 65332
// 33549
// 35390`
let lines = input.split('\n')
let heights = lines.map(line => line.split('').map(item => +item))
console.log(heights)
console.log(`Dimensions: ${heights.length}x${heights[0].length}`)
const n = heights.length

let visible = heights.map((line, i) => line.map((height, j) => 
	i === 0 || 
	j === 0 || 
	i === n - 1 || 
	j === n - 1 || 
	undefined,
))
// console.log(visible)

const isVisibleTop = (targetHeight, i, j) => {
	return targetHeight > heights[i - 1][j] && (i === 1 || isVisibleTop(targetHeight, i - 1, j))
}

const isVisibleBottom = (targetHeight, i, j) => {
	return targetHeight > heights[i + 1][j] && (i === n - 2 || isVisibleBottom(targetHeight, i + 1, j))
}

const isVisibleLeft = (targetHeight, i, j) => {
	return targetHeight > heights[i][j - 1] && (j === 1 || isVisibleLeft(targetHeight, i, j - 1))
}

const isVisibleRight = (targetHeight, i, j) => {
	return targetHeight > heights[i][j + 1] && (j === n - 2 || isVisibleRight(targetHeight, i, j + 1))
}

const isVisible = (i, j) => {
	return isVisibleTop(heights[i][j], i, j) ||
		isVisibleBottom(heights[i][j], i, j) ||
		isVisibleLeft(heights[i][j], i, j) ||
		isVisibleRight(heights[i][j], i, j)
}

for (let i = 1; i < n - 1; i++) {
	for (let j = 1; j < n - 1; j++) {
		visible[i][j] = isVisible(i, j)
	}
}
// console.log(visible)

let totalCount = 0
for (let i = 0; i < n; i++) {
	for (let j = 0; j < n; j++) {
		if (visible[i][j]) {
			totalCount++;
		}
	}
}
// console.log(totalCount)

const getScoreTop = (targetHeight, i, j) => {
	return i === 0 
	? 0
	: targetHeight > heights[i - 1][j] 
	? 1 + getScoreTop(targetHeight, i - 1, j)
	: 1
}

const getScoreBottom = (targetHeight, i, j) => 
	i === n - 1
	? 0
	: targetHeight > heights[i + 1][j] 
	? 1 + getScoreBottom(targetHeight, i + 1, j)
	: 1 

const getScoreLeft = (targetHeight, i, j) => 
	j === 0
	? 0
	: targetHeight > heights[i][j - 1] 
	? 1 + getScoreLeft(targetHeight, i, j - 1)
	: 1

const getScoreRight = (targetHeight, i, j) => 
	j === n - 1 
	? 0
	: targetHeight > heights[i][j + 1] 
	? 1 + getScoreRight(targetHeight, i, j + 1)
	: 1

const getScore = (i, j) => getScoreTop(heights[i][j], i, j) *
	getScoreBottom(heights[i][j], i, j) *
	getScoreLeft(heights[i][j], i, j) *
	getScoreRight(heights[i][j], i, j)

const score =  heights.map((line, i) => line.map((height, j) => 0))
for (let i = 0; i < n; i++) {
	for (let j = 0; j < n; j++) {
		score[i][j] = getScore(i, j)
	}
}

// console.log(score)

let maxScore = 0
for (let i = 0; i < n; i++) {
	for (let j = 0; j < n; j++) {
		if (visible[i][j]) {
			if (score[i][j] > maxScore) {
				maxScore = score[i][j]
			}
		}
	}
}
console.log(maxScore)


