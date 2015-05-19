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


// Navigation Test (Synchronous)
Phonon.Navigator().on({page: 'home', template: 'home', asynchronous: false}, function(activity) {

    activity.onCreate(function(self, el, req) {
        window.plugins.toast.showShortBottom('Create!');
    });

    activity.onReady(function(self, el, req) {
        window.plugins.toast.showShortBottom('Ready!');
    });

    activity.onTransitionEnd(function() {
        window.plugins.toast.showShortBottom('Transition ended!!');
    });

    activity.onQuit(function(self) {
        window.plugins.toast.showShortBottom('Quit!');
    });

    activity.onHidden(function(el) {
        window.plugins.toast.showShortBottom("I'm hidden!");
    });
});

var APIkey = 'AIzaSyCivTdNSJC1KC7fbPhaB3p08zdY5QHsAqU';
var latCar;
var lngCar;
var locationSet = false;
var lat;
var lng;

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
            alert('You did not set your cars location');
        }

    };

    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
}

function parkAPI() {
    document.getElementById('APItest').src = "http://divvapi.parkshark.nl/apitest.jsp?action=plan&to_lat=51.5&to_lon=4.9&dd=28&mm=12&yy=2013&h=12&m=50&dur=2&opt_routes=y&opt_routes_ret=n&opt_am=n&opt_rec=y";
}

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