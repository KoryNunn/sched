# Sched

An alligned Scheduling library.

All tasks scheduled to the same interval will be triggered at the same time, reguardless of when they were scheduled.

This might be usefull for games, UIs, music etc..

# Usage

```javascipt
var Sched = require('sched'),
    sched = new Sched();


// Set an interval for every second.

sched.interval(1000, function(){
    // Do something
});


// Set an interval for every half second.

sched.interval(500, function(){
    // Do something else
});


// Set another interval for every second.
// This callback will trigger directly after the first callback assigned to 1 second.

sched.interval(500, function(){
    // Do something else
});

```