// signinController

cordovaNG.controller('signinController', function ($scope, globalService, AAAAAAA) {

    // Scope is like the view datamodel.  'message' is defined in the paritial view html {{message}}
    //$scope.message = "Nothing here yet";  //- TEST ONLY

    // check for local registration id (previous sign in)
    // select kid or parent mode
    // signin with kid id.  Check for valid kid ID and remove from invitation list
    // signin as parent
    // go to admin or client home view

    // Facebook Cordova Plugin
    // Have to configure Facebook Dev Portal for native iOS use by this app.  And Android too I suppose.
    // https://github.com/Wizcorp/phonegap-facebook-plugin/
    // Benefit is it will auth from install FB app with one click.  Con: hard to test until it's built in XCode
    // Alternatively, could use Azure to do it server side


    // Had to wrap this Azure Mobile Client call into a function so it wasn't automatically called on view load for some reason
    // -------------------------------
    $scope.azurelogout = function () {
    };


    $scope.fbLogin = function () {

        // Call the login method in the Azure mobile wrapper for Facebook
     



    getuserdetails = function () {
    };



    // View changer.  Have to use $scope. to make available to the view
    // --------------
    $scope.gotoView = function () {
        globalService.changeView('admindash');
    };

}); //controller end