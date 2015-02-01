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
