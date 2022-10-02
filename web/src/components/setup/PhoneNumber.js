import React, {Component} from 'react'
import Icon from '@material-ui/core/Icon'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import firebase from 'firebase/app'
import 'firebase/firestore'
import {green} from '../colors'

class PhoneNumber extends Component {

  constructor(props) {
    super(props);

    this.state = {
      phoneNumber: '',
      confirmation: 'inputting',
      error: ''
    };

    this.updatePhoneNumber = (e) => {
      const phoneNumber = e.target.value
      if (/[^0-9\-()+]/.exec(phoneNumber)) {
        return
      }
      this.setState({phoneNumber})
    }

    this.confirmNumber = () => {
      const {userId} = this.props
      const phone = this.state.phoneNumber
      if (phone.replace(/[^0-9]/, '').length < 10) {
        this.setState({
          error: 'Too short'
        })
        return
      } else {
        this.setState({error: null})
      }
      const regPhone = /([0-9]{3}).{0,1}([0-9]{3}).{0,1}([0-9]{4})/.exec(phone)
      const formattedPhone = `+1${regPhone[1]}${regPhone[2]}${regPhone[3]}`
      firebase.firestore().collection('users').doc(userId)
        .update({
          phone: formattedPhone,
          phoneConfirmed: false
        })
      this.setState({
        phoneNumber: formattedPhone,
        confirmation: 'confirming'
      })
      const phoneUnsub = firebase.firestore().collection('users').doc(userId)
        .onSnapshot(doc => {
          if (!doc.val()) {
            return null
          }
          if (doc.val().phoneConfirmed) {
            this.setState({
              confirmation: 'confirmed'
            })
            phoneUnsub()
          }
        })
    }
  }

  componentWillMount() {
    const {userId} = this.props
    firebase.firestore().collection('users').doc(userId)
      .get().then(user => {
        if (!user.exists) {
          return null
        }
        this.setState({
          phoneNumber: user.val().phone || ''
        })
      })
  }

  render () {
    const {phoneNumber, confirmation, error} = this.state

    let PhoneButton = <Button
        color="primary"
        style={styles.button}
        onClick={this.confirmNumber}>
        Confirm
      </Button>

    if (confirmation === 'confirming') {
      PhoneButton = <div style={styles.button}><CircularProgress /></div>
    } else if (confirmation === 'confirmed') {
      PhoneButton = <Icon style={styles.check}>check</Icon>
    }

    return <div style={styles.inputContainer}>
        <TextField
          label={error ? error : 'Phone Number'}
          margin="normal"
          variant="outlined"
          error={!!error}
          value={phoneNumber}
          onChange={this.updatePhoneNumber}
          style={styles.input}/>
        {PhoneButton}
      </div>
  }
}


export default PhoneNumber;

const styles = {
  inputContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  input: {
    color: '#888',
    fontSize: 28
  },
  button: {
    margin: 15
  },
  check: {
    color: green,
    fontSize: 44
  }
}
