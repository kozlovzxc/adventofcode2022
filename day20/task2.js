import { readFileSync } from 'node:fs'

let input = readFileSync('input.txt', 'utf8').trim()

// input = `1
// 2
// -3
// 3
// -2
// 0
// 4`

let data = input
	.split('\n')
	.map((value, index) => ({
		index,
		value: +value,
	}))
	.map(({index, value}) => ({ index, value: value * 811589153 }))

const shift = (index, shift, arr) => {
	let nextIndex = ((index + shift) % (arr.length - 1) + arr.length - 1) % (arr.length -1)
	// console.log(`${index} -> ${nextIndex}`)
	if (nextIndex > index) {
		return [
			...arr.slice(0, index),
			...arr.slice(index + 1, nextIndex+1),
			arr[index],
			...arr.slice(nextIndex+1)
		]
	} else {
		return [
			...arr.slice(0, nextIndex),
			arr[index],
			...arr.slice(nextIndex, index),
			...arr.slice(index + 1)
		]
	}
}

for (let repeat = 0; repeat < 10; repeat++) {
	for (let i = 0; i < data.length; i++) {
		const currentIndex = data.findIndex(item => item.index === i)
		const currentItem = data[currentIndex]
		data = shift(currentIndex, currentItem.value, data)
	}
}

const zeroIndex = data.findIndex(item => item.value === 0)
console.log(
	data[(zeroIndex + 1000) % data.length].value +
	data[(zeroIndex + 2000) % data.length].value +
	data[(zeroIndex + 3000) % data.length].value
)
