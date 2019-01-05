import React, { Component } from 'react'
import Icon from '@material-ui/core/Icon'
import googleLoginButton from '../assets/btn_google_signin_light_normal_web@2x.png'
import spreadsheetImg1 from '../assets/spreadsheet1.png'
import spreadsheetImg2 from '../assets/spreadsheet2.png'
import spreadsheetImg3 from '../assets/spreadsheet3.png'
import spreadsheetImg4 from '../assets/spreadsheet4.png'

class Landing extends Component {
  constructor (props) {
    super(props)
    this.state = {
      index: 0,
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

    this.oauthSignIn = () => {
      // Google's OAuth 2.0 endpoint for requesting an access token
      var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

      // Create <form> element to submit parameters to OAuth 2.0 endpoint.
      var form = document.createElement('form');
      form.setAttribute('method', 'GET'); // Send as a GET request.
      form.setAttribute('action', oauth2Endpoint);

      let u = new Uint32Array(1);
      window.crypto.getRandomValues(u);
      let str = u[0].toString(16).toUpperCase();
      const authKey = '00000000'.slice(str.length) + str;
      window.sessionStorage.setItem('authKey', authKey)

      // Parameters to pass to OAuth 2.0 endpoint.
      var params = {'client_id': '739960274468-uteu6u1fgjjtfcaqiinpp2g676rrsm7m.apps.googleusercontent.com',
                    'redirect_uri': 'https://82adb641.ngrok.io/auth',
                    'response_type': 'code',
                    'access_type': 'offline',
                    'scope': 'openid',
                    'prompt': 'consent', //TODO: Remove after oauth development
                    'include_granted_scopes': 'true',
                    'state': authKey};

      // Add form parameters as hidden input values.
      for (var p in params) {
        var input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', p);
        input.setAttribute('value', params[p]);
        form.appendChild(input);
      }

      // Add form to page and submit it to open the OAuth 2.0 endpoint.
      document.body.appendChild(form);
      form.submit();
    }
  }

  componentDidMount () {
    this.setState({
      timer: setInterval(() => this.setState((prevState) => {
        const index = prevState.index >= this.sampleQuestions.length - 1 ? 0 : prevState.index + 1
        return { ...prevState, index }
      }), 2500)
    })
  }

  componentWillUnmount () {
    clearInterval(this.state.timer)
  }

  render () {
    const { index } = this.state
    return <div style={styles.container}>
      <div style={styles.subheader}>
        Text yourself questions on a regular basis<br />and save the answers in a Google Spreadsheet.
      </div>
      <div style={styles.sampleQuestion}>
        {
          this.sampleQuestions[index]
        }
      </div>
      <div>
        <Icon style={styles.arrow}>arrow_downward</Icon>
      </div>
      <div>
        {
          <img alt='A spreadsheet' style={styles.spreadsheetImage} src={this.spreadsheetImages[index]} />
        }
      </div>
      <div onClick={this.oauthSignIn}><img style={styles.login} src={googleLoginButton}/></div>
    </div>
  }
}

export default Landing

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    alignItems: 'center'
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
  },
  login: {
    width: 191,
    cursor: 'pointer'
  }
}