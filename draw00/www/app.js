﻿/*  
=====================================================================================================================
=====================================================================================================================

NOTES:


=====================================================================================================================
=====================================================================================================================
*/

// THIS IS THE MORE STANDARD CORDOVA WAY.  MEANS YOU HAVE TO ADD <SCRIPT>app.initialize();</SCRIPT> TO INDEX.HTML ALSO
var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('pause', this.onPause, false);
        document.addEventListener('resume', this.onResume, false);
    },
    
    onPause: function() {
        // TODO: This application has been suspended. Save application state here.
        //alert('app paused');
    },

    onResume: function() {
        // TODO: This application has been reactivated. Restore application state here.
        //alert('app resumed');
    },

    // ==================================================
    // @@@@@@@@@@@@@     onDeviceReady      @@@@@@@@@@@@@
    // ==================================================
    // deviceready Event Handler
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {

        // =========================================================================================
        // @@@ Manually bootstrap AngularJS app after DeviceReady and not the default way with  HTML 
        // =========================================================================================
        angular.bootstrap(document, ['cordovaNG']);
        console.log('bootstrapping NG');
        // =========================================================================================
        // =========================================================================================



        // #region notification-registration	
        // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
        // Define the PushPlugin.
        var pushNotification = window.plugins.pushNotification;
		
        // Platform-specific registrations.
        if ( device.platform == 'android' || device.platform == 'Android' ){
            // Register with GCM for Android apps.
            console.log('this is android device');

            pushNotification.register(
               app.successHandler, app.errorHandler,
               { 
                   "senderID": '168753624064',  // GCM_SENDER_ID, Project number generated on the Google Dev' Console at console.developers.google.com
                   "ecb": "app.onNotificationGCM" 
               });
        } else if (device.platform === 'iOS') {
            console.log('this is iOS device');

            // Register with APNS for iOS apps.			
            pushNotification.register(
                app.tokenHandler,
                app.errorHandler, { 
                    "badge":"true",
                    "sound":"true",
                    "alert":"true",
                    "ecb": "app.onNotificationAPN"
                });
        }
        else if(device.platform === "Win32NT"){
            // Register with MPNS for WP8 apps.
            pushNotification.register(
				app.channelHandler,
				app.errorHandler,
				{
				    "channelName": "MyPushChannel",
				    "ecb": "app.onNotificationWP8",
				    "uccb": "app.channelHandler",
				    "errcb": "app.ErrorHandler"
				});
        }
        // #endregion notifications-registration
        // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    },

    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    // #region notification-callbacks
    // Callbacks from PushPlugin
    onNotificationGCM: function (e) {
        switch (e.event) {
            case 'registered':
                // Handle the registration.
                //document.getElementById('log').innerHTML += 'GCM regid from PushNotification is '+ e.regid +' </br>'// old school dom injection

                if (e.regid.length > 0) {
                    console.log("gcm id " + e.regid);

                    if (client) {

                        // Create the integrated Notification Hub client.
                        var hub = new NotificationHub(client);

                        // Template registration.
                        var template = "{ \"data\" : {\"message\":\"$(message)\"}}";

                        // Register for notifications.
                        // (gcmRegId, ["tag1","tag2"], templateName, templateBody)
                        hub.gcm.register(e.regid, null, "myTemplate", template).done(function () {
                            alert("Registered with hub!");
                            document.getElementById('log').innerHTML += 'Registered with hub!</br>'// old school dom injection

                        }).fail(function (error) {
                            alert("Failed registering with hub: " + error);
                            document.getElementById('log').innerHTML += 'Failed registering with hub:</br>'// old school dom injection

                        });
                    }
                    //else {};
                }
                break;

            case 'message':

                if (e.foreground) {
                    // Handle the received notification when the app is running
                    // and display the alert message. 
                    alert(e.payload.message);

                    // Reload the items list.
                    //refreshTodoItems();  .. this function not in my app
                }
                break;

            case 'error':
                alert('GCM error: ' + e.message);
                break;

            default:
                alert('An unknown GCM event has occurred');
                break;
        }
    },

    // Handle the token from APNS and create a new hub registration.
    tokenHandler: function (result) {
        if (client) {

            // Create the integrated Notification Hub client.
            var hub = new NotificationHub(client);

            // This is a template registration.
            var template = "{\"aps\":{\"alert\":\"$(message)\"}}";

            // Register for notifications.
            // (deviceId, ["tag1","tag2"], templateName, templateBody, expiration)
            //document.getElementById('log').innerHTML += 'device token for APNS from PushNotification : '+result+' </br>'// old school dom injection

            hub.apns.register(result, null, "myTemplate", template, null).done(function () {
                alert("Registered with hub!");
                document.getElementById('log').innerHTML += 'Registered with hub!</br>'// old school dom injection

            }).fail(function (error) {
                alert("Failed registering with hub: " + error);
                document.getElementById('log').innerHTML += 'Failed registering with hub:</br>'// old school dom injection

            });
        }
        //else {};
    },

    // Handle the notification when the iOS app is running.
    onNotificationAPN: function (event) {

        if (event.alert) {
            // Display the alert message in an alert.
            alert(event.alert);

            // Reload the items list.
            //refreshTodoItems();
        }

        // // Other possible notification stuff we don't use in this sample.
        // if (event.sound){
        // var snd = new Media(event.sound);
        // snd.play();
        // }

        // if (event.badge){

        // pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
        // }

    },

    // Handle the channel URI from MPNS and create a new hub registration. 
    channelHandler: function (result) {
        if (result.uri !== "") {
            if (client) {

                // Create the integrated Notification Hub client.
                var hub = new NotificationHub(client);

                // This is a template registration.
                var template = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
                    "<wp:Notification xmlns:wp=\"WPNotification\">" +
                        "<wp:Toast>" +
                            "<wp:Text1>$(message)</wp:Text1>" +
                        "</wp:Toast>" +
                    "</wp:Notification>";

                // Register for notifications.
                // (channelUri, ["tag1","tag2"] , templateName, templateBody)
                hub.mpns.register(result.uri, null, "myTemplate", template).done(function () {
                    alert("Registered with hub!");
                }).fail(function (error) {
                    alert("Failed registering with hub: " + error);
                });
            }
        }
        else {
            console.log('channel URI could not be obtained!');
        }
    },

    // Handle the notification when the WP8 app is running.
    onNotificationWP8: function (event) {
        if (event.jsonContent) {
            // Display the alert message in an alert.
            alert(event.jsonContent['wp:Text1']);

            // Reload the items list.
            //refreshTodoItems();
        }
    },
    // #endregion notification-callbacks

    successHandler: function (result) {
        console.log("callback success, result = " + result);
    },

    errorHandler: function (error) {
        alert(error);
    },
    // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

}; // end of 'app' class






