import React from 'react' 
import {get, post} from '../data/remote.js'


class postService extends React.Component{
  getPost(data){
    
    return get('/feed/posts', data)
  }
  
  createPost(data) {
    return post('/feed/post/create', data)
  }

  editGet(id) {
    return get(`/feed/post/edit/${id}`)
  }

  editPost(data) {
    return post(`/feed/post/edit/${data.id}`, data.data)
  }

  deleteGet(id) {
    return get(`/feed/post/delete/${id}`)
  }

  deletePost(data) {
    return post(`/feed/post/delete/${data.id}`, data.data)
  }
}


export default postService

