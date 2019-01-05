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
    const firestore = firebase.firestore()
    firebase.auth().signInAnonymously()
      .then(() => {
        // Add Google authentication code to firestore
        const userId = firebase.auth().currentUser.uid
        firestore.collection('credentials').doc(userId)
          .set({
            code
          })
      })
    window.location = '/'
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
