/**
 * Created by tintoverano on 2015.01.28..
 */

Template.jobItem.helpers ({
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

  checkImplantTopLeft: function (aTooth) {
    //console.log ("checkImplantTopLeft");
    if (theJob != null) {
      //console.log (theJob._id);
      var toothDoc = _.findWhere (theJob.patient.teeth, {"tooth": aTooth});
      if (toothDoc) {
        var dia = "";
        var implant = _.findWhere (implantTypes, {value: toothDoc.implantPlatform});
        if (implant)
          dia = implant.dia;

        var icon = "fa-check-square-o";
        var marking = _.findWhere (markingTypes, {value: toothDoc.marking});
        if (marking)
          icon = marking.icon;

        var toothData = {};
        toothData["tooth"] = aTooth;
        toothData["dia"] = dia;
        toothData["implantName"] = toothDoc.implantPlatform;
        toothData["marking"] = icon;

        teethTopLeft.push (toothData);

        return true;
      }
    }
    return false;
  },

  getDiameterTopLeft: function (aTooth) {
    //console.log ("getDiameterTopLeft" + " " + aTooth);
    if (_.size (teethTopLeft) > 0) {
      var toothDoc = _.findWhere (teethTopLeft, {"tooth": aTooth});
      if (toothDoc)
        return toothDoc.dia;
    }
    return "";
  },

  getImplantNameTopLeft: function (aTooth) {
    //console.log ("getImplantNameTopLeft" + " " + aTooth);
    if (_.size (teethTopLeft) > 0) {
      var toothDoc = _.findWhere (teethTopLeft, {"tooth": aTooth});
      if (toothDoc)
        return toothDoc.implantName;
    }
    return "";
  },

  checkImplantIconTopLeft: function (aTooth) {
    //console.log ("checkImplantIconTopLeft" + " " + aTooth);
    if (_.size (teethTopLeft) > 0) {
      var toothDoc = _.findWhere (teethTopLeft, {"tooth": aTooth});
      if (toothDoc)
        return toothDoc.marking;
    }
    return "fa-square-o";
  },

  checkImplantBottomLeft: function (aTooth) {
    //console.log ("checkImplantBottomLeft");
    if (_.size (teethBottomLeft) > 0)
      if (_.findWhere (teethBottomLeft, {"tooth": aTooth}))
        return true;
    return false;
  },

  getDiameterBottomLeft: function (aTooth) {
    //console.log ("getDiameterBottomLeft" + " " + aTooth);
    if (_.size (teethBottomLeft) > 0) {
      var toothDoc = _.findWhere (teethBottomLeft, {"tooth": aTooth});
      if (toothDoc)
        return toothDoc.dia;
    }
    return "";
  },

  getImplantNameBottomLeft: function (aTooth) {
    //console.log ("getImplantNameBottomLeft" + " " + aTooth);
    if (_.size (teethBottomLeft) > 0) {
      var toothDoc = _.findWhere (teethBottomLeft, {"tooth": aTooth});
      if (toothDoc)
        return toothDoc.implantName;
    }
    return "";
  },

  checkImplantIconBottomLeft: function (aTooth) {
    //console.log ("checkImplantIconBottomLeft" + " " + aTooth);
    if (theJob != null) {
      //console.log (theJob._id);
      var toothDoc = _.findWhere (theJob.patient.teeth, {"tooth": aTooth});
      if (toothDoc) {
        var dia = "";
        var implant = _.findWhere (implantTypes, {value: toothDoc.implantPlatform});
        if (implant)
          dia = implant.dia;

        var icon = "fa-check-square-o";
        var marking = _.findWhere (markingTypes, {value: toothDoc.marking});
        if (marking)
          icon = marking.icon;

        var toothData = {};
        toothData["tooth"] = aTooth;
        toothData["dia"] = dia;
        toothData["implantName"] = toothDoc.implantPlatform;
        toothData["marking"] = icon;

        teethBottomLeft.push (toothData);
      }
    }
    if (_.size(teethBottomLeft) > 0) {
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
      var toothDoc = _.findWhere (theJob.patient.teeth, {"tooth": aTooth});
      if (toothDoc) {
        var dia = "";
        var implant = _.findWhere (implantTypes, {value: toothDoc.implantPlatform});
        if (implant)
          dia = implant.dia;

        var icon = "fa-check-square-o";
        var marking = _.findWhere (markingTypes, {value: toothDoc.marking});
        if (marking)
          icon = marking.icon;

        var toothData = {};
        toothData["tooth"] = aTooth;
        toothData["dia"] = dia;
        toothData["implantName"] = toothDoc.implantPlatform;
        toothData["marking"] = icon;

        teethTopRight.push (toothData);

        return true;
      }
    }
    return false;
  },

  getDiameterTopRight: function (aTooth) {
    //console.log ("getDiameterTopRight" + " " + aTooth);
    if (_.size(teethTopRight) > 0) {
      var toothDoc = _.findWhere (teethTopRight, {"tooth": aTooth});
      if (toothDoc)
        return toothDoc.dia;
    }
    return "";
  },

  getImplantNameTopRight: function (aTooth) {
    //console.log ("getImplantNameTopRight" + " " + aTooth);
    if (_.size(teethTopRight) > 0) {
      var toothDoc = _.findWhere (teethTopRight, {"tooth": aTooth});
      if (toothDoc)
        return toothDoc.implantName;
    }
    return "";
  },

  checkImplantIconTopRight: function (aTooth) {
    //console.log ("checkImplantIconTopRight" + " " + aTooth);
    if (_.size(teethTopRight) > 0) {
      var toothDoc = _.findWhere (teethTopRight, {"tooth": aTooth});
      if (toothDoc)
        return toothDoc.marking;
    }
    return "fa-square-o";
  },

  checkImplantBottomRight: function (aTooth) {
    //console.log ("checkImplantBottomRight");
    if (_.size(teethBottomRight) > 0)
      if (_.findWhere (teethBottomRight, {"tooth": aTooth}))
        return true;
    return false;
  },

  getDiameterBottomRight: function (aTooth) {
    //console.log ("getDiameterBottomRight" + " " + aTooth);
    if (_.size(teethBottomRight) > 0) {
      var toothDoc = _.findWhere (teethBottomRight, {"tooth": aTooth});
      if (toothDoc)
        return toothDoc.dia;
    }
    return "";
  },

  getImplantNameBottomRight: function (aTooth) {
    //console.log ("getImplantNameBottomRight" + " " + aTooth);
    if (_.size(teethBottomRight) > 0) {
      var toothDoc = _.findWhere (teethBottomRight, {"tooth": aTooth});
      if (toothDoc)
        return toothDoc.implantName;
    }
    return "";
  },

  checkImplantIconBottomRight: function (aTooth) {
    //console.log ("checkImplantIconBottomRight" + " " + aTooth);
    if (theJob != null) {
      //console.log (theJob._id);
      var toothDoc = _.findWhere (theJob.patient.teeth, {"tooth": aTooth});
      if (toothDoc) {
        var dia = "";
        var implant = _.findWhere (implantTypes, {value: toothDoc.implantPlatform});
        if (implant)
          dia = implant.dia;

        var icon = "fa-check-square-o";
        var marking = _.findWhere (markingTypes, {value: toothDoc.marking});
        if (marking)
          icon = marking.icon;

        var toothData = {};
        toothData["tooth"] = aTooth;
        toothData["dia"] = dia;
        toothData["implantName"] = toothDoc.implantPlatform;
        toothData["marking"] = icon;

        teethBottomRight.push (toothData);
      }
    }
    if (_.size(teethBottomRight) > 0) {
      var theTooth = _.findWhere (teethBottomRight, {"tooth": aTooth});
      if (theTooth)
        return theTooth.marking;
    }
    return "fa-square-o";
  },

  getImageUrl: function (pictId) {
    return Images.findOne(pictId).url();
  },

  getImageName: function (pictId) {
    return Images.findOne(pictId).name();
  },

  getFileUrl: function (fileId) {
    return Files.findOne(fileId).url();
  },

  getFileName: function (fileId) {
    return Files.findOne(fileId).name();
  }
});

