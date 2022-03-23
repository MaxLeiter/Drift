// Modified from https://gist.github.com/IbeVanmeenen/4e3e58820c9168806e57530563612886
// which is based on https://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site

const epochs = [
  ["year", 31536000],
  ["month", 2592000],
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
  ["second", 1]
] as const

// Get duration
const getDuration = (timeAgoInSeconds: number) => {
  for (let [name, seconds] of epochs) {
    const interval = Math.floor(timeAgoInSeconds / seconds)

    if (interval >= 1) {
      return {
        interval: interval,
        epoch: name
      }
    }
  }

  return {
    interval: 0,
    epoch: "second"
  }
}

// Calculate
const timeAgo = (date: Date) => {
  const timeAgoInSeconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000
  )
  const { interval, epoch } = getDuration(timeAgoInSeconds)
  const suffix = interval === 1 ? "" : "s"

  return `${interval} ${epoch}${suffix} ago`
}

export default timeAgo
