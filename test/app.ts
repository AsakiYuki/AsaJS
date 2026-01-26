import { AnimationSize } from ".."

const animation = AnimationSize(
	"smooth_loop",
	{
		to: [10, 10],
		duration: 1.5,
	},
	{
		to: [1, 1],
	},
	1,
	{
		from: [10, 10],
		to: [20, 20],
	},
	{
		to: [1, 1],
	},
).setLoop(true)

console.log(animation)
