import { Animation, AnimType } from ".."

const animation = new Animation(
	AnimType.OFFSET,
	{
		from: [0, 0],
		to: [100, 100],
	},
	123,
).setLoop(false)
