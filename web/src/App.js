import React, { Component } from 'react';

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
      'What did I achieve today?',
      'What did I learn this week?',
      'What surprised me?',
      'Where did I find peace?'
    ]
  }

  componentDidMount() {
    this.setState({
      timer: setInterval(() => this.setState((prevState) => {
        const sampleIndex = prevState.sampleIndex >= this.sampleQuestions.length - 1 ? 0 : prevState.sampleIndex + 1
        return {...prevState, sampleIndex}
      }), 4000)
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
      </div>
    );
  }
}

export default App;

const styles = {
  container: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: 'Amatic SC',
  },
  header: {
    fontSize: 44,
  },
  subheader: {
    fontSize: 32,
    textAlign: 'center'
  },
  sampleQuestion: {
    margin: 40,
    fontSize: 36,
    padding: 10,
    borderRadius: 4,
    width: 300,
    textAlign: 'center',
    backgroundColor: 'lightBlue'
  }
}
