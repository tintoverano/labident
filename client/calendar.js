/**
 * Created by tintoverano on 2015.01.28..
 */

Template.weekStripe.helpers ({
  options: function () {
    return {
      events: function (start, end, timezone, callback) {
        var deadLines = [
          {
            title  : 'event1',
            start  : '2015-01-28'
          },
          {
            title  : 'event2',
            start  : '2015-01-29',
            end    : '2015-01-29'
          },
          {
            title  : 'event3',
            start  : '2015-01-30',
            allDay : false // will make the time show
          }
        ];
        console.log ("cal events: " + deadLines);
        callback (deadLines);
      },

      defaultView: 'basicWeek',

      firstDay: 1,

      height: 150
    }
  }
});
