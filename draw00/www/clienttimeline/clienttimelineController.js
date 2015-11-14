// clienttimelineController

cordovaNG.controller('clienttimelineController', function ($scope, globalService) {

    // Scope is like the view datamodel.  'message' is defined in the paritial view html {{message}}
    //$scope.message = "Nothing here yet";  //- TEST ONLY





    // View changer.  Have to use $scope. to make available to the view
    // --------------
    $scope.gotoView = function () {
        globalService.changeView('/');
    };

}); //controller end