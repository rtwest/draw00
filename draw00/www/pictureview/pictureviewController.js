// pictureviewController

cordovaNG.controller('pictureviewController', function ($scope, globalService, Azureservice) {

    // Scope is like the view datamodel.  'message' is defined in the paritial view html {{message}}
    //$scope.message = "Nothing here yet";  //- TEST ONLY

    $scope.uiFlagClientPicture = false;  // show/hide 
    $scope.uiFlagFriendPicture = false;

    // These are global var passed to the view so you know who and what to show
    var picturesplitarray = globalService.pictureViewParams.split(","); // Split the string into an array by ","
    $scope.kidavatar = picturesplitarray[2];
    $scope.pictureurl = picturesplitarray[0];

    // Check if this is Client/You and replace 'You' with real name from local stored user array
    if (picturesplitarray[1] = 'You') { 
        $scope.kidname = globalService.userarray[4]
        $scope.uiFlagClientPicture = true;  // show/hide 
    }
    else {// else used the name passed in
        $scope.kidname = picturesplitarray[1];
        $scope.uiFlagFriendPicture = true;
    }; 


    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  WORKING HERE   @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    //
    //  Can now use $scope.kidname to know if this your picture or from a Friend
    //  can change the UI on the picture for "Click to Like" or "here are all of your likes"
    //
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@





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
    // @@@@@@@@@@@@@@@@@@@  CAN'T DELETE FROM HERE BECAUSE THE POUCHDB ID ISN'T KNOW - WASN'T PULLED FROM POUCHDB AND ID WASN'T IN EVENT LOG DIV ID WHEN CLICKED


    // Like 
    // ---------------
    $scope.likeClick = function () {
        // -- LIKING RECORD CREATION GOES HERE
    };


    // Share 
    // ---------------
    $scope.shareClick = function () {
        // -- SHAREING LOOP GOES HERE
    };


    // View changer.  Have to use $scope. to make available to the view
    // --------------
    $scope.goBack = function () {
        globalService.changeView(globalService.lastView);  // Back location using the captured previous view's name
    };

}); //controller end