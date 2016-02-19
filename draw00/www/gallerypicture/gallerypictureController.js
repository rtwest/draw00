// gallerypictureController

cordovaNG.controller('gallerypictureController', function ($scope, globalService, Azureservice) {

    // Scope is like the view datamodel.  'message' is defined in the paritial view html {{message}}
    //$scope.message = "Nothing here yet";  //- TEST ONLY

    $scope.clientavatar = globalService.userarray[3];
    $scope.clientname = globalService.userarray[4];

    // UI show/hide flags
    $scope.showShareOverlay = false;
    $scope.showDeleteOverlay = false;

    var picturesplitarray = globalService.kidPictureUrl.split(","); // Global var passed to the view. The div ID had 2 values shoved in. Split string into array by ","
    $scope.pictureID = picturesplitarray[0];
    $scope.pictureFilePath = picturesplitarray[1];


    //// Trying to work on a dynamic Back button  
    //// Not working.  It might need to reside in App.Run section say StackExchange
    //// ------------
    //var previousView
    //// @@@ rootScope has some special methods to know about the route path before. Remember to add $rootScope to the controller definition
    //$rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
    //    //assign the "from" parameter to something
    //    previousView = from.name;
    //    alert(from.name);
    //});



    // Delete this picutre and return to Gallery View
    // ---------------
    $scope.deleteClick = function () {

        // -- REMOVE FROM LOCAL STORAGE GOES HERE

        $scope.goBack();
    };


    // Share 
    // ---------------
    $scope.shareClick = function () {
        // -- SHAREING LOOP GOES HERE
    };


    // View changer.  Have to use $scope. to make available to the view
    // --------------
    $scope.goBack = function () {
        globalService.changeView('/gallery');  // Back location using the captured previous view's name
    };

}); //controller end