import React, { Component } from 'react';
import Icon from '@material-ui/core/Icon';
import firebase from 'firebase/app';
import * as firebaseui from 'firebaseui'
import paperfibers from './assets/paper_fibers.png';
import spreadsheetImg1 from './assets/spreadsheet1.png';
import spreadsheetImg2 from './assets/spreadsheet2.png';
import spreadsheetImg3 from './assets/spreadsheet3.png';
import spreadsheetImg4 from './assets/spreadsheet4.png';

class App extends Component {

  constructor(props) {
    super(props)

    this.state={
      sampleIndex: 0,
      timer: null
    }

    this.sampleQuestions = [
      'What am I grateful for?',
      'How am I feeling this week?',
      'What did I learn this week?',
      'What surprised me?'
    ]

    this.spreadsheetImages = [
      spreadsheetImg1,
      spreadsheetImg2,
      spreadsheetImg3,
      spreadsheetImg4
    ]
  }

  componentWillMount() {
    const config = {
      apiKey: "AIzaSyB4ka2MRJOnBN09F-8LFfgTYD-UzxpOqIo",
      authDomain: "dj-bullet-journal.firebaseapp.com",
      databaseURL: "https://dj-bullet-journal.firebaseio.com",
      projectId: "dj-bullet-journal",
      storageBucket: "dj-bullet-journal.appspot.com",
      messagingSenderId: "739960274468"
    };
    firebase.initializeApp(config);
  }

  componentDidMount() {
    // Initialize the FirebaseUI Widget using Firebase.
    const ui = new firebaseui.auth.AuthUI(firebase.auth());
    const uiConfig = {
        signInSuccessUrl: window.location,
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID
        ],
        // tosUrl: '<your-tos-url>',
        // // Privacy policy url/callback.
        // privacyPolicyUrl: function() {
        //   window.location.assign('<your-privacy-policy-url>');
        // }
      };
    // The start method will wait until the DOM is loaded.
    ui.start('#firebaseui-auth-container', uiConfig);
    this.setState({
      timer: setInterval(() => this.setState((prevState) => {
        const sampleIndex = prevState.sampleIndex >= this.sampleQuestions.length - 1 ? 0 : prevState.sampleIndex + 1
        return {...prevState, sampleIndex}
      }), 2500)
    })
  }

  componentWillUnmount() {
    clearInterval(this.state.timer)
  }

  render() {
    const {sampleIndex} = this.state

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h2>Tiny Journal</h2>
        </div>
        <div style={styles.subheader}>
          Text yourself questions on a regular basis<br/>and save the answers in a Google Spreadsheet.
        </div>
        <div style={styles.sampleQuestion}>
          {
            this.sampleQuestions[sampleIndex]
          }
        </div>
        <div>
          <Icon style={styles.arrow}>arrow_downward</Icon>
        </div>
        <div>
          {
            <img alt='A spreadsheet' style={styles.spreadsheetImage} src={this.spreadsheetImages[sampleIndex]}/>
          }
        </div>
        <div id="firebaseui-auth-container"></div>
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
  subheader: {
    fontSize: 24,
    textAlign: 'center'
  },
  sampleQuestion: {
    marginTop: 40,
    marginBottom: 20,
    fontSize: 24,
    padding: 10,
    borderRadius: 7,
    width: 300,
    textAlign: 'center',
    backgroundColor: 'lightgrey',
    fontFamily: 'Roboto'
  },
  arrow: {
    fontSize: 44,
    color: '#0da95f'
  },
  spreadsheetImage: {
    width: 700,
    margin: 20
  }
}
