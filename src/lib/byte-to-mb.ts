const byteToMB = (bytes: number) => {
	if (bytes < 0) {
		return NaN
	}

	return Math.round((bytes / 1024 / 1024) * 100) / 100
}

export default byteToMB
