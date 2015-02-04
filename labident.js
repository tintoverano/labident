if (Meteor.isClient) {
  Number.prototype.pad = function (size) {
    var s = String (this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
  };

  Meteor.startup (function () {
    //AutoForm.debug ();
    //SimpleSchema.debug = true;
    alertify.set ('notifier','position', 'top-right');
    alertify.set('notifier','delay', 5);
  });

  theJob = {};
  teethTopLeft = [];
  teethBottomLeft = [];
  teethTopRight = [];
  teethBottomRight = [];

  dueDates = [];

  var searchOptions = {
    keepHistory: 0,
    localSearch: true
  };
  var searchFields = ['jobNumber', 'dentist.name', 'patient.name'];
  JobSearch = new SearchSource ('jobs', searchFields, searchOptions);

  Template.notFoundPage.events ({
    'click #notFoundErrorMessage': function () {
      Router.go('/');
    }
  });

  Template.jobs.rendered = function () {
    JobSearch.search ('');
  };

  Template.jobs.helpers ({
    jobs: function () {
      var items = JobSearch.getData ({
        transform: function (matchText, regExp) {
          return matchText;
//          return matchText.replace (regExp, "<b>$&</b>")
        },
        sort: {dueDate: 1},
        limit: 0
      });
      items.map (function (doc, index) {
        return _.extend (doc, {index: index});
      });
      dueDates = [];
      for (var i = 0, l = items.length; i < l; i++) {
        dueDates [i] = {title: items[i].jobNumber, start: items[i].dueDate, backgroundColor: "red"};
      };
      $('#jobCal').fullCalendar ('refetchEvents');
      return items;
    },

    job: function () {
      var jobId = Session.get ("job_id");
      if (jobId != null)
        theJob = Jobs.findOne (jobId);
      else
        theJob = null;
      return theJob;
    },

    simpleDate: function (aDate) {
      return moment (aDate).format ('ll');
    },

    notActive: function (index) {
      return (index == Session.get ("activeJob"));
    },

    getInProgress: function () {
      return (UserSession.get ("checkInProgress", Meteor.userId ()) == "In progress" ? "checked" : "");
    }
  });

  Template.jobs.events ({
    "keyup #searchBox": _.throttle (function (e) {
      var text = $(e.target).val ().trim ();
      Session.set ("activeJob", -1);
      Session.set ("job_id", null);
      JobSearch.search (text);
    }, 200),

    "click #jobListItem": function () {
      var clickedJob = this.index;
      if (Session.get ("activeJob") != clickedJob) {
        Session.set ("activeJob", clickedJob);
        Session.set ("job_id", this._id);
        teethTopLeft = [];
        teethBottomLeft = [];
        teethTopRight = [];
        teethBottomRight = [];
      }
    },

    "click #checkInProgress": function (event) {
      UserSession.set ("checkInProgress", event.currentTarget.checked ? "In progress" : "Finished", Meteor.userId ());
      //console.log (UserSession.get ("checkInProgress"));
      Session.set ("activeJob", -1);
      Session.set ("job_id", null);
      JobSearch.search ('');
    }
  });

  function jobFormSuccess (newJob) {
    var updateSuccces = "Your changes are saved.";
    var createSuccess = "New job is created.";

    if (newJob)
      alertify.success (createSuccess);
    else
      alertify.success (updateSuccces);
  };

  AutoForm.hooks ({
    newJob: {
      before: {
        insert: function (doc, template) {
          //return doc; (synchronous)
          //return false; (synchronous, cancel)
          //this.result(doc); (asynchronous)
          //this.result(false); (asynchronous, cancel)
          var today = new Date ();
          var nextJobNumber = 1;
          var myJobNumber = today.getFullYear () % 100 + ('0' + (today.getMonth () +1)).slice (-2) + nextJobNumber.pad(3);
          //var aJob;
          while (Jobs.findOne ({jobNumber: myJobNumber}, {jobNumber: 1})) {
            myJobNumber = today.getFullYear () % 100 + ('0' + (today.getMonth () +1)).slice (-2) + (++nextJobNumber).pad(3);
          };
          doc.jobNumber = myJobNumber;
          return this.result (doc);
        }
      },

      onSubmit: function (insertDoc, updateDoc, currentDoc) {
        // You must call this.done()!
        //this.done(); // submitted successfully, call onSuccess
        //this.done (new Error ('Please check form for problems.')); // failed to submit, call onError with the provided error
        //this.done(null, "foo"); // submitted successfully, call onSuccess with `result` arg set to "foo"
      },

      onError: function (operation, error, template) {
        alertify.error (error.message);
      },

      onSuccess: function (operation, result, template) {
        jobFormSuccess (true);
        Router.go("/");
      }
    },

    editJobDetails: {
      onError: function (operation, error, template) {
        alertify.error (error.message);
      },

      onSuccess: function (operation, result, template) {
        jobFormSuccess ();
        Router.go("/");
      }
    },

    editPatient: {
      onError: function (operation, error, template) {
        alertify.error (error.message);
      },

      onSuccess: function (operation, result, template) {
        jobFormSuccess ();
        Router.go("/");
      }
    },

    editThirdParties: {
      onError: function (operation, error, template) {
        alertify.error (error.message);
      },

      onSuccess: function (operation, result, template) {
        jobFormSuccess ();
        Router.go("/");
      }
    },

    editDentist: {
      onError: function (operation, error, template) {
        alertify.error (error.message);
      },

      onSuccess: function (operation, result, template) {
        jobFormSuccess ();
        Router.go("/");
      }
    }
  });
}

if (Meteor.isServer) {
}
