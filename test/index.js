var test = require('grape'),
    Sched = require('../'),
    about = require('./about');

test.timeout(3000);

test('single interval', function(t){
    t.plan(1);

    var sched = new Sched(),
        startTime;

    var interval = sched.interval(1000, function(){
        var elapsed = Date.now() - startTime;
        about(t, elapsed, 1000);
        interval.kill();
    });

    startTime = Date.now();
    sched.start();
});

test('multiple intervals', function(t){
    t.plan(2);

    var sched = new Sched(),
        startTime;

    var interval1 = sched.interval(1000, function(){
        var elapsed = Date.now() - startTime;
        about(t, elapsed, 1000);
        interval1.kill();
    });

    var interval2 = sched.interval(300, function(){
        var elapsed = Date.now() - startTime;
        about(t, elapsed, 300);
        interval2.kill();
    });

    startTime = Date.now();
    sched.start();
});

test('multiple offset intervals', function(t){
    t.plan(2);

    var sched = new Sched(),
        startTime;
    
    var interval1 = sched.interval(1000, function(){
        var elapsed = Date.now() - startTime;
        about(t, elapsed, 1000);
        interval1.kill();
    });

    setTimeout(function(){

        var interval2 = sched.interval(1000, function(){
            var elapsed = Date.now() - startTime;
            about(t, elapsed, 1000);
            interval2.kill();
        });

    }, 500);

    startTime = Date.now();
    sched.start();
});