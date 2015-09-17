# ParkIt App for Mobile Interaction

##Purpose
A parking assistant that prevents you from paying way more as intented. Set your budget and garage, and the app will keep track of how much you have to pay and when you have to be back. This will make sure you stay within budget. The purpose of this is to prevent the user with an unpleasant surprise from unexpected high costs at the parking garage.

##UI
The app is built with the Phonon framework with Materialize CSS Framework. The ease-of-use of Phonon and its features make it ideal to work with for smaller, less complicated apps. The CSS framework makes it eaasy and fast to implement Material Design.

##Plugins
The used plugins are:
- Geolocation
- Vibration
- Toast
- Dialogs
- Background mode

####Geolocation
The GPS is used to present the user with the five nearest parkinggarages, provides the navigation with coordinates, and is used to calculate the time it takes to go back to the car. This gives the user a heads-up that he/she needs to go back to stay within the set budget.

####Vibration
Used when the app gives a notification.

####Toast
Gives the users information about the things happening (eg determining location), and is used in small error handling.

####Dialogs
For native dialogs to display critical errors or to notify the user he needs to head back.

##External services
####Google Maps
For navigation purposes. The destination is the garage the user is parked, and the starting point is the users current location.

####Google Distance Matrix
For determining the time it takes to go back to the car, so the user is warned on time.

####divvapi.parkshark
This API contains info about all parking in Amsterdam. It is used to find the nearest parking, present the users with the five closest available, and is used to set the parking location. 
Also used to determine the cost per minute for that particular parkingspot, so the app can calculate how long the user can park within budget.
