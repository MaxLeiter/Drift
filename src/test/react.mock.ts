jest.mock("react", () => {
	const ActualReact = jest.requireActual("react")

	return {
		...ActualReact,
		cache: jest.fn((fn) => {
			return fn()
		})
	}
})

export {}
