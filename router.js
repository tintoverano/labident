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
    return [
      Meteor.subscribe ("jobs"),
      Meteor.subscribe ("patientImages"),
      Meteor.subscribe ("patientFiles")
    ];
  },

  data: function () {
    return Jobs.findOne ({_id: Session.get ("job_id")}, {arrivalDate: 1, dueDate: 1, status: 1, invoiceNumber: 1, shipping: 1, warranty: 1, memo: 1});
  },

  action: function () {
    this.render('editJobDetails');
  }
});

Router.route ('editPatient', {
  loadingTemplate: 'loadingJobs',

  waitOn: function () {
    return [
      Meteor.subscribe ("jobs"),
      Meteor.subscribe ("patientImages"),
      Meteor.subscribe ("patientFiles")
    ];
  },

  data: function () {
    return Jobs.findOne ({_id: Session.get ("job_id")}, {patient: 1});
  },

  action: function () {
    this.render('editPatient');
  }
});

Router.route ('editThirdParties', {
  loadingTemplate: 'loadingJobs',

  waitOn: function () {
    return [
      Meteor.subscribe ("jobs"),
      Meteor.subscribe ("patientImages"),
      Meteor.subscribe ("patientFiles")
    ];
  },

  data: function () {
    return Jobs.findOne ({_id: Session.get ("job_id")}, {thirdParties: 1});
  },

  action: function () {
    this.render('editThirdParties');
  }
});

Router.route ('editDentist', {
  loadingTemplate: 'loadingJobs',

  waitOn: function () {
    return [
      Meteor.subscribe ("jobs"),
      Meteor.subscribe ("patientImages"),
      Meteor.subscribe ("patientFiles")
    ];
  },

  data: function () {
    return Jobs.findOne ({_id: Session.get ("job_id")}, {dentist: 1});
  },

  action: function () {
    this.render('editDentist');
  }
});

Router.onBeforeAction (function () {
    if (!Meteor.userId ()) {
        this.render('askLogin');
    } else {
        this.next();
    }},
    {only: ['new']}
);
