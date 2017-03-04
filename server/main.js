import { Meteor } from 'meteor/meteor';

import '../imports/api/tasks.js'
// Importing the module here on the server creates the MongoDB collection and setsup the plumbing to get the data to the client

Meteor.startup(() => {
  // code to run on server at startup
});
