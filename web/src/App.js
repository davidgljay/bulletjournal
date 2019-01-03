import React, { Component } from 'react';
import Icon from '@material-ui/core/Icon';
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

  componentDidMount() {
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
            <img style={styles.spreadsheetImage} src={this.spreadsheetImages[sampleIndex]}/>
          }
        </div>
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
    justifyContent: 'center',
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
