import React, { Component } from 'react';
import { toast } from 'react-toastify';
import PostService from '../../services/post-service'

class Delete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      title: null,
      imageUrl: null,
      content: null,
    }
    this.handleChange = props.handleChange.bind(this);
    this.PostService = new PostService();
  }

  componentDidMount() {
    this.deleteGet();
  }

  deleteGet() {
    this.PostService.deleteGet(this.props.match.params.id)
      .then(body => {
        if (body.post) {

          this.setState({
            id: body.post.id,
            title: body.post.title,
            imageUrl: body.post.imageUrl,
            content: body.post.content
          })
        }
      })
      .catch(error => console.error(error));

  }

  deletePost(e, data) {
    e.preventDefault();
    if (this.props.isAdmin) {
      this.PostService.deletePost({
        id: this.props.match.params.id,
        data: data
      })
        .then(body => {
          if (!body.errors) {
            toast.success(body.message)
            this.props.history.push('/')
          }
          else {
            toast.error(body.message)
          }

        })
        .catch(error => console.error(error));
    }
   
  }

  render() {

    return (
      <main className="text-center form">
        <div className="form-wrapper">
          <h1>Delete Post</h1>
          <form className="submit-form" onSubmit={(e) => this.deletePost(e, this.state)}>
            <div className="row">
              <div className="col-md-12 form-group">
                <label htmlFor="title">Title</label>
                <input type="text" onChange={this.handleChange} name="title" value={this.state.title} id="title" className="form-control" disabled />
              </div>
              <div className="col-md-12 form-group">
                <label htmlFor="description">Featured image</label>
                <input type="text" onChange={this.handleChange} name="imageUrl" value={this.state.imageUrl} id="imageUrl" className="form-control" disabled />
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 form-group">
                <label htmlFor="content">Content</label>
                <textarea name="content" value={this.state.content} onChange={this.handleChange} id="content" className="form-control " cols={30} rows={8} defaultValue={""} disabled />
              </div>
            </div>
            <button className="btn btn-lg btn-primary btn-block" type="submit">Delete</button>
          </form>
        </div>
      </main>
    );
  }
}

export default Delete;