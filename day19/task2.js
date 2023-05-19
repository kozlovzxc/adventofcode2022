import { readFileSync } from 'node:fs'

let input = readFileSync('input.txt', 'utf8')

// Blueprint 1:
//   Each ore robot costs 4 ore.
//   Each clay robot costs 2 ore.
//   Each obsidian robot costs 3 ore and 14 clay.
//   Each geode robot costs 2 ore and 7 obsidian.
// input = `Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
// Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.`


const blueprintPattern = /Blueprint \d+: Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./
let blueprints = input
	.trim()
	.split('\n')
	.map(line => {
		const parsed = line.match(blueprintPattern)
		return {
			oreRobotCostOre: +parsed[1],
			clayRobotCostOre: +parsed[2],
			obsidianRobotCostOre: +parsed[3],
			obsidianRobotCostClay: +parsed[4],
			geodeRobotCostOre: +parsed[5],
			geodeRobotCostObsidian: +parsed[6]
		}
	})

const estimateBlueprint = (
	{
		oreRobotCostOre, 
		clayRobotCostOre,
		obsidianRobotCostOre,
		obsidianRobotCostClay,
		geodeRobotCostOre,
		geodeRobotCostObsidian,
	}, 
	maxSteps
) => {
	let step = 0

	const maxObsidianRobots = Math.max(geodeRobotCostObsidian) * 1.5
	const maxClayRobots = Math.max(obsidianRobotCostClay) * 1.5
	const maxOreRobots = Math.max((geodeRobotCostOre, obsidianRobotCostOre, oreRobotCostOre)) * 1.5

	const simulation = ({ 
		ore,
		oreRobots,
		clay,
		clayRobots,
		obsidian,
		obsidianRobots,
		geode,
		geodeRobots,
		turns,
	}) => {
		if (turns === 0) {
			step++
			// console.log(
			// 	ore,
			// 	oreRobots,
			// 	clay,
			// 	clayRobots,
			// 	obsidian,
			// 	obsidianRobots,
			// 	geode,
			// 	geodeRobots,
			// )
			return geode
		}

		// going to build ore robot
		let geode1 = 0
		const turnsToMineOreRobot = Math.max(
			0,
			Math.ceil((oreRobotCostOre - ore) / oreRobots)
		) + 1
		if (turnsToMineOreRobot <= turns && oreRobots < maxOreRobots) {
			geode1 = simulation({
				ore: ore + turnsToMineOreRobot * oreRobots - oreRobotCostOre,
				oreRobots: oreRobots + 1,
				clay: clay + turnsToMineOreRobot * clayRobots,
				clayRobots,
				obsidian: obsidian + turnsToMineOreRobot * obsidianRobots,
				obsidianRobots,
				geode: geode + turnsToMineOreRobot * geodeRobots,
				geodeRobots,
				turns: turns - turnsToMineOreRobot
			})
		}

		// going to build clay robot
		let geode2 = 0
		const turnsToMineClayRobot = Math.max(
			0,
			Math.ceil((clayRobotCostOre - ore) / oreRobots)
		) + 1
		if (turnsToMineClayRobot <= turns && clay < maxClayRobots) {
			geode2 = simulation({
				ore: ore + turnsToMineClayRobot * oreRobots - clayRobotCostOre,
				oreRobots,
				clay: clay + turnsToMineClayRobot * clayRobots,
				clayRobots: clayRobots + 1,
				obsidian: obsidian + turnsToMineClayRobot * obsidianRobots,
				obsidianRobots,
				geode: geode + turnsToMineClayRobot * geodeRobots,
				geodeRobots,
				turns: turns - turnsToMineClayRobot
			})
		}

		// going to build obsidian robot
		let geode3 = 0
		if (clayRobots > 0) {
			const turnsToMineObsidianRobot = Math.max(
				0,
				Math.ceil((obsidianRobotCostOre - ore) / oreRobots),
				Math.ceil((obsidianRobotCostClay - clay) / clayRobots),
			) + 1
			if (turnsToMineObsidianRobot <= turns && obsidian < maxObsidianRobots) {
				geode3 = simulation({
					ore: ore + turnsToMineObsidianRobot * oreRobots - obsidianRobotCostOre,
					oreRobots,
					clay: clay + turnsToMineObsidianRobot * clayRobots - obsidianRobotCostClay, 
					clayRobots,
					obsidian: obsidian + turnsToMineObsidianRobot * obsidianRobots,
					obsidianRobots: obsidianRobots + 1,
					geode: geode + turnsToMineObsidianRobot * geodeRobots,
					geodeRobots,
					turns: turns - turnsToMineObsidianRobot
				})
			}
		}

		// going to build geode robot
		let geode4 = 0
		if (obsidianRobots > 0) {
			const turnsToMineGeodeRobot = Math.max(
				0,
				Math.ceil((geodeRobotCostOre - ore) / oreRobots),
				Math.ceil((geodeRobotCostObsidian - obsidian) / obsidianRobots),
			)

			if (turnsToMineGeodeRobot < turns) {
				const newOre = ore + turnsToMineGeodeRobot * oreRobots
				const newObsidian = obsidian + turnsToMineGeodeRobot * obsidianRobots
				const canBuild = Math.min(
					Math.trunc(newOre / geodeRobotCostOre),
					Math.trunc(newObsidian / geodeRobotCostObsidian),
				)
				geode4 = simulation({
					ore: ore + (turnsToMineGeodeRobot + canBuild) * oreRobots - canBuild * geodeRobotCostOre,
					oreRobots,
					clay: clay + (turnsToMineGeodeRobot + canBuild) * clayRobots, 
					clayRobots,
					obsidian: obsidian + (turnsToMineGeodeRobot + canBuild) * obsidianRobots - canBuild * geodeRobotCostObsidian,
					obsidianRobots,
					geode: geode + (turnsToMineGeodeRobot + canBuild) * geodeRobots + canBuild * (canBuild - 1) / 2,
					geodeRobots: geodeRobots + canBuild,
					turns: turns - (turnsToMineGeodeRobot + canBuild)
				})
			}
		}

		let geodeChill = 0
		if (turns > 0.7 * maxSteps) {
			// going to just chill
			geodeChill = simulation({
				ore: ore + turns * oreRobots,
				oreRobots,
				clay: clay + turns * clayRobots,
				clayRobots,
				obsidian: obsidian + turns * obsidianRobots,
				obsidianRobots,
				geode: geode + turns * geodeRobots,
				geodeRobots,
				turns: 0
			})
		}

		return Math.max(
			geodeChill, 
			geode1, 
			geode2,
			geode3,
			geode4
		)
	}

	const result = simulation({
		ore: 0,
		oreRobots: 1,
		clay: 0,
		clayRobots: 0,
		obsidian: 0,
		obsidianRobots: 0,
		geode: 0,
		geodeRobots: 0,
		turns: maxSteps,
	})

	console.log(`steps=${step}`)		
	return result
}

// const task1 = blueprints
// 	.map((blueprint, index) => estimateBlueprint(blueprint, 24) * (index + 1))
// 	.reduce((acc, cur) => acc + cur, 0)
// console.log(task1)

const task2 = blueprints
	.slice(0, 3)
	.map((blueprint, index) => estimateBlueprint(blueprint, 32))
	.reduce((acc, cur) => acc * cur, 1)
console.log(task2)
