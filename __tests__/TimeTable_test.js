import React from 'react'
import renderer from 'react-test-renderer'
import TimeTable from '../src/components/TimeTable'

test('timetable', () => {
  const component = renderer.create(
    <TimeTable />,
  )
  //const tree = component.toJSON()
  console.log(component)
})
