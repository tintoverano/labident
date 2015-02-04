/**
 * Created by tintoverano on 2015.02.04..
 */
SearchSource.defineSource ('jobs', function (searchText, options) {
  var defaultOptions = {sort: {dueDate: 1}, limit: 0};
  var myStatus = UserSession.get ("checkInProgress", Meteor.userId ());

  if (searchText) {
    var regExp = buildRegExp(searchText);
    var selector = {
      status: myStatus,
      $or: [{jobNumber: regExp}, {"dentist.name": regExp}, {"patient.name": regExp}]
    }
    return Jobs.find (selector, defaultOptions).fetch ();
  }
  return Jobs.find ({status: myStatus}, defaultOptions).fetch ();
});

function buildRegExp (searchText) {
  var parts = searchText.trim ().split (/[ \-\:]+/);
  return new RegExp ("(" + parts.join ('|') + ")", "ig");
}

