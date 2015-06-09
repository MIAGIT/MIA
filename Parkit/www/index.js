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
	Phonon.Navigator().start('home');
};

document.addEventListener('deviceready', onDeviceReady, false);
document.addEventListener("backbutton", onBackKeyDown, false);

Phonon.Navigator({
    defaultPage: 'home',
    templatePath: "tpl",
    pageAnimations: true
});

//--Navigation Handler--//
//can the user use the back button?
var backEnable;
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
var parkingPrices = [];

function locationGPS(mode) {
    window.plugins.toast.showLongBottom('Jouw positie bepalen...');
    
    var onSuccess = function(position) {
        lat = position.coords.latitude;
        lng = position.coords.longitude;
        window.plugins.toast.showLongBottom('Positie vastgesteld');
        
        if (mode === 0){
            latCar=lat;
            lngCar=lng;
            parkAPI();
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
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
}

function GPSError(){
    Phonon.Navigator().changePage('home');
}

function park() {
    var index = document.getElementById('parkSelect').selectedIndex;
    alert(parkingPrices.length);
    alert(parkingPlaces.length);
    budget = document.getElementById("limietInput").value;
    if (!budget) {
        budget = "10,00";
    }

    if (validateLimiet()) {
        var startInput = document.getElementById('tijdInput').value;
        if (startInput !== '') {
            start = new Date(startInput);
            start.setHours(start.getHours() - 2);
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
    costPerMin = parkingPrices[index];
    alert(parkingName);
    alert(costPerMin);
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
    var timeUrl = "https://maps.googleapis.com/maps/api/distancematrix/json?key="+APIKey+"&origins="
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
    var garageURL;
    var d = new Date();
    var month = d.getMonth()+1;
    var APIUrl = "http://divvapi.parkshark.nl/apitest.jsp?action=plan&to_lat="+lat+
            "&to_lon="+lng+"&dd="+d.getDate()+"&mm="+month+"&yy="+d.getFullYear()+
            "&h="+d.getHours()+"&m="+d.getMinutes()+"&dur=1&opt_routes=n&opt_routes_ret=n&opt_am=n&opt_rec=y";

    $.getJSON(APIUrl).done(function(json) {
        var isGarage;
        var id;
        /*
        if (json.result.reccommendations[0].name){isGarage = true;}
        else{isGarage = false;}
        
        if (!isGarage){
            parkingName = json.result.reccommendations[0].address;
            id = json.result.reccommendations[0].automat_number;
            garageURL = "http://divvapi.parkshark.nl/apitest.jsp?action=get-meter-by-automat-number&id=" + id;
            $.getJSON(garageURL).done(function(json) {
                cost = json.result.meter.costs.cost;
                costRate = 60;
                costPerMin = cost/costRate;
            });
        } else {
            parkingName = json.result.reccommendations[0].name;
            id = json.result.reccommendations[0].garageid;
            garageURL = "http://divvapi.parkshark.nl/apitest.jsp?action=get-garage-by-id&id=" + id;
            $.getJSON(garageURL).done(function(json) {
                cost = json.result.garage.price_per_time_unit;
                costRate = json.result.garage.time_unit_minutes;
                costPerMin = cost/costRate;
            });
        }
        
        opt.text = parkingName;
        list.add(opt,list[0]);
        document.getElementById('waarInput').placeholder = parkingName;*/
        
        //get 4 other closest garages
        for (i = 0; i < 5; i++) {
            if (json.result.reccommendations[i].name) {isGarage = true;}
            else {isGarage = false;}

            if (!isGarage) {
                parkingPlaces[i] = json.result.reccommendations[i].address;
                id = json.result.reccommendations[i].automat_number;
                garageURL = "http://divvapi.parkshark.nl/apitest.jsp?action=get-meter-by-automat-number&id=" + id;
                $.getJSON(garageURL).done(function(json) {
                    cost = json.result.meter.costs.cost;
                    costRate = 60;
                    parkingPrices[i] = cost/costRate;
                    alert(parkingPrices[i]+" . "+i);
                });
            } else {
                parkingPlaces[i] = json.result.reccommendations[i].name;
                id = json.result.reccommendations[i].garageid;
                garageURL = "http://divvapi.parkshark.nl/apitest.jsp?action=get-garage-by-id&id=" + id;
                $.getJSON(garageURL).done(function(json) {
                    cost = json.result.garage.price_per_time_unit;
                    costRate = json.result.garage.time_unit_minutes;
                    parkingPrices[i] = cost/costRate;
                    alert(parkingPrices[i]+" . "+i);
                });
            }
            var option = document.createElement("option");
            option.text = parkingPlaces[i];
            list.add(option,list[i]);
        }
        alert(parkingPrices[0]+'\n'+
                parkingPrices[1]+'\n'+
                parkingPrices[2]+'\n'+
                parkingPrices[3]+'\n'+
                parkingPrices[4]+'\n'+
                parkingPrices[5]+'\n')
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

function validateLimiet(){
    try {
        if (budget.indexOf(",") >= 0) {
          budget = budget.replace(',','.');
        }
        var match1 = budget.match(/^([0-9]{1,3}|[0-9]{1,2}[.][0-9]{1,2})$/);
        
        if (match1 == null) return false;
        if (match1 != null) return true;
    } 
    catch(e) {
        //alert("no match");
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