import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import Landing from './Landing'
import Auth from './Auth'
import Setup from './Setup'
import {green} from './colors'
import firebase from 'firebase/app'
import 'firebase/firestore'
import paperfibers from '../assets/paper_fibers.png'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: green
    },
    secondary:  {
      main: '#2979ff'
    },
  },
});

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      loggedIn: false
    }
  }

  componentWillMount () {
    const config = {
      apiKey: 'AIzaSyB4ka2MRJOnBN09F-8LFfgTYD-UzxpOqIo',
      authDomain: 'dj-bullet-journal.firebaseapp.com',
      databaseURL: 'https://dj-bullet-journal.firebaseio.com',
      projectId: 'dj-bullet-journal',
      storageBucket: 'dj-bullet-journal.appspot.com',
      messagingSenderId: '739960274468'
    }
    firebase.initializeApp(config)
    const firestore = firebase.firestore();
    const settings = {timestampsInSnapshots: true};
    firestore.settings(settings);

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({loggedIn: true})

        if (user.providerData && user.providerData.length > 0) {
          return
        }
        // Once an id_token has been retreived, use it to authenticate the user
        const unsubscribe = firestore.collection('users').doc(user.uid)
          .onSnapshot(doc => {
            if (!doc.data()) {
              return
            }
            const id_token = doc.data().id_token
            if (!id_token) {
              return
            }

            const credential = firebase.auth.GoogleAuthProvider.credential(id_token)
            return firebase.auth().currentUser.linkWithCredential(credential)
              .then(unsubscribe)
              .catch(() => {
                let data
                const anonymousUser = firebase.auth().currentUser
                return firestore.collection('users').doc(anonymousUser.uid).get()
                  .then(snapshot => {
                    data = snapshot.data()
                    return firestore.collection('users').doc(anonymousUser.uid).delete()
                  })
                  .then(() => anonymousUser.delete())
                  .then(() => firebase.auth().signInAndRetrieveDataWithCredential(credential))
                  .then(() => firestore.collection('users').doc(firebase.auth().currentUser.uid).set(data))
              })
          })
      } else {
        this.setState({loggedIn: false})
      }
    });


  }

  render () {
    const {loggedIn} = this.state
    return (
      <MuiThemeProvider theme={theme}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h2>Tiny Journal</h2>
          </div>
          <Router>
            <div style={{width: '100%'}}>
              <Route path='/' exact component={loggedIn ? Setup : Landing} />
              <Route path='/auth' component={Auth} />
            </div>
          </Router>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default App

const styles = {
  container: {
    width: '100%',
    minHeight: '100vh',
    display: 'flex',
    paddingBottom: 100,
    justifyContent: 'flex-start',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: 'Roboto',
    background: `url(${paperfibers})`
  },
  header: {
    fontSize: 44,
    fontFamily: 'Amatic SC'
  }

}
