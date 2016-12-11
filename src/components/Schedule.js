import React, { Component, PropTypes } from 'react'
// Actions     ↓
import * as actions from '../actions/actions'

class Schedule extends Component {
  static propTypes = {
    schedules: PropTypes.array,
    schedule: PropTypes.object,
    onClickSchedule: PropTypes.func,
  }
  constructor(props) {
    super(props)
    this.onClickSchedule = this.onClickSchedule.bind(this)
  }
  onClickSchedule() {
    console.log('onClickSchedule ---->', this.props.schedules)
    const props = this.props.schedule
    const args = [this.props.schedules, props.weekDay, props.id, props.values.min, props.values.max]
    const validationValues = actions.getInputValuesForEdit(...args)
    const schedule = {
      id: props.id,
      start_at: props.start_at,
      end_at: props.end_at,
      weekDay: props.weekDay,
      popupOpened: true,
      editingSchedule: true,
      validationValues,
      values: {
        min: props.values.min,
        max: props.values.max,
      },
    }
    this.props.onClickSchedule(schedule)
  }
  render() {
    const schedule = this.props.schedule
    const scheduleStyle = {
      width: schedule.schedulesStyle.scheduleWidth,
      left: schedule.schedulesStyle.scheduleLeft,
    }
    return (
      <div className='schedule' key={schedule.id}
        onClick={this.onClickSchedule}
        style={scheduleStyle}
      >
        {schedule.start_at}
        &ensp;-&ensp;{schedule.end_at}
      </div>
    )
  }
}

export default Schedule
