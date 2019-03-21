import React from 'react' 
import {post} from '../data/remote.js'

class commentService extends React.Component{
  
  createComment(data) {
    return post('/feed/comment/create', data)
  }
}


export default commentService