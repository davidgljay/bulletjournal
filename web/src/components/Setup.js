import React, {Component} from 'react'
import PhoneNumber from './setup/PhoneNumber'
import Questions from './setup/Questions'
import Icon from '@material-ui/core/Icon'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

class Setup extends Component {

  constructor(props) {
    super(props)

    this.state = {
      questions: []
    }

    this.getUid = () => firebase.auth().currentUser ?  firebase.auth().currentUser.uid : 'test'

    this.logout = () => firebase.auth().signOut()

    this.updateQuestion = () => {}

    this.addQuestion = () => {}

  }

  render () {
    const {questions} = this.state
    return <div style={styles.container}>
      <div style={styles.logoutContainer} >
        <div style={styles.logout} onClick={this.logout}>Log Out <Icon style={styles.logoutIcon}>logout</Icon></div>
      </div>
      <PhoneNumber userId={this.getUid()} />
      <Questions userId={this.getUid()} />
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
    alignItems: 'center'
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
