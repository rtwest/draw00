﻿// gallerypictureController

cordovaNG.controller('gallerypictureController', function ($scope, globalService, Azureservice) {

    // Scope is like the view datamodel.  'message' is defined in the paritial view html {{message}}
    //$scope.message = "Nothing here yet";  //- TEST ONLY

    $scope.clientavatar = globalService.userarray[3];
    $scope.clientname = globalService.userarray[4];

    // UI show/hide flags
    $scope.showShareOverlay = false;
    $scope.showDeleteOverlay = false;

    var picturesplitarray = globalService.pictureViewParams.split(","); // Global var passed to the view. The div ID had 2 values shoved in. Split string into array by ","
    $scope.pictureID = picturesplitarray[0];
    $scope.pictureFilePath = picturesplitarray[1];

    //Get Comments on this picture by looking up picture details in the local storage array
    // ---
    var imagepropertiesarray = [];
    imagepropertiesarray = JSON.parse(localStorage.getItem('RYB_imagepropertiesarray')); // get array from localstorage key pair and string
    for (x = 0; x < imagepropertiesarray.length; x++) { // Loop through to array for ImageID
        if (imagepropertiesarray[x].id == $scope.pictureID) {
            //alert(JSON.stringify(imagepropertiesarray[x].commentarray));
            $scope.commentarray = imagepropertiesarray[x].commentarray;
            break;
        };
    }; //end for


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

        // Update 'RYB_imagepropertiesarray' in LocalStorage
        var imagepropertiesarray = [];
        imagepropertiesarray = JSON.parse(localStorage.getItem('RYB_imagepropertiesarray')); // get array from localstorage key pair and string
        for (x = 0; x < imagepropertiesarray.length; x++) { // Loop through to array for ImageID
            if (imagepropertiesarray[x].id == $scope.pictureID) {
                imagepropertiesarray.splice(x, 1) // remove from this element at index number from 'clientarray'
                localStorage["RYB_imagepropertiesarray"] = JSON.stringify(imagepropertiesarray); //push back to localStorage
                break;
            };
        }; //end for

        globalService.changeView('/gallery');  // Back location using the captured previous view's name

    };


    // Share 
    // ---------------
    $scope.shareClick = function () {
        // -- SHAREING LOOP GOES HERE
        // -- GO HEAD AND UPLOAD TO AZURE AGAIN.  WHAT IS IMAGEID IF NOT PULLED FROM AZURE BLOB STORAGE?
        // -- DON'T WORRY ABOUT SHARING IMAGE MULTIPLE TIMES (or tracking who you shared with)
    };


    // View changer.  Have to use $scope. to make available to the view
    // --------------
    $scope.goBack = function () {
        globalService.changeView(globalService.lastView);  // Back location using the captured previous view's name
    };

}); //controller end