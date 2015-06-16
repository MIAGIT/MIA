cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/de.appplant.cordova.plugin.background-mode/www/background-mode.js",
        "id": "de.appplant.cordova.plugin.background-mode.BackgroundMode",
        "clobbers": [
            "cordova.plugins.backgroundMode",
            "plugin.backgroundMode"
        ]
    },
    {
        "file": "plugins/nl.x-services.plugins.toast/www/Toast.js",
        "id": "nl.x-services.plugins.toast.Toast",
        "clobbers": [
            "window.plugins.toast"
        ]
    },
    {
        "file": "plugins/nl.x-services.plugins.toast/test/tests.js",
        "id": "nl.x-services.plugins.toast.tests"
    },
    {
        "file": "plugins/org.apache.cordova.dialogs/www/notification.js",
        "id": "org.apache.cordova.dialogs.notification",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.dialogs/www/browser/notification.js",
        "id": "org.apache.cordova.dialogs.notification_browser",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.vibration/www/vibration.js",
        "id": "org.apache.cordova.vibration.notification",
        "merges": [
            "navigator.notification",
            "navigator"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.device/www/device.js",
        "id": "org.apache.cordova.device.device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.device/src/browser/DeviceProxy.js",
        "id": "org.apache.cordova.device.DeviceProxy",
        "runs": true
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.0.0",
    "de.appplant.cordova.plugin.background-mode": "0.6.4",
    "nl.x-services.plugins.toast": "2.0.6",
    "org.apache.cordova.dialogs": "0.3.0",
    "org.apache.cordova.geolocation": "0.3.12",
    "org.apache.cordova.vibration": "0.3.13",
    "org.apache.cordova.device": "0.3.0"
}
// BOTTOM OF METADATA
});