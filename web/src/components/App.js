import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from "react-router-dom"
import Landing from './Landing'
import firebase from 'firebase/app'
import * as firebaseui from 'firebaseui'
import paperfibers from '../assets/paper_fibers.png'

class App extends Component {

  componentWillMount() {
    const config = {
      apiKey: "AIzaSyB4ka2MRJOnBN09F-8LFfgTYD-UzxpOqIo",
      authDomain: "dj-bullet-journal.firebaseapp.com",
      databaseURL: "https://dj-bullet-journal.firebaseio.com",
      projectId: "dj-bullet-journal",
      storageBucket: "dj-bullet-journal.appspot.com",
      messagingSenderId: "739960274468"
    }
    firebase.initializeApp(config);
  }


  render() {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h2>Tiny Journal</h2>
        </div>
        <Router>
          <Route path="/" exact component={Landing} />
        </Router>
      </div>
    );
  }
}

export default App;

const styles = {
  container: {
    width: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: 'Roboto',
    background: `url(${paperfibers})`
  },
  header: {
    fontSize: 44,
    fontFamily: 'Amatic SC',
  },

}
