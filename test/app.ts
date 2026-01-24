import { Panel } from ".."

const now = performance.now()
for (let index = 0; index < 1e4; index++) {
	Panel().addBindings({
		source_property_name: `[ f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{abs(-(#a + #b)) + 'abc'}'}'}'}'}'}'}'}'}'}'}'}'}'}'}'}'}'}'}'}#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{abs(-(#a + #b))}'}'}'}'}'}'}'}'}'}'}'}'}'}'}'}'}'}'}'}#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{abs(-(#a + #b))}'}'}'}'}'}'}'}'}'}'}'}'}'}'}'}'}'}'}'}#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{abs(-(#a + #b))}'}'}'}'}'}'}'}'}'}'}'}'}'}'}'}'}'}'}'}#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{f'#{abs(-(#a + #b))}'}'}'}'}'}'}'}'}'}'}'}'}'}'}'}'}'}'}'}' ]`,
		target_property_name: "#test",
	})
}
const end = performance.now()
console.log(end - now)
