import React, {Component} from 'react'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import {grey} from '../colors'
import firebase from 'firebase/app'
import 'firebase/firestore'

class Time extends Component {

  constructor(props) {
    super(props)

    this.state = {
      day: 0,
      hour: 19
    }

    this.toUTC = (localHour, localDay) => {
      const offset = new Date().getTimezoneOffset()/60
      const hour = (localHour + offset) % 24
      let day = localDay
      if (hour + offset > 24) {
        day = (day + 1) % 6
      } else if (hour + offset < 0) {
        day = (day - 1) % 6
      }
      return { hour, day }
    }

    this.fromUTC = (utcHour, utcDay) => {
      const offset = new Date().getTimezoneOffset()/60
      const hour = (utcHour - offset) % 24
      let day = utcDay
      if (hour + offset > 24) {
        day = (day + 1) % 6
      } else if (hour + offset < 0) {
        day = (day - 1) % 6
      }
      return { hour, day }
    }

    this.setDay = e => {
      const {userId} = this.props
      const {hour} = this.state
      const day = e.target.value
      this.setState({day})
      firebase.firestore().collection('users').doc(userId)
        .update(this.toUTC(hour, day))
    }

    this.setHour = e => {
      const {userId} = this.props
      const {day} = this.state
      const hour = e.target.value
      this.setState({hour})
      firebase.firestore().collection('users').doc(userId)
        .update(this.toUTC(hour, day))
    }
  }

  componentWillMount() {
    const {userId} = this.props
    firebase.firestore().collection('users').doc(userId)
      .get().then(user => {
        if (!user.exists) {
          return
        }
        const {day, hour} = user.data()
        if (day && hour) {
          this.setState(this.fromUTC(hour, day))
        } else {
          this.setDay({target: {value: 0}})
          this.setHour({target: {value: 19}})
        }
      })
  }

  render () {
    const {day, hour} = this.state

    return <div style={styles.container}>
      <div>Text me questions every </div>
      <Select
        value={day}
        style={styles.select}
        onChange={this.setDay}>
        <MenuItem value={-1}>Day</MenuItem>
        <MenuItem value={0}>Sunday</MenuItem>
        <MenuItem value={1}>Monday</MenuItem>
        <MenuItem value={2}>Tuesday</MenuItem>
        <MenuItem value={3}>Wednesday</MenuItem>
        <MenuItem value={4}>Thursday</MenuItem>
        <MenuItem value={5}>Friday</MenuItem>
        <MenuItem value={6}>Saturday</MenuItem>
        <MenuItem value={null}>Never</MenuItem>
      </Select>
      <div> at </div>
      <Select
        value={hour}
        style={styles.select}
        onChange={this.setHour}>
        <MenuItem value={0}>12 AM</MenuItem>
        <MenuItem value={1}>1 AM</MenuItem>
        <MenuItem value={2}>2 AM</MenuItem>
        <MenuItem value={3}>3 AM</MenuItem>
        <MenuItem value={4}>4 AM</MenuItem>
        <MenuItem value={5}>5 AM</MenuItem>
        <MenuItem value={6}>6 AM</MenuItem>
        <MenuItem value={7}>7 AM</MenuItem>
        <MenuItem value={8}>8 AM</MenuItem>
        <MenuItem value={9}>9 AM</MenuItem>
        <MenuItem value={10}>10 AM</MenuItem>
        <MenuItem value={11}>11 AM</MenuItem>
        <MenuItem value={12}>12 AM</MenuItem>
        <MenuItem value={13}>1 PM</MenuItem>
        <MenuItem value={14}>2 PM</MenuItem>
        <MenuItem value={15}>3 PM</MenuItem>
        <MenuItem value={16}>4 PM</MenuItem>
        <MenuItem value={17}>5 PM</MenuItem>
        <MenuItem value={18}>6 PM</MenuItem>
        <MenuItem value={19}>7 PM</MenuItem>
        <MenuItem value={20}>8 PM</MenuItem>
        <MenuItem value={21}>9 PM</MenuItem>
        <MenuItem value={22}>10 PM</MenuItem>
        <MenuItem value={23}>11 PM</MenuItem>
      </Select>
      <div style={styles.timezone}>({Intl.DateTimeFormat().resolvedOptions().timeZone})</div>
    </div>
  }
}

export default Time

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexFlow: 'wrap',
    marginTop: 10,
    marginBottom: 20
  },
  select: {
    margin: 10
  },
  timezone: {
    fontSize: 12,
    color: grey
  }
}
