import React, { Component, PropTypes } from 'react'
// https://github.com/github/fetch
import 'whatwg-fetch'
// https://github.com/dylang/shortid
import shortid from 'shortid'
// https://github.com/tj/react-click-outside
import ClickOutside from 'react-click-outside'
// http://momentjs.com/
import moment from 'moment-timezone'
// https://github.com/davidchin/react-input-range
import InputRange from 'react-input-range'
// https://github.com/JedWatson/classnames
import classNames from 'classnames'
// Actions      ↓
import { getScheduleStyle } from '../actions/actions'
// Константы    ↓
import * as constants from '../constants/timetable'

export default class Popup extends Component {
  static propTypes = {
    deleteSchedule: PropTypes.func,
    editSchedule: PropTypes.func,
    createNewSchedule: PropTypes.func,
    deleteAllSchedules: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.onEscKeyDown = ::this.onEscKeyDown
    this.onClickClosePopup = ::this.onClickClosePopup
    this.onClickDeleteSchedule = ::this.onClickDeleteSchedule
    this.onChangeValues = ::this.onChangeValues
    this.onClickSaveSchedule = ::this.onClickSaveSchedule
    this.onClickDeleteAllSchedules = ::this.onClickDeleteAllSchedules
    this.state = {
      popupOpened: false,
      deleteAllSchedules: false,
      editingSchedule: false,
      newSchedule: false,
      end_at: '',
      id: 0,
      start_at: '',
      validationValues: {
        min: 0,
        max: 48,
      },
      values: {
        min: 0,
        max: 48,
      },
      weekDay: '',
    }
  }
  componentDidMount() {
    document.addEventListener('keydown', this.onEscKeyDown)
  }
  onClickDeleteSchedule() {
    this.props.deleteSchedule(this.state.id)
    this.onClickClosePopup()
  }
  onClickClosePopup() {
    this.setState(
      {
        popupOpened: false,
        deleteAllSchedules: false,
        editingSchedule: false,
        newSchedule: false,
      },
    )
  }

  onClickDeleteAllSchedules() {
    this.props.deleteAllSchedules(this.state.deleteAllSchedules)
    this.onClickClosePopup()
  }

  onChangeValues(component, handleValues) {
    console.log('onChangeValues', component)
    const start = moment(handleValues.min * constants.HALF_HOUR).utc().format(constants.FORMAT_DATES)
    const end = moment(handleValues.max * constants.HALF_HOUR).utc().format(constants.FORMAT_DATES)
    this.setState({
      start_at: start,
      end_at: end,
      values: {
        min: handleValues.min,
        max: handleValues.max,
      },
    })
  }

  onEscKeyDown(e) {
    const ESC = 27
    if (e.keyCode === ESC) {
      this.onClickClosePopup()
    }
  }

  onClickSaveSchedule() {
    const state = this.state
    if (this.state.editingSchedule === true) {
      const object = this.state.values
      const schedulesStyle = getScheduleStyle(object)
      const item = {
        id: state.id,
        weekDay: state.weekDay,
        start_at: state.start_at,
        end_at: state.end_at,
        values: {
          min: state.values.min,
          max: state.values.max,
        },
        schedulesStyle,
      }
      this.props.editSchedule(item)
    }
    if (this.state.newSchedule === true) {
      const object = this.state.values
      const schedulesStyle = getScheduleStyle(object)
      const item = {
        id: shortid.generate(),
        weekDay: state.weekDay,
        start_at: state.start_at,
        end_at: state.end_at,
        values: {
          min: state.values.min,
          max: state.values.max,
        },
        schedulesStyle,
      }
      this.props.createNewSchedule(item)
    }
    this.onClickClosePopup()
  }
  render() {
    const state = this.state
    console.log('STATE POPUP --->', state)
    const popUpClass = classNames('popup', { popup__opened: state.popupOpened })
    let deleteAll
    let newSchedule
    let editSchedule
    const styleWidth = {
      width: '50%',
    }
    const formField = (
      <form className='form' >
        <div className='formField' >
          <div className='formWeekday' >
            {state.weekDay}
          </div>
          <div className='formHeader' >
            {state.start_at}
            &ensp;-&ensp;
            {state.end_at}
          </div>
          <InputRange
            onChange={this.onChangeValues}
            minValue={state.validationValues.min}
            maxValue={state.validationValues.max}
            value={state.values}
          />
        </div>
      </form>
    )
    if (state.deleteAllSchedules === true) {
      deleteAll = (
        <div className='popup_buttons_container' >
          <p className='are_you_sure' >
            Are you sure want to delete all schedules?
          </p>
          <button onClick={this.onClickDeleteAllSchedules} type='button' className='button popup__button delete_all' >
            Delete
          </button>
        </div>
      )
    }
    if (state.newSchedule === true) {
      newSchedule = (
        <div>
          {formField}
          <div className='popup_buttons_container' >
            <button onClick={this.onClickSaveSchedule} type='button' className='button popup__button save' >
              Save
            </button>
          </div>
        </div>)
    }
    if (state.editingSchedule === true) {
      editSchedule = (<div>
        {formField}
        <div className='popup_buttons_container'>
          <button style={styleWidth} onClick={this.onClickDeleteSchedule}
            type='button' className='button popup__button delete'
          >
            Delete
          </button>
          <button style={styleWidth} onClick={this.onClickSaveSchedule}
            type='button' className='button popup__button save'
          >
            Save
          </button>
        </div>
      </div>)
    }
    return (
      <div>
        <div className={popUpClass} >
          <div className='popup__container' >
            <ClickOutside onClickOutside={this.onClickClosePopup}>
              {deleteAll}
              {newSchedule}
              {editSchedule}
              <button onClick={this.onClickClosePopup} className='button popup__close' >
               ×
              </button>
            </ClickOutside>
          </div>
        </div>
      </div>
    )
  }
}

