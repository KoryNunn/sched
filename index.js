var scheds = [],
    globalStarted,
    tickerInterval;

function ticker(){
    for(var i = 0; i < scheds.length; i++){
        scheds[i]._tick();
    }
    if(!scheds.length){
        clearInterval(tickerInterval);
    }
}

function addSched(sched){
    if(!globalStarted){
        globalStarted = true;
        tickerInterval = setInterval(ticker,10);
    }

    if(~scheds.indexOf(sched)){
        return;
    }
    scheds.push(sched);
}
function removeSched(sched){
    scheds.splice(scheds.indexOf(sched), 1);
}

var timeNow = function(){
    return Date.now();
};

function getMultiples(initial, max, multiples){
    var n = initial;
    while(n <= max){
        multiples[n] = n;
        n+=initial;
    }

    return multiples;
}

function triggerIntervals(intervals){
    intervals = intervals.slice(); // Clone incase intervals are removed.
    for (var i = 0; i < intervals.length; i++) {
        if(intervals[i]._enabled){
            intervals[i]._callback();
        }
    }
}
function tick(sched){
    if(sched._paused){
        return;
    }
    var intervalKeys = sched._times,
        now = timeNow(),
        startIndex = sched._tickIndex,
        elapsedTime = now - sched._lastTick,
        endIndex = sched._tickIndex + elapsedTime,
        multiples = [];

    for (var i = 0; i < intervalKeys.length; i++) {
        var time = intervalKeys[i];
        if(time > endIndex){
            break;
        }
        getMultiples(time, endIndex, multiples);
    }

    multiples = multiples.slice(startIndex, endIndex);

    if(multiples.length){
        var factorKeys = Object.keys(multiples);

        for(var i = 0; i < factorKeys.length; i++){
            triggerIntervals(sched._intervals[multiples[factorKeys[i]]]);
        }
    }

    sched._tickIndex = endIndex;
    sched._tickIndex %= intervalKeys[intervalKeys.length - 1];
    sched._lastTick = now;
}

function Interval(sched, time, enabled, callback){
    this.sched = sched;
    this._time = time;
    this._enabled = enabled;
    this._callback = callback;
}
Interval.prototype.kill = function(){
    if(this._dead){
        return;
    }
    this._dead = true;
    this.sched.removeInterval(this);
};
Interval.prototype._enabled = true;
Interval.prototype.enabled = function(value){
    if(!arguments.length){
        return this._enabled;
    }
    this._enabled = !!value;
};

function Sched(){
    this._intervals = {};
    var sched = this;
    this._tick = function(){
        tick(sched);
    };
}
Sched.prototype._updateTimes = function(){
    this._times = Object.keys(this._intervals).sort(function(a,b){
        return a-b;
    });

    if(!this._times.length){
        return this.stop();
    }
};
Sched.prototype.start = function(){
    this._paused = false;
    if(!this._running){
        addSched(this);
        this._running = true;
        this._tickIndex = 1; // Prevent immediate firing of all intervals
        this._lastTick = timeNow();
    }
};
Sched.prototype.stop = function(){
    removeSched(this);
    this._running = false;
    this._tickIndex = 0;
};
Sched.prototype.pause = function(){
    this._paused = true;
};
Sched.prototype.removeInterval = function(interval){
    this._intervals[interval._time].splice(this._intervals[interval._time].indexOf(interval), 1);
    if(this._intervals[interval._time].length === 0){
        delete this._intervals[interval._time];
        this._updateTimes();
    }
};
Sched.prototype.interval = function(time, enabled, callback){
    time = Math.floor(time);

    if(typeof enabled === 'function'){
        callback = enabled;
        enabled = true;
    }

    var interval = new Interval(this, time, enabled, callback);

    var intervals = this._intervals[time] || (this._intervals[time] = []);

    intervals.push(interval);

    this._updateTimes();

    return interval;
};

module.exports = Sched;