/**
 * Created by tintoverano on 2015.01.28..
 */

Template.weekStripe.rendered = function () {
  this.$('#jobCal').fullCalendar ({
    events: function (start, end, timezone, callback) {
      callback (dueDates)
    },
    eventClick: function (calEvent, jsEvent, view) {
      Session.set ("activeJob", -1);
      Session.set ("job_id", null);
      dueDates = [];
      $('#searchBox')[0].placeholder = calEvent.title;
      JobSearch.search (calEvent.title);
    },
    dayClick: function (date, jsEvent, view) {
      Session.set ("activeJob", -1);
      Session.set ("job_id", null);
      dueDates = [];
      $('#searchBox')[0].placeholder = "Type to search jobs...";
      JobSearch.search ('');
    },
    defaultView: 'basicWeek',
    firstDay: 1,
    height: 150
  });
};