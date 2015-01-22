Number.prototype.pad = function (size) {
  var s = String (this);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
};

Images = new FS.Collection ("patientImages", {
  stores: [new FS.Store.FileSystem ("patientImages", {path: "~/uploads"})],
  //stores: [new FS.Store.FileSystem ("patientImages")],
  filter: {
    allow: {
      contentTypes: ['image/*']
    }
  }
});


Files = new FS.Collection ("patientFiles", {
  stores: [new FS.Store.FileSystem ("patientFiles", {path: "~/uploads"})],
  //stores: [new FS.Store.FileSystem ("patientFiles")],
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

if (Meteor.isClient) {
  Meteor.startup (function () {
    Session.set ("activeJob", 0);
    //AutoForm.debug ();
    //SimpleSchema.debug = true;
  });

  Meteor.subscribe ("jobs");
  Meteor.subscribe ("patientImages");
  Meteor.subscribe ("patientFiles");

  theJob = {};
  teethTopLeft = [];
  teethBottomLeft = [];
  teethTopRight = [];
  teethBottomRight = [];

  Template.weekStripe.helpers ({
    options: function () {
      return {
        defaultView: 'basicWeek',
        firstDay: 1,
        height: 150
      }
    }
  });

  Template.notFoundPage.events ({
    'click #notFoundErrorMessage': function () {
      Router.go('/');
    }
  });

  Template.jobs.helpers ({

    jobs: function () {
      var items = Jobs.find({}, {sort: {dueDate: 1}}).map(function (doc, index) {
        var anIndex = index;
        return _.extend(doc, {index: index});
      });
      if (items[0] && Session.get ("job_id") == undefined) {
        Session.set("job_id", items[0]._id);
        console.log ("jobs template init: " + Session.get ("job_id"));
      }
      return items;
    },

    job: function () {
      console.log ("session job _id: " + Session.get ("job_id"));
      theJob = Jobs.findOne (Session.get ("job_id"));
      // az aktív indexűt kiválasztani
      if (theJob == undefined)
        console.log ("no Job @ job: function ()");
      else
        console.log (theJob._id);
      console.log ("job (template): " + Session.get ("activeJob"));
      return theJob;
    },

    simpleDate: function (aDate) {
      return moment(aDate).format('ll');
    },

    simpleDateTime: function (aDate) {
      return moment(aDate).format('lll');
    },

    jobStatus: function (aStatus) {
      if (aStatus != "Finished")
        return "fa-cogs";
      return "fa fa-check-square-o fa-3x";
    },

    jobStatusColor: function (aStatus) {
      if (aStatus != "Finished")
        return "red";
      return "green";
    },

    notActive: function (index) {
      return (index == Session.get ("activeJob"));
    },

    checkImplantTopLeft: function (aTooth) {
      //console.log ("checkImplantTopLeft");
      if (theJob != null) {
        //console.log (theJob._id);
        var toothDoc = _.findWhere (theJob.patient.teeth , {"tooth": aTooth});
        if (toothDoc) {
          var dia = "";
          var implant = _.findWhere(implantTypes, {value: toothDoc.implantPlatform});
          if (implant)
            dia = implant.dia;

          var icon = "fa-square-o";
          var marking = _.findWhere(markingTypes, {value: toothDoc.marking});
          if (marking)
            icon = marking.icon;

          var toothData = {};
          toothData["tooth"] = aTooth;
          toothData["dia"] = dia;
          toothData["implantName"] = toothDoc.implantPlatform;
          toothData["marking"] = icon;

          teethTopLeft.push(toothData);

          return true;
        }
      }
      return false;
    },

    getDiameterTopLeft: function (aTooth) {
      //console.log ("getDiameterTopLeft" + " " + aTooth);
      if (_.size (teethTopLeft) > 0) {
        var toothDoc = _.findWhere(teethTopLeft, {"tooth": aTooth});
        if (toothDoc)
          return toothDoc.dia;
      }
      return "";
    },

    getImplantNameTopLeft: function (aTooth) {
      //console.log ("getImplantNameTopLeft" + " " + aTooth);
      if (_.size (teethTopLeft) > 0) {
        var toothDoc = _.findWhere(teethTopLeft, {"tooth": aTooth});
        if (toothDoc)
          return toothDoc.implantName;
      }
      return "";
    },

    checkImplantIconTopLeft: function (aTooth) {
      //console.log ("checkImplantIconTopLeft" + " " + aTooth);
      if (_.size (teethTopLeft) > 0) {
          var toothDoc = _.findWhere(teethTopLeft, {"tooth": aTooth});
          if (toothDoc)
              return toothDoc.marking;
      }
      return "fa-square-o";
    },

    checkImplantBottomLeft: function (aTooth) {
      //console.log ("checkImplantBottomLeft");
      if (_.size (teethBottomLeft) > 0)
        if (_.findWhere(teethBottomLeft, {"tooth": aTooth}))
          return true;
      return false;
    },

    getDiameterBottomLeft: function (aTooth) {
      //console.log ("getDiameterBottomLeft" + " " + aTooth);
      if (_.size (teethBottomLeft) > 0) {
        var toothDoc = _.findWhere(teethBottomLeft, {"tooth": aTooth});
        if (toothDoc)
          return toothDoc.dia;
      }
      return "";
    },

    getImplantNameBottomLeft: function (aTooth) {
      //console.log ("getImplantNameBottomLeft" + " " + aTooth);
      if (_.size (teethBottomLeft) > 0) {
        var toothDoc = _.findWhere(teethBottomLeft, {"tooth": aTooth});
        if (toothDoc)
          return toothDoc.implantName;
      }
      return "";
    },

    checkImplantIconBottomLeft: function (aTooth) {
      //console.log ("checkImplantIconBottomLeft" + " " + aTooth);
      if (theJob != null) {
        //console.log (theJob._id);
        var toothDoc = _.findWhere (theJob.patient.teeth , {"tooth": aTooth});
        if (toothDoc) {
          var dia = "";
          var implant = _.findWhere(implantTypes, {value: toothDoc.implantPlatform});
          if (implant)
            dia = implant.dia;

          var icon = "fa-square-o";
          var marking = _.findWhere(markingTypes, {value: toothDoc.marking});
          if (marking)
            icon = marking.icon;

          var toothData = {};
          toothData["tooth"] = aTooth;
          toothData["dia"] = dia;
          toothData["implantName"] = toothDoc.implantPlatform;
          toothData["marking"] = icon;

          teethBottomLeft.push(toothData);
        }
      }
      if (_.size (teethBottomLeft) > 0) {
        var theTooth = _.findWhere (teethBottomLeft, {"tooth": aTooth});
        if (theTooth)
          return theTooth.marking;
      }
      return "fa-square-o";
    },

    checkImplantTopRight: function (aTooth) {
      //console.log ("checkImplantTopRight");
      if (theJob != null) {
        //console.log (theJob._id);
        var toothDoc = _.findWhere (theJob.patient.teeth , {"tooth": aTooth});
        if (toothDoc) {
          var dia = "";
          var implant = _.findWhere(implantTypes, {value: toothDoc.implantPlatform});
          if (implant)
            dia = implant.dia;

          var icon = "fa-square-o";
          var marking = _.findWhere(markingTypes, {value: toothDoc.marking});
          if (marking)
            icon = marking.icon;

          var toothData = {};
          toothData["tooth"] = aTooth;
          toothData["dia"] = dia;
          toothData["implantName"] = toothDoc.implantPlatform;
          toothData["marking"] = icon;

          teethTopRight.push(toothData);

          return true;
        }
      }
      return false;
    },

    getDiameterTopRight: function (aTooth) {
      //console.log ("getDiameterTopRight" + " " + aTooth);
      if (_.size (teethTopRight) > 0) {
        var toothDoc = _.findWhere (teethTopRight , {"tooth": aTooth});
        if (toothDoc)
          return toothDoc.dia;
      }
      return "";
    },

    getImplantNameTopRight: function (aTooth) {
      //console.log ("getImplantNameTopRight" + " " + aTooth);
      if (_.size (teethTopRight) > 0) {
        var toothDoc = _.findWhere(teethTopRight, {"tooth": aTooth});
        if (toothDoc)
          return toothDoc.implantName;
      }
      return "";
    },

    checkImplantIconTopRight: function (aTooth) {
      //console.log ("checkImplantIconTopRight" + " " + aTooth);
      if (_.size (teethTopRight) > 0) {
        var toothDoc = _.findWhere(teethTopRight, {"tooth": aTooth});
        if (toothDoc)
          return toothDoc.marking;
      }
      return "fa-square-o";
    },

    checkImplantBottomRight: function (aTooth) {
      //console.log ("checkImplantBottomRight");
      if (_.size (teethBottomRight) > 0)
        if (_.findWhere (teethBottomRight , {"tooth": aTooth}))
          return true;
      return false;
    },

    getDiameterBottomRight: function (aTooth) {
      //console.log ("getDiameterBottomRight" + " " + aTooth);
      if (_.size (teethBottomRight) > 0) {
        var toothDoc = _.findWhere (teethBottomRight , {"tooth": aTooth});
        if (toothDoc)
          return toothDoc.dia;
      }
      return "";
    },

    getImplantNameBottomRight: function (aTooth) {
      //console.log ("getImplantNameBottomRight" + " " + aTooth);
      if (_.size (teethBottomRight) > 0) {
        var toothDoc = _.findWhere(teethBottomRight, {"tooth": aTooth});
        if (toothDoc)
          return toothDoc.implantName;
      }
      return "";
    },

    checkImplantIconBottomRight: function (aTooth) {
      //console.log ("checkImplantIconBottomRight" + " " + aTooth);
      if (theJob != null) {
        //console.log (theJob._id);
        var toothDoc = _.findWhere (theJob.patient.teeth , {"tooth": aTooth});
        if (toothDoc) {
          var dia = "";
          var implant = _.findWhere(implantTypes, {value: toothDoc.implantPlatform});
          if (implant)
            dia = implant.dia;

          var icon = "fa-square-o";
          var marking = _.findWhere(markingTypes, {value: toothDoc.marking});
          if (marking)
            icon = marking.icon;

          var toothData = {};
          toothData["tooth"] = aTooth;
          toothData["dia"] = dia;
          toothData["implantName"] = toothDoc.implantPlatform;
          toothData["marking"] = icon;

          teethBottomRight.push(toothData);
        }
      }
      if (_.size (teethBottomRight) > 0) {
        var theTooth = _.findWhere(teethBottomRight, {"tooth": aTooth});
        if (theTooth)
          return theTooth.marking;
      }
      return "fa-square-o";
    },

    getImageUrl: function (pictId) {
      return Images.findOne (pictId).url ();
    },

    getImageName: function (pictId) {
      return Images.findOne (pictId).name ();
    },

    getFileUrl: function (fileId) {
      return Files.findOne (fileId).url ();
    },

    getFileName: function (fileId) {
      return Files.findOne (fileId).name ();
    }
  });

  Template.jobs.events ({
    "click #jobListItem": function () {
      var clickedJob = this.index;
      if (Session.get ("activeJob") != clickedJob) {
        Session.set ("activeJob", clickedJob);
        console.log ("before click job : " + Session.get ("job_id"));
        console.log ("after click job : " + this._id);
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
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
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
}
