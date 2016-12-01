import React, { Component, PropTypes } from 'react'
// http://momentjs.com/
// http://momentjs.com/timezone/
import moment from 'moment-timezone'
// https://facebook.github.io/react/docs/animation.html
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { Thead, WeekDays } from './Pure'
import TimeZone from './TimeZone'
import Popup from './Popup'
// Actions
import * as actions from '../actions/actions'
// ↓ Константы ↓
import * as constants from '../constants/timetable'

class Timetable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      schedules: [],
      popupIsOpen: false,
      // ↓ не трогать этот стейт, он в componentWillUpdate ↓
      disabled: false,
    }
    this.onClickSchedule = :: this.onClickSchedule
    this.onClickCreateNewSchedule = ::this.onClickCreateNewSchedule
    this.onClickDeleteAllSchedules = ::this.onClickDeleteAllSchedules
    this.deleteSchedule = ::this.deleteSchedule
    this.editSchedule = ::this.editSchedule
    this.createNewSchedule = ::this.createNewSchedule
  }
  componentDidMount() {
    actions.getSchedulesFromServer().then(response => this.setState({ schedules: response }))
  }
  componentWillUpdate(newProps, newState) {
    if (newState.schedules.length > 0) {
      newState.disabled = false
    } else {
      newState.disabled = true
    }
  }
  onClickSchedule(item) {
    console.log('onClickSchedule ---->', item)
    const component = this.popup
    component.setState({
      id: item.id,
      start_at: item.start_at,
      end_at: item.end_at,
      weekDay: item.weekDay,
      popupOpened: true,
      editingSchedule: true,
      validationValues: {
        min: 0,
        max: 48,
      },
      mobile: false,
      values: {
        min: item.values.min,
        max: item.values.max,
      },
    })
  }
  onClickDeleteAllSchedules(deleted) {
    const schedules = this.state.schedules
    if (schedules.length > 0) {
      const component = this.popup
      component.setState({
        deleteAllSchedules: true,
        popupOpened: true,
      })
      if (deleted === true) {
        this.setState({
          schedules: [],
        })
      }
    }
  }
  onClickCreateNewSchedule(day, index) {
    console.log('onClickCreateNewSchedule ---->', day, index * 2)
    const inputRange = index * constants.INPUT_RANGE
    const component = this.popup
    const schedules = this.state.schedules
    const inputValues = actions.getInputValues(schedules, day, inputRange)
    const start = moment(inputRange * constants.HALF_HOUR)
    const end = moment(inputValues.max * constants.HALF_HOUR)

    console.log('inputValues', inputValues)
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
      validationValues: {
        inputValues,
      },
      values: {
        min: inputRange,
        max: inputValues.max,
      },
    })
  }
  createNewSchedule(schedule) {
    console.log('_createNewSchedule ---->', schedule)
    const newSchedule = this.state.schedules.slice()
    newSchedule.unshift(schedule)
    this.setState({ schedules: newSchedule })
    actions.fetchNewSchedule(schedule)
  }
  deleteSchedule(id) {
    const deleteSchedule = this.state.schedules.filter(item => item.id !== id)
    this.setState({ schedules: deleteSchedule })
    actions.deleteScheduleFromServer(id)
  }
  editSchedule(item) {
    console.log('_editSchedule ---->', item)
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
    const disabled = state.disabled ? 'button_out_of_call disabled' : 'button_out_of_call'
    return (
      <div>
        <TimeZone />
        <div className='table_time_wrapper' >
          <div className='TableWidget' >
            <div className='timetable_header' >
              <h1>You what time for call?</h1>
              <button onClick={this.onClickDeleteAllSchedules} className={disabled} type='button' >
                Delete all
              </button>
              <div className='timetable_header-sub' >
                <h4>You will be available 140 hours</h4>
              </div>
            </div>
            <div className='time_table_body' >
              <WeekDays />
              <div className='table-flex' >
                <Thead />
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
                        <div className='cell' key={`${day}${i}`} onClick={() => this.onClickCreateNewSchedule(day, i)} >
                          <span className='circle' />
                        </div>,
                      )
                    }
                    return (
                      <div key={day}>
                        <div className='mobile_week_day' key={`${day} mobile`}>
                          <span className='line'>
                            {day}
                          </span>
                        </div>
                        <div className='row'>
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

export default Timetable