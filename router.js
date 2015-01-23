Router.configure({
    notFoundTemplate: 'notFoundPage'
});


Router.route ('/',  {
  loadingTemplate: 'loadingJobs',

  waitOn: function () {
    return [
      Meteor.subscribe ("jobs"),
      Meteor.subscribe ("patientImages"),
      Meteor.subscribe ("patientFiles")
    ];
  },

  action: function () {
      this.render('home');
  }
});

Router.route ('new', function () {
    this.render('newJob');
});

Router.route ('editJobDetails', {
  loadingTemplate: 'loadingJobs',

  waitOn: function () {
    return Meteor.subscribe ("jobs");
  },

  data: function () {
    return Jobs.findOne ({_id: Session.get ("job_id")});
  },

  action: function () {
    this.render('editJobDetails');
  }
});


Router.onBeforeAction (function () {
    if (!Meteor.userId()) {
        this.render('askLogin');
    } else {
        this.next();
    }},
    {only: ['new']}
);