/*
**************************************************************************************************************************
**************************************************************************************************************************
BEGIN ANGULAR SIDE OF THE APP
**************************************************************************************************************************
**************************************************************************************************************************
*/


// ==================================================
// Create the module and name it azurepocApp
// ==================================================

var cordovaNG = angular.module('cordovaNG', [
    'ngRoute',
    'azure-mobile-service.module',//NG wrapper around Azure mobile service
    'ui.bootstrap',
    'ngAnimate',
    'ngOpenFB', //NG wrapper for OpenFB wrapper around FB api
]);
// ==================================================
// ==================================================


// Setup for AzureMobileServie NG Wrapper
angular.module('cordovaNG').constant('AzureMobileServiceClient', {
    API_URL: 'https://service-poc.azure-mobile.net/',
    API_KEY: 'IfISqwqStqWVFuRgKbgJtedgtBjwrc24',
});


// ==================================================
// Configure the routes for navigation
// ==================================================

cordovaNG.config(function ($routeProvider) {
    $routeProvider
        // route for the Signin view.  Is also the default view '/'
        .when('/signin', {
            templateUrl: 'signin/signin.html',
            controller: 'signinController',
            //resolve: {
            //    "check": function ($location) {
            //        if (localStorage["RYB_userarray"]) { // if there is a user array
            //            $location.path('/admindash'); //redirect user new page
            //        } else {
            //            // something else
            //        }
            //    }
            //}
        })
        // route for the admindash view
        .when('/admindash', {
            templateUrl: 'admindash/admindash.html',
            controller: 'admindashController'
        })
        // route for the gallery view
        .when('/gallery', {
            templateUrl: 'gallery/gallery.html',
            controller: 'galleryController'
        })
        // route for the canvas view.
        .when('/canvas', {
            templateUrl: 'canvas/canvas.html',
            controller: 'canvasController'
        })
        // route for the clientproperties view
        .when('/clientproperties', {
            templateUrl: 'clientproperties/clientproperties.html',
            controller: 'clientpropertiesController'
        })
        // route for the clientstart view
        .when('/clientstart', {
            templateUrl: 'clientstart/clientstart.html',
            controller: 'clientstartController'
        })
        // route for the clienttimeline view.
        .when('/clienttimeline', {
            templateUrl: 'clienttimeline/clienttimeline.html',
            controller: 'clienttimelineController'
        })
        // route for the invitationlist view
        .when('/invitationlist', {
            templateUrl: 'invitationlist/invitationlist.html',
            controller: 'invitationlistController'
        })
        // route for the pictureview view
        .when('/pictureview', {
            templateUrl: 'pictureview/pictureview.html',
            controller: 'pictureviewController'
        })
        // route for the signin view
        .when('/signin', {
            templateUrl: 'signin/signin.html',
            controller: 'signinController'
        })
        // route for the oobe view
        .when('/oobe', {
            templateUrl: 'oobe/oobe.html',
            controller: 'oobeController'
        })
        // route for the home view
        .when('/home', {
            templateUrl: 'partials/home.html',
            controller: 'mainController'
        })
        // route for the managed users view
        .when('/', {
            templateUrl: 'partials/about.html',
            controller: 'viewController'
        });
});
// ==================================================
// ==================================================


