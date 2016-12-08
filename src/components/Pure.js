import React from 'react'
// https://github.com/JedWatson/classnames
import classNames from 'classnames'

export const WeekDays = () => {
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  return (
    <div className='week_days_block' >
      {
        weekdays.map(day =>
           (<div className='row' key={day} >
             <span className='vertical_align' >
               {day}
             </span>
           </div>),
        )
      }
    </div>
  )
}

export const Thead = (state) => {
  console.log('Thead', state)
  const celsAM = []
  const celsPM = []
  const cellsAmount = 13
  for (let i = 1; i < cellsAmount; i += 1) {
    const hoveredClassAM = classNames('cell', { hovered: state.indexSchedule === i })
    const hoveredClassPM = classNames('cell', { hovered: state.indexSchedule === i + 12 })
    celsAM.push(<span className={hoveredClassAM} key={`${i}${'AM'}`}>{i}
      <span className='header_scale'>AM</span></span>)
    celsPM.push(<span className={hoveredClassPM} key={`${i}${'PM'}`}>{i}
      <span className='header_scale'>PM</span></span>)
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
