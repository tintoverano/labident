if (Meteor.isClient) {

  Template.weekStripe.helpers ({
    options: function () {
      return {
        defaultView: 'basicWeek',
        firstDay: 1,
        height: 150
      }
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
