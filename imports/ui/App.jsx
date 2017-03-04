import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { createContainer } from 'meteor/react-meteor-data'

import { Tasks } from '../api/tasks.js'

import Task from './Task.jsx'

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

    Tasks.insert({
      text: textField,
      createdAt: new Date()
    })

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
      filteredTasks = this.props.tasks.filter((task) => {
        if (!task.checked) return task
      })
    }

    return filteredTasks.map((task) => {
      return <Task key={task._id} task={task} />
    })
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Todo List</h1>

          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}
            />
            Hide Completed Tasks
          </label>

          <form onSubmit={this.handleSubmit.bind(this)} className="new-task">
            <input
              type="text"
              ref="textInput"
              placeholder="Add a new task here!"
            />
          </form>
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
}

export default createContainer(() => {
  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1} }).fetch(),
  }
}, App)
