import React, { Component } from 'react'
import Icon from '@material-ui/core/Icon'
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
      <div id='firebaseui-auth-container' />
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
  }
}