// ==================================================
// Configure service for global use - global data model and localStorage.
// Common Global Functions and Variables to reuse across controllers.  Service seems like a classes with methods and vars.
// Service can have dependencies with a weird 'injection notation' []
// Inject factory/service <name> as a dependency to controllers to make available.
// ==================================================

cordovaNG.service('globalService', ['$location', function ($location) {

    // SETTING UP STORAGE.  
    // Open connection to the database using PouchDB.  @@@@@@@@ If adapter is not given, it defaults to IndexedDB, then fails over to WebSQL @@@@@@@@
    // http://pouchdb.com/guides/documents.html
    // EXAMPLE: var drawappDatabase = new PouchDB("drawappDatabase", { adapter: 'websql' });
    var drawappDatabase = new PouchDB("drawappDatabase");
    //-------------------------

    return  {
        // Functions for get/set on global vars.  
        //----------

        // Global functions
        // ----------------
        changeView: function (view) { // Simple method to change view anywhere
            $location.path(view); // path not hash
        },
        simpleKeys: function (original) { // Helper Recommedation from AngularJS site. Return a copy of an object with only non-object keys we need this to avoid circular references - though I'm not really sure why
            return Object.keys(original).reduce(function (obj, key) {
                obj[key] = typeof original[key] === 'object' ? '{ ... }' : original[key];
                return obj;
            }, {});
        },

        // Database  methods
        // -----------------
        drawappDatabase: drawappDatabase, // return the Database

        // Clever function to make a GUID compliant with standard format cast as type STRING
        // ----------------
        makeUniqueID: function generateUUID(){ 
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random()*16)%16 | 0;
                d = Math.floor(d/16);
                return (c=='x' ? r : (r&0x3|0x8)).toString(16);
            });
            return uuid;
        },


    };//end global function defintion

}]);
// ==================================================
// ==================================================



// ==================================================
// Create the controllers and inject Angular's $scope
// ==================================================


