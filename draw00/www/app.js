/*  
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


    }, // end of 'onDeviceReady'

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


// Setup for AzureMobileService NG Wrapper.  This pass URL and Key.
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
        // route for the picture details view
        .when('/picture', {
            templateUrl: 'pictureview/pictureview.html',
            controller: 'pictureviewController'
        })
        // route for the gallery picture details view (used to view picture details from client gallery)
        .when('/gallerypicture', {
            templateUrl: 'gallerypicture/gallerypicture.html',
            controller: 'gallerypictureController'
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

    var userarray = []; //user data
    var selectedClient = '';// for passing between Admin view and Client Properties
    var eventArray = []; // global var used to retrieve once from Azure and use for session
    var friendArray = []; //user data
    var lastTimeChecked = Date.now() - 300001; // Timestamp for last Azure data pull.  Initially set for > 5 MIN ago so the data will be pulled again.
    var pictureViewParams; // Picture Detail view string of paramters from div id
    var lastView; // For knowing what view you came where and where the back button goes

    // SETTING UP STORAGE.  
    // Open connection to the database using PouchDB.  @@@@@@@@ If adapter is not given, it defaults to IndexedDB, then fails over to WebSQL @@@@@@@@
    // http://pouchdb.com/guides/documents.html
    // EXAMPLE: var drawappDatabase = new PouchDB("drawappDatabase", { adapter: 'websql' });
    // var drawappDatabase = new PouchDB("drawappDatabase");
    //-------------------------

    // Setting up Azureservice 
    // ------------------------
    // ???????????????????????????????????????
    // ???????????????????????????????????????
    // ???????????????????????????????????????
    // ???????????????????????????????????????
    // ------------------------

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
        //drawappDatabase: drawappDatabase, // return the Database

        // Variables needs to pass between views 
        // -----------------
        userarray: userarray, // return the glabal array for local user data
        selectedClient: selectedClient,  // used in Admin view to view client details
        lastTimeChecked: lastTimeChecked, // used to not repeated make Azure calls
        friendArray: friendArray, // used to store a Clients related friends
        eventArray: eventArray, // used to store all events with a Client
        pictureViewParams: pictureViewParams, // Picture Detail view string of paramters from div id 
        lastView: lastView, // For knowing what view you came where and where the back button goes

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


// ===============   NOT USED   =====================
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


cordovaNG.controller('startupController', function ($scope, globalService, Azureservice) {

    // Scope is like the partial view datamodel.  'message' is defined in the paritial view
    //$scope.message = 'Angular routing is working too';

    // ==================================================
    // Things to check for on start up 
    // ==================================================

    console.log("local stored user data is: " + localStorage.getItem('RYB_userarray'));

    // Check for User Array - for registration
    if (localStorage.getItem('RYB_userarray')) {

        // add to globalservice var to make available to all views
        globalService.userarray = JSON.parse(localStorage.getItem('RYB_userarray')); // get array from localstorage key pair and string

        if (globalService.userarray[1] == 'admin') { // if user type is 'admin', go to admin home screen
            PushNotificationSetup();  // register for push notification after you know the user has an ID
            globalService.changeView('admindash');
            console.log('user is admin');
        }
        else if (globalService.userarray[1] == 'client') { // if user type is 'client', go to client home screen
            PushNotificationSetup(); // register for push notification after you know the user has an ID
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


    // =========================================================================================
    // =========================================================================================
    // Define the PushPlugin.
    // Includes Factory NG Azure Wrapper around the Azure Pluging and uses Push Plugin.
    // https://github.com/Azure/mobile-services-samples/blob/master/CordovaNotificationsArticle/BackboneToDo/www/services/mobileServices/settings/services.js
    // =========================================================================================
    // - Register for Push Notifications AFTER user is signed in and has a GUID.  That's needed for the Push Notification

    function PushNotificationSetup() {

        var tags = [];
        tags[0] = globalService.userarray[0]; //Azure Notification Hub 'Tags' var seems to expect an array.  Get the local user GUID to send to user

        // @@@@ Don't want to instantiate this again if I don't have to
        // @@@@ var MobileServiceClient = WindowsAzure.MobileServiceClient;
        // @@@@ var AMSClient = new MobileServiceClient('https://service-poc.azure-mobile.net/', 'IfISqwqStqWVFuRgKbgJtedgtBjwrc24');
        var AMSClient = Azureservice.client;

        // Create a new PushNotification and start registration with the PNS.
        var pushNotification = PushNotification.init({
            "android": { "senderID": "168753624064" }, // This is my Google Developer Project ID # that has GCM API enabled
            "ios": { "alert": "true", "badge": "false", "sound": "false" }
        });

        // Handle the registration event.
        pushNotification.on('registration', function (data) {
            alert(JSON.stringify(data)); console.log(JSON.stringify(data));
            // Get the native platform of the device.
            var platform = device.platform;
            // Get the handle returned during registration.
            var handle = data.registrationId;
            // Set the device-specific message template.
            if (platform == 'android' || platform == 'Android') {
                // Template registration.
                var template = '{ "data" : {"message":"$(message)"}}';
                // Register for notifications.
                if (AMSClient.push) { alert('client push up') };
                AMSClient.push.gcm.registerTemplate(handle,
                    'myTemplate', template, tags)
                    .done(registrationSuccess, registrationFailure);
            } else if (device.platform === 'iOS') {
                // Template registration.
                var template = '{"aps": {"alert": "$(message)"}}';
                // Register for notifications.            
                AMSClient.push.apns.registerTemplate(handle,
                    'myTemplate', template, tags)
                    .done(registrationSuccess, registrationFailure);
            }
        });

        // Handles the notification received event.
        pushNotification.on('notification', function (data) { // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ WHAT TO DO AFTER NOTIFIATION @@@@@@@@@@@@@@@@@@@@@
            // Display the alert message in an alert.
            alert(data.message);
            // Reload the items list.
            //app.Storage.getData();
        });

        // Handles an error event.
        pushNotification.on('error', function (e) {
            // Display the error message in an alert.
            alert('error on registration = ' + e.message);
        });

        var registrationSuccess = function () {
            alert('Registered with Azure!'); console.log('Registered with Azure');
        }
        var registrationFailure = function (error) {
            alert('Failed registering with Azure: ' + error); console.log('Failed registering with Azure: ' + error);
        }

    };//end Push Notification setup



});


// ==================================================
// ==================================================




