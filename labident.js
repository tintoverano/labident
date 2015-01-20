if (Meteor.isClient) {
  Meteor.startup (function () {
    //Meteor.call ('initJobNumber', function (error, results) {
      //console.log (results); //results.data should be a JSON object
    //});
  });

  Meteor.subscribe("jobs");

  Session.set ("activeJob", 0);

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

/*  Template.jobs.created = function () {
    this.teethTopLeftList = [18, 17, 16, 15, 14, 13, 12, 11];
    this.teethTopRightList = [21, 22, 23, 24, 25, 26, 27, 28];
    this.teethBottomLeftList =  [48, 47, 46, 45, 44, 43, 42, 41];
    this.teethBottomRightList = [31, 32, 33, 34, 35, 36, 37, 38];
  };
*/
  Template.jobs.helpers ({

    jobs: function () {
      var items = Jobs.find ({}, {sort: {dueDate: 1}}).map (function (doc, index) {
        return _.extend (doc, {index: index});
      });
      var firstJob = Jobs.findOne ({}, {sort: {dueDate: 1}});
      if (firstJob)
        Session.set ("job_id", firstJob._id);
      else
        console.log ("no firstJob");
      return items;
    },

    job: function () {
      theJob = Jobs.findOne (Session.get ("job_id"));
      if (theJob)
        console.log ("no Job @ job: function ()");
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
      console.log ("checkImplantTopLeft");
      if (theJob != null) {
        console.log (theJob._id);
        var toothDoc = _.findWhere (theJob.patient.teeth , {"tooth": aTooth});
        if (toothDoc) {
          var implant = _.findWhere(implantTypes, {value: toothDoc.implantPlatform});
          if (!implant)
            return false;
          var marking = _.findWhere(markingTypes, {value: toothDoc.marking});
          if (!marking)
            return false;

          var toothData = {};
          toothData["tooth"] = aTooth;
          toothData["dia"] = implant.dia;
          toothData["implantName"] = toothDoc.implantPlatform;
          toothData["marking"] = marking.icon;

          teethTopLeft.push(toothData);

          return true;
        }
      }
      return false;
    },

    getDiameterTopLeft: function (aTooth) {
      console.log ("getDiameterTopLeft" + " " + aTooth);
      if (_.size (teethTopLeft) > 0) {
        var toothDoc = _.findWhere(teethTopLeft, {"tooth": aTooth});
        if (toothDoc)
          return toothDoc.dia;
      }
      return "";
    },

    getImplantNameTopLeft: function (aTooth) {
      console.log ("getImplantNameTopLeft" + " " + aTooth);
      if (_.size (teethTopLeft) > 0) {
        var toothDoc = _.findWhere(teethTopLeft, {"tooth": aTooth});
        if (toothDoc)
          return toothDoc.implantName;
      }
      return "";
    },

    checkImplantIconTopLeft: function (aTooth) {
      console.log ("checkImplantIconTopLeft" + " " + aTooth);
      if (_.size (teethTopLeft) > 0) {
          var toothDoc = _.findWhere(teethTopLeft, {"tooth": aTooth});
          if (toothDoc)
              return toothDoc.marking;
      }
      return "fa-square-o";
    },

    checkImplantBottomLeft: function (aTooth) {
      console.log ("checkImplantBottomLeft");
      if (_.size (teethBottomLeft) > 0)
        if (_.findWhere(teethBottomLeft, {"tooth": aTooth}))
          return true;
      return false;
    },

    getDiameterBottomLeft: function (aTooth) {
      console.log ("getDiameterBottomLeft" + " " + aTooth);
      if (_.size (teethBottomLeft) > 0) {
        var toothDoc = _.findWhere(teethBottomLeft, {"tooth": aTooth});
        if (toothDoc)
          return toothDoc.dia;
      }
      return "";
    },

    getImplantNameBottomLeft: function (aTooth) {
      console.log ("getImplantNameBottomLeft" + " " + aTooth);
      if (_.size (teethBottomLeft) > 0) {
        var toothDoc = _.findWhere(teethBottomLeft, {"tooth": aTooth});
        if (toothDoc)
          return toothDoc.implantName;
      }
      return "";
    },

    checkImplantIconBottomLeft: function (aTooth) {
      console.log ("checkImplantIconBottomLeft" + " " + aTooth);
      if (theJob != null) {
        console.log (theJob._id);
        var toothDoc = _.findWhere (theJob.patient.teeth , {"tooth": aTooth});
        if (toothDoc) {
          var implant = _.findWhere (implantTypes, {value: toothDoc.implantPlatform});
          if (!implant)
              return false;
          var marking = _.findWhere (markingTypes, {value: toothDoc.marking});
          if (!marking)
              return false;

          var toothData = {};
          toothData["tooth"] = aTooth;
          toothData["dia"] = implant.dia;
          toothData["implantName"] = toothDoc.implantPlatform;
          toothData["marking"] = marking.icon;

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
      console.log ("checkImplantTopRight");
      if (theJob != null) {
        console.log (theJob._id);
        var toothDoc = _.findWhere (theJob.patient.teeth , {"tooth": aTooth});
        if (toothDoc) {
          var implant = _.findWhere(implantTypes, {value: toothDoc.implantPlatform});
          if (!implant)
            return false;
          var marking = _.findWhere(markingTypes, {value: toothDoc.marking});
          if (!marking)
            return false;

          var toothData = {};
          toothData["tooth"] = aTooth;
          toothData["dia"] = implant.dia;
          toothData["implantName"] = toothDoc.implantPlatform;
          toothData["marking"] = marking.icon;

          teethTopRight.push(toothData);

          return true;
        }
      }
      return false;
    },

    getDiameterTopRight: function (aTooth) {
      console.log ("getDiameterTopRight" + " " + aTooth);
      if (_.size (teethTopRight) > 0) {
        var toothDoc = _.findWhere (teethTopRight , {"tooth": aTooth});
        if (toothDoc)
          return toothDoc.dia;
      }
      return "";
    },

    getImplantNameTopRight: function (aTooth) {
      console.log ("getImplantNameTopRight" + " " + aTooth);
      if (_.size (teethTopRight) > 0) {
        var toothDoc = _.findWhere(teethTopRight, {"tooth": aTooth});
        if (toothDoc)
          return toothDoc.implantName;
      }
      return "";
    },

    checkImplantIconTopRight: function (aTooth) {
      console.log ("checkImplantIconTopRight" + " " + aTooth);
      if (_.size (teethTopRight) > 0) {
        var toothDoc = _.findWhere(teethTopRight, {"tooth": aTooth});
        if (toothDoc)
          return toothDoc.marking;
      }
      return "fa-square-o";
    },

    checkImplantBottomRight: function (aTooth) {
      console.log ("checkImplantBottomRight");
      if (_.size (teethBottomRight) > 0)
        if (_.findWhere (teethBottomRight , {"tooth": aTooth}))
          return true;
      return false;
    },

    getDiameterBottomRight: function (aTooth) {
      console.log ("getDiameterBottomRight" + " " + aTooth);
      if (_.size (teethBottomRight) > 0) {
        var toothDoc = _.findWhere (teethBottomRight , {"tooth": aTooth});
        if (toothDoc)
          return toothDoc.dia;
      }
      return "";
    },

    getImplantNameBottomRight: function (aTooth) {
      console.log ("getImplantNameBottomRight" + " " + aTooth);
      if (_.size (teethBottomRight) > 0) {
        var toothDoc = _.findWhere(teethBottomRight, {"tooth": aTooth});
        if (toothDoc)
          return toothDoc.implantName;
      }
      return "";
    },

    checkImplantIconBottomRight: function (aTooth) {
      console.log ("checkImplantIconBottomRight" + " " + aTooth);
      if (theJob != null) {
        console.log (theJob._id);
        var toothDoc = _.findWhere (theJob.patient.teeth , {"tooth": aTooth});
        if (toothDoc) {
          var implant = _.findWhere(implantTypes, {value: toothDoc.implantPlatform});
          if (!implant)
            return false;
          var marking = _.findWhere(markingTypes, {value: toothDoc.marking});
          if (!marking)
            return false;

          var toothData = {};
          toothData["tooth"] = aTooth;
          toothData["dia"] = implant.dia;
          toothData["implantName"] = toothDoc.implantPlatform;
          toothData["marking"] = marking.icon;

          teethBottomRight.push(toothData);
        }
      }
      if (_.size (teethBottomRight) > 0) {
        var theTooth = _.findWhere(teethBottomRight, {"tooth": aTooth});
        if (theTooth)
          return theTooth.marking;
      }
      return "fa-square-o";
    }
  });

  Template.jobs.events ({
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
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.publish ("jobs", function () {
    return Jobs.find ();
  });

  Meteor.methods ({
    //initJobNumber: function () {
      //return setCounter ("labidentJob", 100);
    //}
  });
}
