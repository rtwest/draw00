// pictureviewController

cordovaNG.controller('pictureviewController', function ($scope, $rootScope, globalService, Azureservice) {

    // Scope is like the view datamodel.  'message' is defined in the paritial view html {{message}}
    //$scope.message = "Nothing here yet";  //- TEST ONLY

    $scope.uiFlag = false; // PLACEHOLDER FOR NOW

    $scope.kidavatar = globalService.kidAvatar;
    $scope.kidname = globalService.kidName;
    $scope.pictureurl = globalService.kidPictureUrl;


    // Trying to work on a dynamic Back button  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ WORKING HERE: THIS ISN'T FIRING @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    // ------------
    var previousView
    // @@@ rootScope has some special methods to know about the route path before. Remember to add $rootScope to the controller definition
    $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
        //assign the "from" parameter to something
        previousView = from.name;
        alert(from.name);
    });


    // View changer.  Have to use $scope. to make available to the view
    // --------------
    $scope.goBack = function () {
        globalService.changeView(previousView);  // Back location using the captured previous view's name
    };

}); //controller end