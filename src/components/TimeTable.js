import React, { Component, PropTypes } from 'react'
// http://momentjs.com/
// http://momentjs.com/timezone/
import moment from 'moment-timezone'
// https://github.com/JedWatson/classnames
import classNames from 'classnames'
// https://facebook.github.io/react/docs/animation.html
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { Thead, WeekDays } from './Pure'
import TimeZone from './TimeZone'
import Popup from './Popup'
// Actions     ↓
import * as actions from '../actions/actions'
// Константы    ↓
import * as constants from '../constants/timetable'

class TimeTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      schedules: [],
      popupIsOpen: false,
      indexSchedule: 0,
    }
    this.onClickSchedule = :: this.onClickSchedule
    this.onClickCreateNewSchedule = ::this.onClickCreateNewSchedule
    this.onClickDeleteAllSchedules = ::this.onClickDeleteAllSchedules
    this.deleteSchedule = ::this.deleteSchedule
    this.editSchedule = ::this.editSchedule
    this.createNewSchedule = ::this.createNewSchedule
    this.onMouseLeaveSchedule = ::this.onMouseLeaveSchedule
  }

  componentDidMount() {
    actions.getSchedulesFromServer().then(response => this.setState({ schedules: response }))
  }

  onClickSchedule(item) {
    console.log('onClickSchedule ---->', item)
    const component = this.popup
    const schedules = this.state.schedules
    const args = [schedules, item.weekDay, item.id, item.values.min, item.values.max]
    const validationValues = actions.getInputValuesForEdit(...args)
    console.log('validationValues', validationValues)
    component.setState({
      id: item.id,
      start_at: item.start_at,
      end_at: item.end_at,
      weekDay: item.weekDay,
      popupOpened: true,
      editingSchedule: true,
      validationValues,
      values: {
        min: item.values.min,
        max: item.values.max,
      },
    })
  }

  onClickDeleteAllSchedules(deleted) {
    const state = this.state
    const component = this.popup
    const schedulesEmpty = state.schedules.length > 0
    component.setState({
      deleteAllSchedules: schedulesEmpty,
      popupOpened: schedulesEmpty,
    })
    if (deleted === true) {
      this.setState({ schedules: [] })
    }
    actions.deleteAllScheduleFromServer(deleted)
  }

  onClickCreateNewSchedule(day, index) {
    console.log('onClickCreateNewSchedule ---->', day, index * 2)
    const inputRange = index * constants.INPUT_RANGE
    const component = this.popup
    const schedules = this.state.schedules
    const validationValues = actions.getInputValuesForNew(schedules, day, inputRange)
    const start = moment(inputRange * constants.HALF_HOUR)
    const end = moment(validationValues.max * constants.HALF_HOUR)

    console.log('inputValues', validationValues)
    console.log('start', start)
    console.log('end', end)
    const startTime = start.utc().format(constants.FORMAT_DATES)
    const endTime = end.utc().format(constants.FORMAT_DATES)

    console.log(startTime, endTime)
    component.setState({
      newSchedule: true,
      popupOpened: true,
      weekDay: day,
      start_at: startTime,
      end_at: endTime,
      validationValues,
      values: {
        min: inputRange,
        max: validationValues.max,
      },
    })
  }

  onMouseEnterSchedule(index) {
    if (window.innerWidth > 767) {
      this.setState({
        indexSchedule: index,
      })
    }
  }

  onMouseLeaveSchedule() {
    this.setState({
      indexSchedule: null,
    })
  }

  deleteSchedule(id) {
    const deleteSchedule = this.state.schedules.filter(item => item.id !== id)
    this.setState({ schedules: deleteSchedule })
    actions.deleteScheduleFromServer(id)
  }

  createNewSchedule(schedule) {
    console.log('createNewSchedule ---->', schedule)
    const newSchedule = this.state.schedules.slice()
    newSchedule.unshift(schedule)
    this.setState({ schedules: newSchedule })
    actions.fetchNewSchedule(schedule)
  }

  editSchedule(item) {
    console.log('editSchedule ---->', item)
    const state = this.state
    const prewStateArray = state.schedules.filter(obj => obj.id !== item.id)
    const copyArray = prewStateArray.slice()
    copyArray.push(item)
    this.setState({ schedules: copyArray })
    actions.fetchEditscheduleFromServer(item)
  }

  render() {
    const state = this.state
    console.log('STATE TIMETABLE --->', this.state)
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const buttonClass = classNames('btn_delete_all', { disabled: state.schedules.length === 0 })
    return (
      <div>
        <TimeZone />
        <div className='table_time_wrapper' >
          <div className='TableWidget' >
            <div className='timetable_header' >
              <h1>You what time for call?</h1>
              <button onClick={this.onClickDeleteAllSchedules} className={buttonClass} type='button' >
                Delete all
              </button>
              <div className='timetable_header-sub' >
                <h4>You will be available 140 hours</h4>
              </div>
            </div>
            <div className='time_table_body' >
              <WeekDays />
              <div className='table-flex' >
                <Thead {...this.state} />
                {
                  weekdays.map((day) => {
                    const cels = []
                    const schedules = []
                    const cellsAmount = 25
                    state.schedules.forEach((item) => {
                      if (item.weekDay === day) {
                        const scheduleStyle = {
                          width: item.schedulesStyle.scheduleWidth,
                          left: item.schedulesStyle.scheduleLeft,
                        }
                        schedules.push(
                          <div className='schedule' key={item.id}
                            onClick={() => this.onClickSchedule(item)}
                            style={scheduleStyle}
                          >
                            {item.start_at}
                            &ensp;-&ensp;{item.end_at}
                          </div>,
                        )
                      }
                    })
                    for (let i = 1; i < cellsAmount; i += 1) {
                      cels.push(
                        <div className='cell' key={`${day}${i}`} onClick={() => this.onClickCreateNewSchedule(day, i)}
                          onMouseEnter={() => this.onMouseEnterSchedule(i)}
                          onMouseLeave={this.onMouseLeaveSchedule}
                        >
                          <span className='circle' />
                        </div>,
                      )
                    }
                    return (
                      <div key={day} >
                        <div className='mobile_week_day' key={`${day} mobile`} >
                          <span className='line' >
                            {day}
                          </span>
                        </div>
                        <div className='row' >
                          <div className='cell' />
                          {cels}
                          <ReactCSSTransitionGroup
                            transitionName='example'
                            transitionEnterTimeout={1000}
                            transitionLeaveTimeout={1000}
                          >
                            {schedules}
                          </ReactCSSTransitionGroup>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
            <Popup editSchedule={this.editSchedule} deleteAllSchedules={this.onClickDeleteAllSchedules}
              createNewSchedule={this.createNewSchedule} deleteSchedule={this.deleteSchedule}
              ref={(c) => {
                this.popup = c
              }}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default TimeTable
