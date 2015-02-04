Meteor.startup (function () {
  Jobs._ensureIndex ({"dentist.name": 1}, {"patient.name": 1}, {jobNumber: 1}, {status: 1});
});
