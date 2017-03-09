import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Meteor } from 'meteor/meteor'
import { createContainer } from 'meteor/react-meteor-data'

import { Tasks } from '../api/tasks.js'

import Task from './Task.jsx'
import AccountsUIWrapper from './AccountsUIWrapper.jsx'

class App extends Component {
  constructor (props) {
    super(props);

    this.state = {
      hideCompleted: false,
    }
  }

  handleSubmit(e) {
    e.preventDefault()

    const textField = ReactDOM.findDOMNode(this.refs.textInput).value.trim()

    //  Check for FB user or Regular User
    // let username = Meteor.user().profile ? Meteor.user().profile.name : Meteor.user().username

    // Tasks.insert({
    //   text: textField,
    //   createdAt: new Date(),
    //   owner: Meteor.userId(),
    //   username,
    // })

    Meteor.call('tasks.insert', textField)

    ReactDOM.findDOMNode(this.refs.textInput).value = ''
  }

  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    })
  }

  renderTasks() {
    let filteredTasks = this.props.tasks

    if (this.state.hideCompleted) {
      filteredTasks = this.props.tasks.filter(task => !task.checked)
      // filteredTasks = this.props.tasks.filter((task) => {
      //   if (!task.checked) return task
      // })
    }

    return filteredTasks.map((task) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id
      const showPrivateButton = task.owner === currentUserId

      return (
        <Task
          key={task._id}
          task={task}
          showPrivateButton
        />
      )
    })
  }

  render() {
    console.log('currentUser: ', this.props.currentUser);
    return (
      <div className="container">
        <header>
          <h1>Todo List ({this.props.incompleteCount})</h1>

          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}
            />
            Hide Completed Tasks
          </label>

          <AccountsUIWrapper />

          { this.props.currentUser ?
            <form onSubmit={this.handleSubmit.bind(this)} className="new-task">
              <input
                type="text"
                ref="textInput"
                placeholder="Add a new task here!"
              />
            </form> : ''
          }
        </header>


        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    )
  }
}

App.propTypes = {
  tasks: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object,
}

export default createContainer(() => {
  //  SUBSCRIPTION
  Meteor.subscribe('tasks')

  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1} }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  }
}, App)
