Router.configure({
    notFoundTemplate: 'notFoundPage'
});

Router.route('/', function () {
    this.render('home');
});

Router.route('new', function () {
    this.render('newJob');
});

Router.onBeforeAction (function () {
        if (!Meteor.userId()) {
            this.render('askLogin');
        } else {
            this.next();
        }},
    {only: ['new']}
);
