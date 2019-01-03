import React, { Component } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'

class Auth extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  render () {
    const params = new URLSearchParams(document.location.search.substring(1))
    return <div>{params.get('stuff')}
      <CircularProgress />
    </div>
  }
}

export default Auth
