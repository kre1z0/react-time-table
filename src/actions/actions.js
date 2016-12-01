// ↓ http://momentjs.com/ ↓
// ↓ http://momentjs.com/timezone/ ↓
import moment from 'moment-timezone'
// ↓ https://github.com/github/fetch ↓
import 'whatwg-fetch'
// ↓ Константы ↓
import * as constants from '../constants/timetable'

// Принимает значение ползунка min + max
// Отдает стиль width и left для schedule
export function getScheduleStyle(object) {
  const cellWidth = 100 / 24 / 2
  const max = object.max
  const min = object.min
  const widthSchedule = (max - min + 1) * cellWidth
  const leftSchedule = cellWidth * min - 3
  return {
    scheduleWidth: `${widthSchedule}%`,
    scheduleLeft: `${leftSchedule}%`,
  }
}

// Принимает дату начального времени и конечного →
// отдает минимальное и максимальное значение ползунка
// 1 шаг слайдера → 30 минут → start,end строка
export function getInputRange(start, end) {
  const maxInput = ((moment(end) - moment(start).startOf('day')) / constants.HALF_HOUR)
  const valueBeforeStart = (moment(end) - moment(start)) / constants.HALF_HOUR
  const minInput = maxInput - valueBeforeStart
  return {
    min: minInput,
    max: maxInput,
  }
}
// ♰ нужно сделать валидацию на сервере что бы отправляло только дату с днями текущей недели  ♰
export function getSchedulesFromServer() {
  const url = './json/schedules.json'
  const formatDate = window.innerWidth < 767 === true ? 'h:mm' : constants.FORMAT_DATES
  return fetch(url)
    .then(response => response.json())
    .then((schedules) => {
      const array = []
      schedules.forEach((item) => {
        const itemId = item.id
        const values = getInputRange(item.start_at, item.end_at)
        const schedulesStyle = getScheduleStyle(values)

        const schedule = {
          id: itemId,
          start_at: moment(item.start_at).format(formatDate),
          end_at: moment(item.end_at).format(formatDate),
          weekDay: moment(item.start_at).format('dddd'),
          values,
          schedulesStyle,
        }
        array.push(schedule)
      })
      return array
    }).catch((error) => {
      console.log('parsing failed', error)
    })
}

export function deleteScheduleFromServer(id) {
  console.log('deleteScheduleFromServer ---->', id)
  const url = 'server'
  fetch(url, {
    method: 'post',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    body: 'foo=bar&lorem=ipsum',
  })
    .then(response => response.json())
    .then((data) => {
      console.log('Request succeeded with JSON response', data)
    })
    .catch((error) => {
      console.log('Request failed', error)
    })
}

export function fetchNewSchedule(schedule) {
  const url = 'server'
  const startOftheDay = moment().utc().isoWeekday(schedule.weekDay).startOf('day')
  const start = startOftheDay.add(schedule.values.min * 30, 'minutes').format()
  const end = startOftheDay.add((schedule.values.max * 30) - schedule.values.min * 30, 'minutes').format()
  const id = schedule.id
  console.log('fetchNewSchedule start_at ---->', start)
  console.log('fetchNewSchedule end_at ---->', end)
  console.log('fetchNewSchedule id ---->', id)
  fetch(url, {
    method: 'post',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    body: 'foo=bar&lorem=ipsum',
  })
    .then(response => response.json())
    .then((data) => {
      console.log('Request succeeded with JSON response', data)
    })
    .catch((error) => {
      console.log('Request failed', error)
    })
}

export function fetchEditscheduleFromServer(schedule) {
  const id = schedule.id
  const start = schedule.start_at
  const end = schedule.end_at
  console.log('fetchEditscheduleFromServer', schedule, id, start, end)
}

// валидация
// принимает массив schedules(рассписаний)
// ↓ отдает массив из начального и конечного значения schedules ↓
export const getInputValues = (schedules, weekDay, index) => {
  const array = []
  schedules.forEach((item) => {
    if (item.weekDay === weekDay) {
      array.push(item.values.min, item.values.max)
    }
  })
  array.sort((a, b) => a - b)
  const getMin =
    min =>
      (acc, val) =>
        val < acc && val > min
          ? val
          : acc
  const getMax =
    min =>
      (acc, val) =>
        val > acc && val < min
          ? val
          : acc

  const min = array.reduce(getMax(index), -Infinity)
  const max = array.reduce(getMin(index), +Infinity)
  const valueMin = min === -Infinity ? constants.INPUT_RANGE : min
  const valueMax = max === +Infinity ? constants.INPUT_RANGE_MAX_VALUE : max
  const values = {
    min: valueMin,
    max: valueMax - 1,
  }
  return values
}

