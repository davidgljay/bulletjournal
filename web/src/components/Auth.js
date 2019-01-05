import React, { Component } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

class Auth extends Component {
  constructor (props) {
    super(props)

    this.state = {
      res: null
    }
  }

  componentWillMount() {
    const params = new URLSearchParams(document.location.search.substring(1))
    const code = params.get('code')
    firebase.auth().signInAnonymously()
      .then(() => {
        firebase.firestore().collection('credentials')
        .doc(firebase.auth().currentUser.uid)
        .set({
          code
        })
      })
  }

  render () {
    const {res} = this.state
    return <div>
      {
        res ? <div>{res}</div> : <CircularProgress />
      }
    </div>
  }
}

export default Auth
