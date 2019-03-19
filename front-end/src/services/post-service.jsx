import React from 'react' 
import {get, post} from '../data/remote.js'

class postService extends React.Component{
  getPost(data){
    
    return get('/feed/posts', data)
  }
  
  createPost(data) {
    return post('/feed/post/create', data)
  }
}


export default postService

