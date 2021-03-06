import React, { Component, PropTypes } from 'react'
import { Meteor } from 'meteor/meteor'
import classnames from 'classnames'

//  METHODS: no longer need to import { Tasks } b/c of methods now being used
// import { Tasks } from '../api/tasks.js'

export default class Task extends Component {
  toggleChecked() {
    // Tasks.update(this.props.task._id, {
    //   $set: { checked: !this.props.task.checked },
    // })

    Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked)
  }

  deleteThisTask() {
    Meteor.call('tasks.remove', this.props.task._id)
  }

  togglePrivate() {
    Meteor.call('tasks.setPrivate', this.props.task._id, ! this.props.task.private)
  }

  render() {
    // const taskClassName = this.props.task.checked ? 'checked' : ''
    const taskClassName = classnames({
      checked: this.props.task.checked,
      private: this.props.task.private,
    })

    return (
      <li className='taskClassName'>
        <button className="delete" onClick={this.deleteThisTask.bind(this)}>
          &times;
        </button>

        <input
          type="checkbox"
          readOnly
          checked={this.props.task.checked}
          onClick={this.toggleChecked.bind(this)}
        />

        {
          this.props.showPrivateButton ? (
            <button className="toggle-private" onClick={this.togglePrivate.bind(this)}>
              { this.props.task.private ? 'Private' : 'Public'}
            </button>
          ) : ''
        }

        <span className="text">
          <strong>{this.props.task.username}</strong>: {this.props.task.text}
        </span>
      </li>
    )
  }
}

Task.propTypes = {
  task: PropTypes.object.isRequired,
  showPrivateButton: React.PropTypes.bool.isRequired,
}

// console.log('PropTypes from React: ', PropTypes);
// console.log('Task.propTypes: ', Task.propTypes);
