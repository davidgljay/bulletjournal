import React, { Component } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

class Auth extends Component {

  componentWillMount() {
    const params = new URLSearchParams(document.location.search.substring(1))
    const code = params.get('code')
    firebase.auth().signInAnonymously()
      .then(() => {
        // Add Google authentication code to firestore
        const userId = firebase.auth().currentUser.uid
        return firebase.firestore().collection('users').doc(userId)
          .set({ code })
      }).then(() => {
        window.location = '/'
      })
  }

  render () {
    return <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}>
        <CircularProgress />
      </div>
  }
}

export default Auth
