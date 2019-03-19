import React from 'react' 
import {get, post} from '../data/remote.js'

class authService extends React.Component{
  auth(data, isSignUp){ 
    return post('/auth/sign' + (isSignUp ? 'up' : 'in'),  data)
  }
}


export default authService

