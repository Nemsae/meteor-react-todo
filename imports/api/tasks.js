import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { check } from 'meteor/check'

export const Tasks = new Mongo.Collection('tasks')

//  PUBLICATION
//  Publish: $ meteor remove autopublish
if (Meteor.isServer) {
  Meteor.publish('tasks', function tasksPublication() {
    return Tasks.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId },
      ]
    })
  })
}

//  Purpose: Securely verify that the user is logged in
//  Check: fields are correct
Meteor.methods({
  'tasks.insert'(text) {
    check(text, String)

    //  Check if user is logged in before inserting a Task
    if (!this.userId) {
      throw new Meteor.Error('not-authorized')
    }

    Tasks.insert({
      text,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
    })
  },

  'tasks.remove'(taskId) {
    check(taskId, String)

    const task = Tasks.findOne(taskId)

    if (task.private && task.owner !== this.userId) {
      //  if task is private, only owner can delete
      throw new Meteor.Error('not-authorized')
    }

    if (task.owner !== this.userId) {
      throw new Meteor.Error('Only the task owner may remove this task.')
    }

    Tasks.remove(taskId)
  },

  'tasks.setChecked'(taskId, setChecked) {
    check(taskId, String)
    check(setChecked, Boolean)

    const task = Tasks.findOne(taskId)

    if (task.private && task.owner !== this.userId) {
      throw new Meteor.Error('not-authorized')
    }

    Tasks.update(taskId, { $set: { checked: setChecked } })
  },

  'tasks.setPrivate'(taskId, setToPrivate) {
    check(taskId, String)
    check(setToPrivate, Boolean)

    const task = Tasks.findOne(taskId)

    //  Checking if the task owner is the current user
    if (task.owner !== this.userId) {
      throw new Meteor.Error('not-authorized')
    }

    Tasks.update(taskId, { $set: { private: setToPrivate }})
  },
})
