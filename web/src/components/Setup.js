import React, {Component} from 'react'
import PhoneNumber from './setup/PhoneNumber'
import Questions from './setup/Questions'
import Time from './setup/Time'
import JournalLink from './setup/JournalLink'
import Icon from '@material-ui/core/Icon'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

class Setup extends Component {

  constructor(props) {
    super(props)

    this.logout = () => firebase.auth().signOut()

  }

  render () {
    const userId = firebase.auth().currentUser && firebase.auth().currentUser.uid
    return userId && <div style={styles.container}>
      <div style={styles.logoutContainer} >
        <div style={styles.logout} onClick={this.logout}>Log Out <Icon style={styles.logoutIcon}>logout</Icon></div>
      </div>
      <JournalLink userId={userId} />
      <Time userId={userId} />
      <PhoneNumber userId={userId} />
      <Questions userId={userId} />
    </div>

  }
}

export default Setup;

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '70%',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  logoutContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20
  },
  logout: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center'
  },
  logoutIcon: {
    marginLeft: 10
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    color: '#888',
    fontSize: 28
  },
  button: {
    margin: 15
  }
}
