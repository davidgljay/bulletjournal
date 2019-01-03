import React, { Component } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'

class Auth extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  compnentWillMount() {
    const params = new URLSearchParams(document.location.search.substring(1))
    params.get('stuff')
  }

  render () {
    return <div>
      <CircularProgress color='#0da95f'/>
    </div>
  }
}

export default Auth
