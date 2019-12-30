import React, {Component} from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase/app'
import 'firebase/firestore'
import {green} from '../colors';

class JournalLink extends Component {

  constructor(props) {
    super(props);

    this.state = {
      spreadsheetId: null
    };
  }

  componentWillMount() {
    const {userId} = this.props
    firebase.firestore().collection('users').doc(userId).on('value')
      .then(user => {
        if (!user.exists) {
          return null
        }
        this.setState({spreadsheetId: user.val().spreadsheetId })
      })
  }

  render () {
    const {spreadsheetId} = this.state
    return <div>
      {
        spreadsheetId &&
        <div style={styles.inputContainer}>
          <h2 style={{color: green}}>
            <a href={`https://docs.google.com/spreadsheets/d/${spreadsheetId}`}>
              Your Tiny Journal
            </a>
          </h2>
        </div>
      }
    </div>
  }
}

const {func, shape, object, string, number, arrayOf} = PropTypes;

JournalLink.propTypes = {
  userId: string
};

export default JournalLink;

const styles= {
  inputContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: 370
  },
}
