Number.prototype.pad = function (size) {
  var s = String (this);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
};

Images = new FS.Collection ("patientImages", {
  stores: [new FS.Store.FileSystem ("patientImages", {path: "/opt/cfs/labident/images"})],
  filter: {
    allow: {
      contentTypes: ['image/*']
    }
  }
});

Files = new FS.Collection ("patientFiles", {
  stores: [new FS.Store.FileSystem ("patientFiles", {path: "/opt/cfs/labident/files"})],
  filter: {
    deny: {
      contentTypes: ['image/*']
    }
  }
});

Images.allow ({
  insert: function (userId, doc) {
    // the user must be logged in, and the document must be owned by the user
    //return (userId && doc.owner === userId);
    return true;
  },
  update: function (userId, doc, fields, modifier) {
    // can only change your own documents
    //return doc.owner === userId;
    return true;
  },
  remove: function (userId, doc) {
    // can only remove your own documents
    //return doc.owner === userId;
    return false;
  }
});

Files.allow ({
  insert: function (userId, doc) {
    // the user must be logged in, and the document must be owned by the user
    //return (userId && doc.owner === userId);
    return true;
  },
  update: function (userId, doc, fields, modifier) {
    // can only change your own documents
    //return doc.owner === userId;
    return true;
  },
  remove: function (userId, doc) {
    // can only remove your own documents
    //return doc.owner === userId;
    return false;
  }
});

if (Meteor.isClient) {
  Meteor.startup (function () {
    //AutoForm.debug ();
    //SimpleSchema.debug = true;
  });

  theJob = {};
  teethTopLeft = [];
  teethBottomLeft = [];
  teethTopRight = [];
  teethBottomRight = [];

  dueDates = [];

  var searchOptions = {
    keepHistory: 1000 * 60,
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
        sort: {dueDate: 1}
      });
      items.map (function (doc, index) {
        return _.extend (doc, {index: index});
      });
      for (var i = 0, l = items.length; i < l; i++) {
        dueDates [i] = {title: items[i].jobNumber, start: items[i].dueDate, backgroundColor: "red"};
      };
      if (i != 0)
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
    }
  });

  Template.jobs.events ({
    "keyup #searchBox": _.throttle (function (e) {
      var text = $(e.target).val ().trim ();
      Session.set ("activeJob", -1);
      Session.set ("job_id", null);
      dueDates = [];
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
    }
  });

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
          var aJob;
          while (aJob = Jobs.findOne ({jobNumber: myJobNumber}, {jobNumber: 1})) {
            myJobNumber = today.getFullYear () % 100 + ('0' + (today.getMonth () +1)).slice (-2) + (++nextJobNumber).pad(3);
          };
          doc.jobNumber = myJobNumber;
          return this.result (doc);
        }
      },

      onSuccess: function (operation, result, template) {
        Router.go("/");
      }
    },

    editJobDetails: {
      onSuccess: function (operation, result, template) {
        Router.go("/");
      }
    },

    editPatient: {
      onSuccess: function (operation, result, template) {
        Router.go("/");
      }
    },

    editThirdParties: {
      onSuccess: function (operation, result, template) {
        Router.go("/");
      }
    },

    editDentist: {
      onSuccess: function (operation, result, template) {
        Router.go("/");
      }
    }
  });
}

if (Meteor.isServer) {

  //Kadira.connect ('mngy4najCxkLiREdf', '794692bb-703d-4a6a-8150-2f3c8fbe9434')

  Meteor.startup (function () {
    Jobs._ensureIndex ({"dentist.name": 1}, {"patient.name": 1}, {jobNumber: 1});
  });

  Meteor.publish ("jobs", function () {
    Counts.publish (this, 'totalJobs', Jobs.find (), {noReady: true});
    return (Jobs.find ());
  });

  Meteor.publish ("patientImages", function () {
    return (Images.find ());
  });

  Meteor.publish ("patientFiles", function () {
    return (Files.find ());
  });

  Meteor.methods ({
  });

  SearchSource.defineSource ('jobs', function (searchText, options) {
    var options = {sort: {dueDate: 1}};

    if (searchText) {
      var regExp = buildRegExp (searchText);
      var selector = {$or: [
        {jobNumber: regExp},
        {"dentist.name": regExp},
        {"patient.name": regExp}
      ]};
      return Jobs.find (selector, options).fetch ();
    }
    return Jobs.find ({}, options).fetch ();
  });

  function buildRegExp (searchText) {
    var parts = searchText.trim ().split (/[ \-\:]+/);
    return new RegExp ("(" + parts.join ('|') + ")", "ig");
  }
}
