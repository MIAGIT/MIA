# ParkIt App for Mobile Interaction

##Purpose
A parking assistant that prevents you from paying way more as intented. Set your budget and location, and the app will keep track of how much you have to pay and when you have to be back. This will make sure you stay within budget.

##UI
The app is built with the Phonon framework with Materialize CSS Framework. The ease-of-use of Phonon and its features make it ideal to work with. The CSS framework implements Material Design and saves a lot of work.

##Plugins
The used plugins are:
- Geolocation
- Vibration
- Toast
- Dialogs
- Background mode

####Geolocation
The GPS is used to give the users directions, and can be used to calculate the time it takes to go back to the car. This is used to give the user a heads-up that he/she needs to go back.

####Vibration
Temporary used for debugging purposes.

####Toast
Gives the users information about the things happening, and is used in error handling.

####Dialogs
For the notification, giving the user the option 'OK' or to the navigation.

##External services
####Google Maps
For navigation purposes

###Google Distance Matrix
For determining the time it takes to go back to the car, so the user is warned on time

####divvapi.parkshark
For displaying the name, so the user can check ir it is correct and to remind the user where his car is parked
Also used to determine the cost per minute for that particular parkingspot
