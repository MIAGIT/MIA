/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

window.addEventListener('load', function() {
    new FastClick(document.body);
}, false);

var onDeviceReady = function () {
	Phonon.Navigator().start('home');
}

document.addEventListener('deviceready', onDeviceReady, false);

Phonon.Navigator({
    defaultPage: 'home',
    templatePath: "tpl",
    pageAnimations: true
});


// Navigation Handler
//Home (Synchronous)
Phonon.Navigator().on({page: 'home', template: 'home', asynchronous: false}, function(activity) {

    activity.onCreate(function(self, el, req) {
    });

    activity.onReady(function(self, el, req) {
            locationGPS(0);
    });

    activity.onTransitionEnd(function() {
    });

    activity.onQuit(function(self) {
    });

    activity.onHidden(function(el) {
        //locationGPS(0);
    });
});

//Overview (Synchronous)
Phonon.Navigator().on({page: 'overview', template: 'overview', asynchronous: false}, function(activity) {

    activity.onCreate(function(self, el, req) {
    });

    activity.onReady(function(self, el, req) {
        overviewUpdate();
    });

    activity.onTransitionEnd(function() {
    });

    activity.onQuit(function(self) {
    });

    activity.onHidden(function(el) {
    });
});

//Navigate (Synchronous)
Phonon.Navigator().on({page: 'navigate', template: 'navigate', asynchronous: false}, function(activity) {

    activity.onCreate(function(self, el, req) {
    });

    activity.onReady(function(self, el, req) {
        locationGPS(1);
    });

    activity.onTransitionEnd(function() {
    });

    activity.onQuit(function(self) {
    });

    activity.onHidden(function(el) {
    });
});


//--FUNCTIONS--//

//GPS vars
var APIkey = 'AIzaSyCivTdNSJC1KC7fbPhaB3p08zdY5QHsAqU';
var latCar;
var lngCar;
var locationSet = false;
var lat;
var lng;

//kosten vars
var budget;
var cost;
var costRate;
var costPerMin;
var start;
var elapsed;
var costNow;
var timeLeft;

function locationGPS(mode) {
    window.plugins.toast.showShortBottom('GPS');

    var onSuccess = function(position) {
        lat = position.coords.latitude;
        lng = position.coords.longitude;

        if (mode == 0){
            latCar=lat;
            lngCar=lng;
            locationSet = true;
            window.plugins.toast.showShortBottom('Location set!');
        } else if (mode == 1 && locationSet) {
            document.getElementById('maps').src = "https://www.google.com/maps/embed/v1/directions?key="+ APIkey+ "&origin="+ lat +","+ lng+ "&destination="+ latCar+","+ lngCar+ "&mode=walking";
        } else {
            alert('Car location unavailable');
        }
    };

    function onError(error) {
        window.plugins.toast.showShortBottom('GPS Error');
    }
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
}

function park() {
    start = new Date();
    budget = document.getElementById('limietInput').value;
    if (budget == ''){budget=10;}//set this to last val
    cost = 5.0;
    costRate = 60;
    costPerMin = cost/costRate;
}

function overviewUpdate() {
    //Kosten nu
    elapsed = new Date - start;
    var elapsedMin = (elapsed/1000)/60;
    costNow = elapsedMin*costPerMin;
    document.getElementById('costs').innerHTML='&#8364;'+costNow.toFixed(2);
    
    //Tijd over
    var costLeft = budget - costNow;
    timeLeft = (costLeft/costPerMin)*60*1000;
    document.getElementById('timeleft').innerHTML=Math.floor(msToTime(timeLeft));
}

function parkAPI() {
    document.getElementById('APItest').src = "http://divvapi.parkshark.nl/apitest.jsp?action=plan&to_lat=51.5&to_lon=4.9&dd=28&mm=12&yy=2013&h=12&m=50&dur=2&opt_routes=y&opt_routes_ret=n&opt_am=n&opt_rec=y";
}

function vibrate() {
    navigator.vibrate([200, 100, 200]);
}

function notification() {
    navigator.notification.confirm(
        'Also yes', 		// message
        'onConfirm',        // callback to invoke with index of button pressed
        'Mahp',         	// title
        ['Either','Neighter']  // buttonLabels
    )
}

function msToTime(s) {
  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;

  return hrs + ':' + mins + ':' + secs + '.' + ms;
}

//App variable
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};