// NOT USED
cordovaNG.controller('mainController', function ($scope, Azureservice) {

    // Scope is like the partial view datamodel.  'message' is defined in the paritial view
    $scope.message = 'Welcome ' + localStorage.user + ', Angular working';

    $scope.loginstatus = Azureservice.isLoggedIn();


    // Had to wrap this Azure Mobile Client call into a function so it wasn't automatically called on view load for some reason
    // -------------------------------
    $scope.azurelogin = function () {
        
        // Call the login method in the Azure mobile wrapper for Google
        Azureservice.login('google')
        .then(function () { // when done, do this
            $scope.loginstatus = 'Login successful';

            // ###################################################
            // ---------------------------------------------------
            // Example of using a custom API on the Azure Mobile Service called 'servie-POC' that 
            // has 'user' preview function enabled using VS CLI
            Azureservice.invokeApi('userauthenticationproperties') // name of the Custom API
            .then(function (response) { // on success, return this JSON result
                if (response.google) { // if the response obj has a 'google' parameter, it's from Google 
                    // --------
                    // JSON digging specific to the Google Auth returned properties
                    // ---------
                    // using html5 browser storage.  May have to convert from response string to js obj (JSON.parse(string)), 
                    //    but not in the simple case below
                    localStorage.user = response.google.name;
                    $scope.message = 'Welcome ' + localStorage.user;

                };
            },
            function (err) {
                console.error('Azure Custom API Error: ' + err);
                document.getElementById('log').innerHTML += 'Azure Custom API Error: ' + err +' - ' + JSON.stringify(response) +'</br>'// old school dom injection

            })
            // ###################################################

            // @@@@@@ using injected service 'global service' defined function to load another view
            //globalService.changeView('managedusers');

        },
        function (err) {
            $scope.loginstatus = 'Azure Error: ' + err;
            document.getElementById('log').innerHTML += 'login function error: ' + err + '</br>'// old school dom injection
        });
    };

    // Creating var in the $scope view model and will bind to this in the HTML partial with 'ng-model=<$scope.var>'
    // ---------------------------------------------------
    $scope.managedUsername = '';

    // load data from online for the managed user with this name (SHOULD BE MORE SECURE)
    // --------------------------------------
    $scope.loadFromCloud = function () {

        document.getElementById('log').innerHTML += 'Called load from Azure</br>'// old school dom injection

        // Query the Azure table using the Azure service wrapper
        // ---------------------------------------------------
        Azureservice.query('todotable', {
            criteria: { mobileid: '63E726A5-A3B7-49F7-B976-52E382800C8D' }, // Where statement - Guid put on global $rootScope var
            columns: ['id', 'todoitemtitle', 'todoitemstatus'] // Only return these columns
        })
            .then(function (todolistforuser) {
                document.getElementById('log').innerHTML += 'got data</br>'// old school dom injection
                $scope.todolistforuser = todolistforuser;   // Assign the results to a $scope variable 
            }, function (err) {
                document.getElementById('log').innerHTML += 'could not get data</br>'// old school dom injection;
            }
        );
    };
    // Ng-repeat used to list DOM elements with DB table rowid loaded into elementID so its captured on the target.id
    // Need this to retreive GUID in Div ID property for record CRUD
    // ------------------------------------------
    //$scope.todoitemclick = function (clickEvent) {
    //    $scope.clickEvent = globalService.simpleKeys(clickEvent);
    //    $scope.toDoItemId = clickEvent.target.id;
    //    document.getElementById('log').innerHTML += 'selected item '+$scope.toDoItemId+'</br>'// old school dom injection;

    //};


});
// ==================================================


cordovaNG.controller('startupController', function ($scope,globalService) {

    // Scope is like the partial view datamodel.  'message' is defined in the paritial view
    //$scope.message = 'Angular routing is working too';

    // ==================================================
    // Things to check for on start up 
    // ==================================================

    console.log("local stored user data is: " + localStorage.getItem('RYB_userarray'));

    // Check for User Array - for registration
    if (localStorage.getItem('RYB_userarray')) {
        var userarray = JSON.parse(localStorage.getItem('RYB_userarray')); // get array from localstorage key pair and string
        if (userarray[1] == 'admin') { // if user type is 'admin', go to admin home screen
            globalService.changeView('admindash');
            console.log('user is admin');
        }
        else if (userarray[1] == 'client') { // if user type is 'client', go to client home screen
            globalService.changeView('clientstart');
            console.log('user is client');
        }
        else { //if neither, go to user type screen and start over
            globalService.changeView('signin');
            console.log('user is unknown type, go to user role selection');
        };
    }
    // If no user but first time start up flag is set, go to user type screen
    else if (localStorage.RYB_oobeflag) {
        globalService.changeView('signin');
        console.log('user is unknown type - but oobe flag set, go to user role selection');
    }
    // If first time start up flag no set, go to start up screen
    else {
        console.log('no oobe flag, go to oobe');
        globalService.changeView('oobe');
    };
    // ==================================================
});


// ==================================================
// ==================================================




