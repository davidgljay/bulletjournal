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
    const db = firebase.firestore()
    firebase.auth().signInAnonymously()
      .then(() => {
        // Add the authentication code to firestore
        const userId = firebase.auth().currentUser.uid
        db.collection('credentials').doc(userId)
          .set({
            code
          })

        // Once an id_token has been retreived, use it to authenticate the user
        const unsubscribe = db.collection('credentials').doc(userId)
          .onSnapshot(doc => {
            if (!doc || !doc.data) {
              return
            }
            const id_token = doc.data().id_token
            if (!id_token) {
              return
            }
            const credential = firebase.auth.GoogleAuthProvider.credential(id_token)
            firebase.auth().currentUser.linkAndRetrieveDataWithCredential(credential)
            unsubscribe()
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
