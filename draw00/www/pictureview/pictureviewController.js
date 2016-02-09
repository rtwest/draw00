// pictureviewController

cordovaNG.controller('pictureviewController', function ($scope, globalService, Azureservice) {

    // Scope is like the view datamodel.  'message' is defined in the paritial view html {{message}}
    //$scope.message = "Nothing here yet";  //- TEST ONLY





    // View changer.  Have to use $scope. to make available to the view
    // --------------
    $scope.goBack = function () {
        globalService.changeView('/');
    };

}); //controller end