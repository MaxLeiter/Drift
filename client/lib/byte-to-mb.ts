const byteToMB = (bytes: number) =>
	Math.round((bytes / 1024 / 1024) * 100) / 100

export default byteToMB
