import React, { PropTypes } from 'react'
// https://github.com/JedWatson/classnames
import classNames from 'classnames'

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
  const celsAM = []
  const celsPM = []
  const cellsAmount = 13
  console.log('thead', props)
  for (let i = 1; i < cellsAmount; i += 1) {
    const hoveredClassAM = classNames('cell', { hovered: props.indexSchedule === i })
    const hoveredClassPM = classNames('cell', { hovered: props.indexSchedule === i + 12 })
    celsAM.push(<span className={hoveredClassAM} key={`${i}${'AM'}`} >{i}
      <span className='header_scale' >AM</span></span>)
    celsPM.push(<span className={hoveredClassPM} key={`${i}${'PM'}`} >{i}
      <span className='header_scale' >PM</span></span>)
  }
  return (
    <div className='row header' >
      <span className='cell' >
        <span className='header_scale' />
      </span>
      {celsAM}
      {celsPM}
    </div>
  )
}

Thead.propTypes = {
  indexSchedule: PropTypes.number,
}
