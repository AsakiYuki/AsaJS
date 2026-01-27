import { Anchor, AnimationOffset, Easing, KeyframeSize, Panel } from ".."

const animation = AnimationOffset(
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

const panel = Panel({
	anchor: Anchor.BOTTOM_LEFT,
}).addAnimations(
	animation,
	KeyframeSize({
		from: [10, 10],
		to: [20, 20],
		duration: 0.3,
		easing: Easing.LINEAR,
	}),
)

console.log(animation, panel)
