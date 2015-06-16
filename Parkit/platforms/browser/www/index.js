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
//overview update
window.setInterval(function(){
  if(update)
    {
        if(overviewUpdate()){ //returns true when time is up
            cordova.plugins.backgroundMode.configure({
                text:'Om binnen budget te blijven moet je nu terug naar de auto'
            });
        }
    }
}, 1000);

//traveltime update
window.setInterval(function(){
  if(update)
    {
        travelTimeUpdate();
    }
}, 30000);

//--starting stuff--//
window.addEventListener('load', function() {
    new FastClick(document.body);
}, false);

var onDeviceReady = function () {
    Phonon.Navigator().start('overview');
    document.addEventListener("backbutton", onBackKeyDown, false);
};

document.addEventListener('deviceready', onDeviceReady, false);

Phonon.Navigator({
    defaultPage: 'overview',
    templatePath: "tpl",
    pageAnimations: true
});

//--Navigation Handler--//
//can the user use the back button?
var backEnable;
//can the user tap the park button?
var parkAvailable=false;
//Home (Synchronous)
Phonon.Navigator().on({page: 'home', template: 'home', asynchronous: false}, function(activity) {

    activity.onCreate(function(self, el, req) {
    });

    activity.onReady(function(self, el, req) {
        cordova.plugins.backgroundMode.disable();
        locationGPS(0);
        update = false;
        notified = false;
        locationSet = false;
        travelTime = null;
        backEnable = false;
        
        removeOptions(document.getElementById("parkSelect"));
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
        backEnable = true;
        document.getElementById('limietIngesteldVal').innerHTML = '&#8364;'+budget;
        document.getElementById('parkPlaceVal').innerHTML = parkingName;
        popupEmpty();
        //set park button to disabled for the next time
        parkAvailable = false;
        document.getElementById('buttonPark').classList.add('disabled');
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

function onBackKeyDown() {
    if (backEnable){
        Phonon.Navigator().changePage(getPreviousPage());
    }
}

//--FUNCTIONS--//

//GPS vars
var APIkey = 'AIzaSyCivTdNSJC1KC7fbPhaB3p08zdY5QHsAqU';
var latCar;
var lngCar;
var locationSet = false;
var lat;
var lng;
var travelTime;

//cost & time vars
var budget;
var cost;
var costRate;
var costPerMin;
var start;
var elapsed;
var costNow;
var timeLeft;
var timeTolerance = 420; //time in secs
var notified = false;
var parkingName;
var parkingPlaces = [];
var parkingPrices;
var id = [];
var isGarage = [];
var garageURL;


function locationGPS(mode) {
    window.plugins.toast.showLongBottom('Jouw positie bepalen...');
    
    var onSuccess = function(position) {
        lat = position.coords.latitude;
        lng = position.coords.longitude;
        window.plugins.toast.showShortBottom('Positie vastgesteld');
        
        if (mode === 0){
            latCar=lat;
            lngCar=lng;
            parkAPI();
            parkAvailable = true;
            document.getElementById('buttonPark').classList.remove('disabled');
            locationSet = true;
        } else if (mode === 1 && locationSet) {
            //test co-ords
            //lat = 52.3762398;
            //lng = 4.91645;
            document.getElementById('maps').src = "https://www.google.com/maps/embed/v1/directions?key="+ APIkey+ "&origin="+ lat +","+ lng+ "&destination="+ latCar+","+ lngCar+ "&mode=walking";
        } else {
            window.plugins.toast.showLongBottom('Locatie van de auto onbekend!');
        }
    };

    function onError(error) {
        navigator.notification.confirm(
            'Je telefoon kon de locatie niet vastleggen, probeer het nogmaals', // message
            GPSError,                   // callback to invoke with index of button pressed
            'GPS Fout',                                                      	  // title
            ['OK']                                                         // buttonLabels
        );
    }
    navigator.geolocation.getCurrentPosition(onSuccess, onError, {enableHighAccuracy: true });
}

function GPSError(){
    Phonon.Navigator().changePage('home');
}

function park() {
    if (parkAvailable)
    {
        var index = document.getElementById('parkSelect').selectedIndex;
        //alert(index);

        if (!isGarage[index]) {
            garageURL = "http://divvapi.parkshark.nl/apitest.jsp?action=get-meter-by-automat-number&id=" + id[index];
            $.getJSON(garageURL).done(function(json) {
                cost = json.result.meter.costs.cost;
                costRate = 60;
                //parkingPrices = cost/costRate;
                costPerMin = cost / costRate;
                //alert(parkingPrices);
            });
        } else {
            garageURL = "http://divvapi.parkshark.nl/apitest.jsp?action=get-garage-by-id&id=" + id[index];
            $.getJSON(garageURL).done(function(json) {
                cost = json.result.garage.price_per_time_unit;
                costRate = json.result.garage.time_unit_minutes;
                //parkingPrices = cost / costRate;
                costPerMin = cost / costRate;
                //alert(parkingPrices);
            });
        }

        budget = document.getElementById("limietInput").value;
        if (!budget) {
            budget = "10,00";
        }

        if (validateLimiet(budget)) {
            var startInput = document.getElementById('tijdInput').value;
            if (startInput !== '') {        
                start = new Date();
                start.setTime(start.getTime()-(startInput * 60000));
            } else {
                start = new Date();
            }
            budget = parseFloat(budget);
            budget = budget.toFixed(2);
            Phonon.Navigator().changePage('overview');
        } else {
            window.plugins.toast.showLongBottom('Voer een correct bedrag in');
        }


        parkingName = parkingPlaces[index];
    }
}

function overviewUpdate() {
    //Cost now
    elapsed = new Date() - start;
    var elapsedMin = (elapsed/1000)/60;
    costNow = elapsedMin*costPerMin;
    
    //Time left
    var costLeft = budget - costNow;
    timeLeft = (costLeft/costPerMin)*60*1000;
    if (timeLeft <= 0){ //prevent negative time
        timeLeft = 0;
    }
    if (costNow <= 0){ //prevent negative price when users park in the future
        costNow = 0;
    }
    
    document.getElementById('costs').innerHTML='&#8364;'+costNow.toFixed(2);
    document.getElementById('timeleft').innerHTML=msToTime(timeLeft);
    
    //notification
    if(timeLeft < travelTime && !notified)
    {
        notification();
        notified = true;
        return true;
    }
    
    // Set the notification message
    cordova.plugins.backgroundMode.setDefaults({
        title:  'ParkIt',
        text: 'Je staat geparkeerd bij: ' + parkingName
    });
}

function travelTimeUpdate() {
    var timeUrl = "https://maps.googleapis.com/maps/api/distancematrix/json?key="+APIkey+"&origins="
                    +lat+","+lng+"&destinations="+latCar+","+lngCar+"&mode=walking";

    $.getJSON(timeUrl).done(function(json) {
        travelTime = (json.rows[0].elements[0].duration.value+timeTolerance)*1000;
    });
}

function parkAPI() {
    //test w parking meter
    //lat = 52.3762398;
    //lng = 4.91645;
    
    //test notificationtiming
    //latCar = 52.372463;
    //lngCar = 4.919640;
    
    var list = document.getElementById('parkSelect');
    var opt = document.createElement("option");
    
    var d = new Date();
    var month = d.getMonth()+1;
    var APIUrl = "http://divvapi.parkshark.nl/apitest.jsp?action=plan&to_lat="+lat+
            "&to_lon="+lng+"&dd="+d.getDate()+"&mm="+month+"&yy="+d.getFullYear()+
            "&h="+d.getHours()+"&m="+d.getMinutes()+"&dur=1&opt_routes=n&opt_routes_ret=n&opt_am=n&opt_rec=y";

    $.getJSON(APIUrl).done(function(json) {        
        //get 4 other closest garages
        for (i = 0; i < 5; i++) {
            if (json.result.reccommendations[i].name) {isGarage[i] = true;}
            else {isGarage[i] = false;}

            if (!isGarage[i]) {
                parkingPlaces[i] = json.result.reccommendations[i].address;
                id[i] = json.result.reccommendations[i].automat_number;
            } else {
                parkingPlaces[i] = json.result.reccommendations[i].name;
                id[i] = json.result.reccommendations[i].garageid;
            }
            var option = document.createElement("option");
            option.text = parkingPlaces[i];
            list.add(option,list[i]);
        }

        $("#parkSelect")[0].selectedIndex = 0;
    });
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
    document.getElementById('tijdPlaceholder').style.visibility = 'hidden';
}

function validateLimiet(val){
    try {
        if (val.indexOf(",") >= 0) {
            val = val.replace(',','.');
        }
        var match1 = val.match(/^([0-9]{1,3}|[0-9]{1,2}[.][0-9]{1,2})$/);
        
        if (match1 == null) return false;
        if (match1 != null) return true;
    } 
    catch(e) {
        alert(e);
    }
}

function removeOptions(selectbox)
{
    var i;
    for (i = selectbox.options.length - 1; i >= 0; i--)
    {
        selectbox.remove(i);
    }
}

function popupOpen() {
    document.getElementById('dateTimePopup').style.display = 'initial';
}
function popupClose() {
    var input = document.getElementById('tijdInput').value;
    if(validateLimiet(input.toString())) {
        document.getElementById('dateTimePopup').style.display = 'none';
    } else {
        window.plugins.toast.showLongBottom('Voer een correct aantal minuten in');
    }    
}
function popupEmpty() {
    document.getElementById('dateTimePopup').style.display = 'none';
    document.getElementById('tijdInput').value = '';
}