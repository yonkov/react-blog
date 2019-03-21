import React, { Component } from 'react';
import { toast } from 'react-toastify'
import PostService from '../../services/post-service'

class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      imageUrl: '',
      content: '',
    }
    this.handleChange = props.handleChange.bind(this);
    this.PostService = new PostService();

  }

  componentDidMount() {
    this.editGet()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.title !== this.state.title) {
      return;
    }
  }

  editGet() {
    this.PostService.editGet(this.props.match.params.id)
      .then(body => {
        if (body.post) {

          this.setState({
            title: body.post.title,
            imageUrl: body.post.imageUrl,
            content: body.post.content
          })
        }
      })
      .catch(error => console.error(error));
  }

  editPost(e, data) {
    e.preventDefault();
    if (this.props.isAdmin) {
      this.PostService.editPost({
        id: this.props.match.params.id,
        data: data
      })
        .then(body => {
          if (!body.errors) {
            toast.success(body.message)
            this.props.history.push('/')
          }
          else {
            console.log(body.message)
          }

        })
        .catch(error => console.error(error));

    }
  }

  render() {
    return (
      <main className="text-center form">
        <div className="form-wrapper">
          <h1>Edit Post</h1>
          <form className="submit-form" onSubmit={(e) => this.editPost(e, this.state)}>
            <div className="row">
              <div className="col-md-12 form-group">
                <label htmlFor="title">Title</label>
                <input type="text" onChange={this.handleChange} name="title" value={this.state.title} id="title" className="form-control " />
              </div>
              <div className="col-md-12 form-group">
                <label htmlFor="description">Featured image</label>
                <input type="text" onChange={this.handleChange} name="imageUrl" value={this.state.imageUrl} id="imageUrl" className="form-control " />
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 form-group">
                <label htmlFor="content">Content</label>
                <textarea name="content" value={this.state.content} onChange={this.handleChange} id="content" className="form-control " cols={30} rows={8} defaultValue={""} />
              </div>
            </div>
            <button className="btn btn-lg btn-primary btn-block" type="submit">Edit</button>
          </form>
        </div>
      </main>
    );
  }
}

export default Edit;