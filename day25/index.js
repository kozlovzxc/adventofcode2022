import { readFileSync } from "fs"

let input

input = `1=-0-2
12111
2=0=
21
2=01
111
20012
112
1=-1=
1-12
12
1=
122`

input = readFileSync('input.txt', 'utf8')

const lines = input.split('\n')

const charToDecimal = (char) => {
	switch(char) {
		case '2':
			return 2
		case '1':
			return 1
		case '0':
			return 0
		case '-':
			return -1
		case '=':
			return -2
	}
}

const _powersOfFive = [1]
const getPowerOfFive = (num) => {
	if (_powersOfFive[num] != null) {
		return _powersOfFive[num]
	}
	for (let i = _powersOfFive.length - 1; i <= num; i++) {
		_powersOfFive.push(_powersOfFive[_powersOfFive.length - 1] * 5)
	}
	return _powersOfFive[num]
}

const snafuToDecimal = (snafu) => {
	const chars = snafu.split('').reverse()
	return chars.reduce((acc, char, index) => acc + charToDecimal(char) * getPowerOfFive(index), 0)
}

const decimalToSnafu = (decimal) => {
	let result = ''
	let next = 0 
	while (true) {
		decimal += next
		let mod = decimal % 5
		let div = Math.trunc(decimal / 5)
		decimal = div

		if (mod < 3) {
			result += mod.toString()
			next = 0
		}
		if (mod === 3) {
			result += '='
			next = 1
		}
		if (mod === 4) {
			result += '-'
			next = 1
		}
		if (decimal === 0) {
			if (next === 1) {
				result += '1'
			}
			return result.split('').reverse().join('')
		}
	}
}

// console.log(snafuToDecimal('1=-0-2'), 1747)
// console.log(snafuToDecimal('12111'), 906)
// console.log(snafuToDecimal('2=0='), 198)
// console.log(snafuToDecimal('21'), 11)
// console.log(snafuToDecimal('2=01'), 201)
// console.log(snafuToDecimal('111'), 31)
// console.log(snafuToDecimal('20012'), 1257)
// console.log(snafuToDecimal('112'), 32)
// console.log(snafuToDecimal('1=-1='), 353)
// console.log(snafuToDecimal('1-12'), 107)
// console.log(snafuToDecimal('12'), 7)
// console.log(snafuToDecimal('1='), 3)
// console.log(snafuToDecimal('122'), 37)

// console.log(decimalToSnafu(1), '1')
// console.log(decimalToSnafu(2), '2')
// console.log(decimalToSnafu(3), '1=')
// console.log(decimalToSnafu(4), '1-')
// console.log(decimalToSnafu(5), '10')
// console.log(decimalToSnafu(6), '11')
// console.log(decimalToSnafu(7), '12')
// console.log(decimalToSnafu(8), '2=')
// console.log(decimalToSnafu(9), '2-')
// console.log(decimalToSnafu(10), '20')
// console.log(decimalToSnafu(15), '1=0')
// console.log(decimalToSnafu(20), '1-0')
// console.log(decimalToSnafu(2022), '1=11-2')
// console.log(decimalToSnafu(12345), '1-0---0')
// console.log(decimalToSnafu(314159265), '1121-1110-1=0')


const sum = lines
	.map(snafu => snafuToDecimal(snafu))
	.reduce((acc, cur) => acc + cur, 0)

console.log(decimalToSnafu(sum))
