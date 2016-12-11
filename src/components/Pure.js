import React, { PropTypes } from 'react'
// https://github.com/JedWatson/classnames
import classNames from 'classnames'
// Константы    ↓
import * as constants from '../constants/timetable'

export const WeekDays = props =>
  (
    <div className='week_days_block' >
      {
        props.weekdays.map(day =>
          (<div className='row' key={day} >
            <span className='vertical_align' >
              {day}
            </span>
          </div>),
        )
      }
    </div>
  )

WeekDays.propTypes = {
  weekdays: PropTypes.array,
}

export const Thead = (props) => {
  console.log('thead', props)
  const cellsAM = Array.from({ length: constants.HOURS_PER_DAY / 2 }, (_, i) => {
    const index = i + 1
    const hoveredClassAM = classNames('cell', { hovered: props.indexSchedule === index })
    return (<div className={hoveredClassAM} key={`${i}${'AM'}`} >{index}
      <span className='header_scale' >AM</span>
    </div>)
  })
  const cellsPM = Array.from({ length: constants.HOURS_PER_DAY / 2 }, (_, i) => {
    const index = i + 1
    const hoveredClassPM = classNames('cell', { hovered: props.indexSchedule === index + 12 })
    return (<div className={hoveredClassPM} key={`${i}${'PM'}`} >{index}
      <span className='header_scale' >PM</span>
    </div>)
  })
  return (
    <div className='row header' >
      <div className='cell' >
        <span className='header_scale' />
      </div>
      {cellsAM}
      {cellsPM}
    </div>
  )
}

Thead.propTypes = {
  indexSchedule: PropTypes.number,
}
