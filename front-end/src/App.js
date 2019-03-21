import React, { Component, Fragment } from 'react';
import { Route, Switch, Redirect, withRouter, } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './views/Home/Home';
import Login from './views/Login/Login';
import Register from './views/Register/Register';
import About from './views/About/About';
import Create from './views/Create/Create';
import Details from './views/Details/Details';
import PrivateRoute from './components/PrivateRoute';
import Edit from './views/Edit/Edit';
import Delete from './views/Delete/Delete';
import AllPosts from './views/All/All';

import PostService from "./services/post-service";
import AuthService from "./services/auth-service";
import CommentService from "./services/comment-service";

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userId: null,
      username: null,
      isAdmin: false,
      isAuthed: false,
      jwtoken: null,
      posts: [],
      filtered: [],
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  static authService = new AuthService();
  static postService = new PostService();
  static commentService = new CommentService();

  componentDidMount() {

    const isAdmin = localStorage.getItem('isAdmin') === "true"
    const isAuthed = !!localStorage.getItem('username');

    if (isAuthed) {
      this.setState({
        userId: localStorage.getItem('userId'),
        username: localStorage.getItem('username'),
        isAdmin,
        isAuthed,
      })
    }
    this.getPosts()
    
  }

  componentDidUpdate(prevProps, prevState, posts) {
    if (prevState === this.state) {
      this.getPosts()
    }
  }

  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  handleChange(e, data) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSearchChange(e, data) {
    let posts = this.state.posts;
    let searchedText = [];
    let filteredPosts = [];
    if (e.target.value) {
      searchedText = e.target.value
      filteredPosts = posts.filter(p => p.title.toLowerCase().includes(searchedText))
      this.setState({
        posts: filteredPosts
      })
    }

  }

  handleSearchSubmit(e) {
    e.preventDefault()

  }

  handleSubmit(e, data, isSignUp) {

    e.preventDefault()
    App.authService.auth(data, isSignUp)
      .then(user => {
        this.updateUser(user)
      })
      .catch(e => console.log(e));
  }

  handleCreateSubmit(e, data) {

    e.preventDefault();
    if (this.state.isAdmin) {
      App.postService.createPost(data)
        .then(body => {

          if (body.Post) {
            toast.success(body.message);
            this.props.history.push('/');
          }
          else {
            toast.error(body.message);
          }
        })
        .catch(error => console.error(error));
    }
  }

  handleCommentSubmit(e, data) {

    e.preventDefault();
    e.target.reset();
    App.commentService.createComment(data)
      .then(body => {
        if (!body.errors) {
          window.location.reload()
          toast.success(body.message);
        }
        else {
          toast.error(body.message);
        }
      }
      )
      .catch(error => console.error(error));

  }

  getPosts() {
    App.postService.getPost()
      .then(data => {
        this.setState({
          posts: data.posts.length? data.posts : []
        });
      }
      )
      .catch(e => this.setState({ e }))
  }

  updateUser = (data) => {
    if (data.username) {
      this.setState({
        userId: data.userId,
        username: data.username,
        isAdmin: data.isAdmin,
        isAuthed: !!data.username,
        jwtoken: data.token
      })

      localStorage.setItem('userId', data.userId)
      localStorage.setItem('username', data.username)
      localStorage.setItem('isAdmin', data.isAdmin)
      localStorage.setItem('isAuthed', !!data.username)
      localStorage.setItem('jwtoken', data.token)

      toast.success('Welcome, ' + data.username);
      this.props.history.push('/')
    }
    else {
      toast.error(data.message);
    }

  }

  logout() {

    this.setState({
      userId: null,
      username: null,
      isAdmin: false,
      isAuthed: false,
    })
    localStorage.clear();
    toast.success("You have been successfully logged out!")
  }

  render() {

    return (
      <Fragment>
        <ToastContainer />
        <Header username={this.state.username} isAdmin={this.state.isAdmin} isAuthed={this.state.isAuthed} logout={this.logout.bind(this)} />

        <Switch>

          <Route exact path="/" render={(props) => (
            <Home
              posts={this.state.posts}
              handleSearchSubmit={this.handleSearchSubmit.bind(this)}
              handleChange={this.handleSearchChange.bind(this)}
              formatDate={this.formatDate}
              {...props} />
          )} />

          <Route path="/login" render={(props) =>
            this.state.isAuthed ?
              <Redirect to="/" />
              :
              <Login
                handleSubmit={this.handleSubmit.bind(this)}
                handleChange={this.handleChange}
                history={this.props.history}
                {...props} />} />

          <Route path="/register" render={(props) =>
            this.state.isAuthed ?
              <Redirect to="/" />
              :
              <Register
                handleSubmit={this.handleSubmit.bind(this)}
                handleChange={this.handleChange}
                history={this.props.history}
                {...props} />} />

          <Route path="/logout" render={(props) => {

            return (<Redirect to="/login" />)
          }} />;

          <PrivateRoute path="/create"
            isAdmin={this.state.isAdmin} render={(props) =>
              <Create handleSubmit={this.handleCreateSubmit.bind(this)}
                handleChange={this.handleChange}
                history={this.props.history}
                {...props} />} />

          <Route path="/posts/:id" render={(props) =>
            <Details handleSubmit={this.handleCommentSubmit.bind(this)}
              isAdmin={this.state.isAdmin}
              isAuthed={this.state.isAuthed}
              posts={this.state.posts}
              handleChange={this.handleChange}
              formatDate={this.formatDate}
              {...props} />} />

          <PrivateRoute path="/edit/:id"
            isAdmin={this.state.isAdmin} render={(props) =>
              <Edit
                isAdmin={this.state.isAdmin}
                getPosts={this.getPosts.bind(this)}
                handleChange={this.handleChange}
                history={this.props.history}
                {...props} />} />

          <PrivateRoute path="/delete/:id"
            isAdmin={this.state.isAdmin} render={(props) =>
              <Delete
              isAdmin={this.state.isAdmin}
                handleChange={this.handleChange}
                history={this.props.history}
                {...props} />} />

          <Route path="/about" render={(props) => (
            <About posts={this.state.posts}
              handleChange={this.handleSearchChange.bind(this)}
              formatDate={this.formatDate}
              {...props} />
          )} />

          <Route path="/all" render={(props) => (
            <AllPosts posts={this.state.posts}
              handleSearchSubmit={this.handleSearchSubmit.bind(this)}
              handleChange={this.handleSearchChange.bind(this)}
              formatDate={this.formatDate}
              {...props} />
          )} />
        </Switch>

        <Footer posts={this.state.posts} formatDate={this.formatDate} />
      </Fragment>
    );
  }
}

export default withRouter(App);