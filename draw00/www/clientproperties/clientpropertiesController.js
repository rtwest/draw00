// clientpropertiesController

cordovaNG.controller('clientpropertiesController', function ($scope, globalService) {

    // Scope is like the view datamodel.  'message' is defined in the paritial view html {{message}}
    //$scope.message = "Nothing here yet";  //- TEST ONLY


    // Get Client properties 
    // - from local storage or (( $scope Client array !! ))

    // Get time line (tab)
    // - get from server (last 2 weeks only kept).  Has who, what, when.

    // Click on picture image for full picture view in modal (LATER FEATURE)

    // Get friends lists (tab)
    // - get from server.
    // - with friend guid, look up parent data to show parent name, email
    // - action: remove




    // View changer.  Have to use $scope. to make available to the view
    // --------------
    $scope.gotoView = function () {
        globalService.changeView('/');
    };
    $scope.gotoAdminView = function () {
        globalService.changeView('/admindash');
    };

}); //controller end