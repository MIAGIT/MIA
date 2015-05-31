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

//--update stuff--//
var update = false;
window.setInterval(function(){
  if(update)
    {
        if(overviewUpdate())
        {
            navigator.vibrate([200, 100, 200]);
            cordova.plugins.backgroundMode.configure({
                text:'Om binnen budget te blijven moet je nu terug naar de auto'
            });
        }
    }
}, 1000);

//--starting stuff--//
window.addEventListener('load', function() {
    new FastClick(document.body);
}, false);

var onDeviceReady = function () {
	Phonon.Navigator().start('home');
};

document.addEventListener('deviceready', onDeviceReady, false);

Phonon.Navigator({
    defaultPage: 'home',
    templatePath: "tpl",
    pageAnimations: true
});

//--Navigation Handler--//
//Home (Synchronous)
Phonon.Navigator().on({page: 'home', template: 'home', asynchronous: false}, function(activity) {

    activity.onCreate(function(self, el, req) {
    });

    activity.onReady(function(self, el, req) {
        cordova.plugins.backgroundMode.disable();
        locationGPS(0);
        update = false;
        notified = false;
    });

    activity.onTransitionEnd(function() {
    });

    activity.onQuit(function(self) {
    });

    activity.onHidden(function(el) {
        
    });
});

//Overview (Synchronous)
Phonon.Navigator().on({page: 'overview', template: 'overview', asynchronous: false}, function(activity) {

    activity.onCreate(function(self, el, req) {
    });

    activity.onReady(function(self, el, req) {
            cordova.plugins.backgroundMode.enable();
            overviewUpdate();
            update = true;
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

//cost & time vars
var budget;
var cost;
var costRate;
var costPerMin;
var start;
var elapsed;
var costNow;
var timeLeft;
var notified = false;

function locationGPS(mode) {
    
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
            navigator.notification.confirm(
                'Je telefoon kon de locatie niet vastleggen, probeer het nogmaals',// message
                GPSError,     // callback to invoke with index of button pressed
                'GPS Fout',                                          	// title
                ['OK']                                           // buttonLabels
            );
        }
    };

    function onError(error) {
        window.plugins.toast.showShortBottom('GPS Error');
    }
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
}

function GPSError(){
    Phonon.Navigator().changePage('home');
}

function park() {
    var startInput = document.getElementById('tijdInput').value;
    if(startInput !== '') {
        start = new Date(startInput);
        start.setHours(start.getHours()-2);  
    } else {
        start = new Date();
    }

    budget = document.getElementById('limietInput').value;
    if (isNaN(budget)) {
        window.plugins.toast.showShortBottom('Fout in invoer, laatst gebruikte limiet ingesteld');
        budget = 10; //set this to last val
    }
    if (budget == ''){budget=10;}//set this to last val
    cost = 5.0;
    costRate = 60;
    costPerMin = cost/costRate;
}

function overviewUpdate() {
    //Cost now
    elapsed = new Date() - start;
    var elapsedMin = (elapsed/1000)/60;
    costNow = elapsedMin*costPerMin;
    document.getElementById('costs').innerHTML='&#8364;'+costNow.toFixed(2);
    
    //Time left
    var costLeft = budget - costNow;
    timeLeft = (costLeft/costPerMin)*60*1000;
    if (timeLeft <= 0){ //prevent negative time
        timeLeft = 0;
    }
    document.getElementById('timeleft').innerHTML=msToTime(timeLeft);
    
    //notification
    if(timeLeft <600000 && !notified)
    {
        notification();
        notified = true;
        return true;
    }
    
    // Set the notification message
    cordova.plugins.backgroundMode.setDefaults({
        title:  'ParkIt',
        text: 'Je staat geparkeerd op de Mathildelaan'
    });
}

function parkAPI() {
    document.getElementById('APItest').src = "http://divvapi.parkshark.nl/apitest.jsp?action=plan&to_lat=51.5&to_lon=4.9&dd=28&mm=12&yy=2013&h=12&m=50&dur=2&opt_routes=y&opt_routes_ret=n&opt_am=n&opt_rec=y";
}

function dialogInput(buttonIndex) {
    if(buttonIndex === 1){
        Phonon.Navigator().changePage('navigate');
    }
}

function notification() {
    navigator.vibrate([200, 100, 200]);
    navigator.notification.beep(1);
    navigator.notification.confirm(
        'Om binnen budget te blijven moet je nu terug naar de auto',  // message
        dialogInput,          // callback to invoke with index of button pressed
        'Klaar om te gaan?',                                    	// title
        ['Navigatie','Ok']                                       // buttonLabels
    );
}

function msToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    return (hrs < 10 ? "0" + hrs : hrs) + ':' + (mins < 10 ? "0" + mins : mins) + ':' + (secs  < 10 ? "0" + secs : secs);
}

function dateInput() {
    var d = new Date();
    document.getElementById('tijdPlaceholder').style.visibility = 'hidden';
}