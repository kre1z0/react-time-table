import React, { Component, PropTypes } from 'react'
// http://momentjs.com/
// http://momentjs.com/timezone/
import moment from 'moment-timezone'
// Actions     ↓
import * as actions from '../actions/actions'
// Константы    ↓
import * as constants from '../constants/timetable'

class Cells extends Component {
  static propTypes = {
    schedules: PropTypes.array,
    day: PropTypes.string,
    onMouseEnterSchedule: PropTypes.func,
    onMouseLeaveSchedule: PropTypes.func,
    onClickCreateNewSchedule: PropTypes.func,
    hour: PropTypes.number,
  }
  constructor(props) {
    super(props)
    this.onClickCreateNewSchedule = this.onClickCreateNewSchedule.bind(this)
    this.onMouseEnterSchedule = this.onMouseEnterSchedule.bind(this)
    this.onMouseLeaveSchedule = this.onMouseLeaveSchedule.bind(this)
  }
  onMouseEnterSchedule() {
    this.props.onMouseEnterSchedule(this.props.hour)
  }
  onMouseLeaveSchedule() {
    this.props.onMouseLeaveSchedule(null)
  }
  onClickCreateNewSchedule() {
    const inputRange = this.props.hour * constants.INPUT_RANGE
    const schedules = this.props.schedules
    const validationValues = actions.getInputValuesForNew(schedules, this.props.day, inputRange)
    const start = moment(inputRange * constants.HALF_HOUR)
    const end = moment(validationValues.max * constants.HALF_HOUR)
    const startTime = start.utc().format(constants.FORMAT_DATES)
    const endTime = end.utc().format(constants.FORMAT_DATES)

    const schedule = {
      newSchedule: true,
      popupOpened: true,
      weekDay: this.props.day,
      start_at: startTime,
      end_at: endTime,
      validationValues,
      values: {
        min: inputRange,
        max: validationValues.max,
      },
    }
    this.props.onClickCreateNewSchedule(schedule)
  }
  render() {
    console.log('props', this.props.hour)
    return (
      <div className='cell'
        onClick={this.onClickCreateNewSchedule}
        onMouseEnter={this.onMouseEnterSchedule}
        onMouseLeave={this.onMouseLeaveSchedule}
      >
        <span className='circle' />
      </div>
    )
  }
}

export default Cells
