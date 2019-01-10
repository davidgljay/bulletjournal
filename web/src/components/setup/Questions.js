import React, {Component} from 'react'
import Icon from '@material-ui/core/Icon'
import Fab from '@material-ui/core/Fab'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import firebase from 'firebase/app'
import 'firebase/firestore'
import {green, grey} from '../colors'

class Questions extends Component {

  constructor(props) {
    super(props)

    this.state = {
      questions: [''],
      hints: [
        'What am I grateful for?',
        'How did I make the world better?'
      ],
      posted: false
    }

    this.updateQuestion = i => e => {
      const text = e.target.value
      this.setState(prev => {
        prev.questions[i] = text
        return prev
      })
    }

    this.postQuestions = () => {
      const {userId} = this.props
      const {questions} = this.state
      firebase.firestore().collection('users').doc(userId)
        .set({questions})
      this.setState({posted: true})
    }

    this.addQuestion = () => this.setState(prev => {
      const questions = prev.questions.concat('')
      return {
        ...prev,
        questions
      }
    })
  }

  componentWillMount() {
    const {userId} = this.props
    firebase.firestore().collection('users').doc(userId).get()
      .then(user => {
        if (!user.exists()) {
          return
        }
        this.setState({questions: user.data().questions})
      })
  }

  render () {
    const {questions, hints, posted} = this.state

    return <div style={styles.inputContainer}>
      {
        questions.map((question, i) =>
          {
            return <div style={styles.questionContainer}>
              <TextField
                label={`Question ${i+1}`}
                margin="normal"
                variant="outlined"
                multiline
                value={questions[i]}
                placeholder={hints[i]}
                onChange={this.updateQuestion(i)}
                style={styles.input}/>
              {
                i === questions.length - 1 &&
                <Fab
                  aria-label="Add"
                  color='primary'
                  size='small'
                  style={styles.button}
                  onClick={this.addQuestion}>
                  <Icon style={styles.icon}>add</Icon>
                </Fab>
              }
            </div>
          })
      }
      <div style={styles.text}>
        {
          posted ?
          'You\'re all set! Feel free to return to this page at any time to update your questions.'
          :'Your answers will be added to a Google spreadhseet called "Tiny Journal" (feel free to move it or change the name).'
        }
      </div>
      {
        !posted && <Button color='primary' variant='contained' style={styles.button}>Done</Button>
      }
    </div>
  }
}

export default Questions;

const styles = {
  inputContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: 370
  },
  questionContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  input: {
    color: '#888',
    fontSize: 28,
    width: 300
  },
  button: {
    margin: 15,
    alignSelf: 'center'
  },
  text: {
    color: grey,
    fontSize: 14,
    marginTop: 15,
    textAlign: 'center'
  },
  icon: {
    fontSize: 28
  }
}
