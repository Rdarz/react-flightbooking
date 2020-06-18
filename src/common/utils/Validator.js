import moment from "moment"

export const timeCovertTo12hrs = time => {
  return moment(time, ["HH:mm"]).format("h:mm A")
}

export const timeDiff = (date, time1, time2) => {
  const convertedDate = date && date.split("/")
  const timeDateObj1 = new Date(
    convertedDate[0],
    convertedDate[1],
    convertedDate[2],
    time1 && time1.split(":")[0],
    time1 && time1.split(":")[1]
  )
  const timeDateObj2 = new Date(
    convertedDate[0],
    convertedDate[1],
    convertedDate[2],
    time2 && time2.split(":")[0],
    time2 && time2.split(":")[1]
  )
  const hoursDiff = Math.abs(
    timeDateObj1.getHours() - timeDateObj2.getHours()
  ).toFixed(2)
  const minDiff = Math.abs(
    timeDateObj1.getMinutes() - timeDateObj2.getMinutes()
  ).toFixed(2)

  return {
    hours: Math.floor(hoursDiff),
    minutes: Math.floor(minDiff),
    time: `${Math.floor(hoursDiff)}:${Math.floor(minDiff)}`
  }
}
