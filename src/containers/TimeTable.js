import React, { Component, PropTypes } from 'react'
// https://github.com/JedWatson/classnames
import classNames from 'classnames'
// https://github.com/dylang/shortid
import shortid from 'shortid'
// https://facebook.github.io/react/docs/animation.html
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { Thead, WeekDays } from '../components/Pure'
import Schedule from '../components/Schedule'
import TimeZone from '../components/TimeZone'
import Cells from '../components/Cells'
import Popup from '../components/Popup'
// Actions     ↓
import * as actions from '../actions/actions'

class TimeTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      schedules: [],
      weekdays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      popupIsOpen: false,
      indexSchedule: 0,
    }
    this.onClickSchedule = this.onClickSchedule.bind(this)
    this.onClickCreateNewSchedule = this.onClickCreateNewSchedule.bind(this)
    this.onClickDeleteAllSchedules = this.onClickDeleteAllSchedules.bind(this)
    this.deleteSchedule = this.deleteSchedule.bind(this)
    this.editSchedule = this.editSchedule.bind(this)
    this.createNewSchedule = this.createNewSchedule.bind(this)
    this.onMouseLeaveSchedule = this.onMouseLeaveSchedule.bind(this)
    this.onMouseEnterSchedule = this.onMouseEnterSchedule.bind(this)
  }

  componentDidMount() {
    actions.getSchedulesFromServer().then(response => this.setState({ schedules: response }))
  }

  onClickSchedule(schedule) {
    const component = this.popup
    component.setState(schedule)
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

  onClickCreateNewSchedule(schedule) {
    const component = this.popup
    component.setState(schedule)
  }

  onMouseEnterSchedule(index) {
    if (window.innerWidth > 767) {
      this.setState({
        indexSchedule: index,
      })
    }
  }

  onMouseLeaveSchedule(nix) {
    this.setState({
      indexSchedule: nix,
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
    const state = this.state
    const prewStateArray = state.schedules.filter(obj => obj.id !== item.id)
    const copyArray = prewStateArray.slice()
    copyArray.push(item)
    this.setState({ schedules: copyArray })
    actions.fetchEditscheduleFromServer(item)
  }

  render() {
    const state = this.state
    const buttonClass = classNames('btn_delete_all', { disabled: state.schedules.length === 0 })
    return (
      <div>
        <TimeZone />
        <div className='table_time_wrapper' >
          <div className='TableWidget' >
            <div className='timetable_header' >
              <h1>You what time for call?</h1>
              <button onClick={this.onClickDeleteAllSchedules}
                className={buttonClass} type='button'
              >
                Delete all
              </button>
              <div className='timetable_header-sub' >
                <h4>You will be available 140 hours</h4>
              </div>
            </div>
            <div className='time_table_body' >
              <WeekDays weekdays={state.weekdays} />
              <div className='table-flex' >
                <Thead {...this.state} />
                {
                  state.weekdays.map((day) => {
                    const schedule = []
                    const cells = []
                    const cellsAmount = 25
                    state.schedules.forEach((item) => {
                      if (item.weekDay === day) {
                        schedule.push(
                          <Schedule
                            onClickSchedule={this.onClickSchedule}
                            key={item.id}
                            schedules={state.schedules}
                            schedule={item}
                          />,
                        )
                      }
                    })
                    for (let i = 1; i < cellsAmount; i += 1) {
                      cells.push(
                        <Cells
                          onClickCreateNewSchedule={this.onClickCreateNewSchedule}
                          onMouseEnterSchedule={this.onMouseEnterSchedule}
                          onMouseLeaveSchedule={this.onMouseLeaveSchedule}
                          schedules={state.schedules}
                          key={shortid.generate()}
                          day={day}
                          hour={i}
                        />,
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
                          {cells}
                          <ReactCSSTransitionGroup
                            transitionName='example'
                            transitionEnterTimeout={1000}
                            transitionLeaveTimeout={1000}
                          >
                            {schedule}
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
