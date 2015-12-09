// signinController

cordovaNG.controller('signinController', function ($scope, globalService, ngFB) {

    // Scope is like the view datamodel.  'message' is defined in the paritial view html {{message}}
    //$scope.message = "Nothing here yet";  //- TEST ONLY

    // check for local registration id (previous sign in)
    // select kid or parent mode
    // signin with kid id.  Check for valid kid ID and remove from invitation list
    // signin as parent
    // go to admin or client home view

    // OpenFB / ngFB stuff
    // ---------------------
    // Defaults to sessionStorage for storing the Facebook token unless SessionStorage specifice
    //ngFB.init({ appId: '550469961767419' });
    ngFB.init({ appId: '550469961767419', tokenStore: window.localStorage });

    //check localStorage for 'fbAccessToken' and use it for user properties
    if (window.localStorage.getItem('fbAccessToken')) {
        ngFB.api({
            method: 'GET',
            path: '/me',
            params: { fields: 'id,name,email,first_name' }
        }).then(
            function (result) {
                $scope.user = result;
                // put JSON result into User Array
                var userarray = new Array();
                userarray[0] = globalService.makeUniqueID(); // made GUID for Azure table
                userarray[1] = result.name;
                userarray[2] = result.email;
                userarray[3] = result.first_name;
                localStorage["RYB_userarray"] = JSON.stringify(userarray);
                //alert(localStorage["RYB_userarray"]);
            },
            errorHandler);
    };

    $scope.login = function () {
        ngFB.login({ scope: 'email' }).then( // request other Facebook permissions in with scope with ", 'publish_action' "
            function (response) {
                alert('Facebook login succeeded, got access token: ' + response.authResponse.accessToken);
                // Get profile data to make User Array
                // -----------------------------------
                ngFB.api({
                    method: 'GET',
                    path: '/me',
                    params: { fields: 'id,name,email,first_name' }
                }).then(
                function (result) {
                    $scope.user = result;
                    // put JSON result into User Array
                    var userarray = new Array();
                    userarray[0] = globalService.makeUniqueID(); // made GUID for Azure table
                    userarray[1] = result.name;
                    userarray[2] = result.email;
                    userarray[3] = result.first_name;
                    localStorage["RYB_userarray"] = JSON.stringify(userarray);
                    //var userarray = JSON.parse(localStorage["RYB_userarray"]);
                },
                errorHandler);
                // -----------------------------------

            },
            function (error) {
                alert('Facebook login failed: ' + error);
            });
    }
    $scope.getInfo = function () {
        ngFB.api({ path: '/me' }).then(
            function (user) {
                console.log(JSON.stringify(user));
                alert(JSON.stringify(user));
                $scope.user = user;
            },
            errorHandler);
    }
    $scope.getProfile = function () {
        ngFB.api({
            method: 'GET',
            path: '/me',
            params: { fields: 'id,name,email,first_name' }
        }).then(
            function (result) {
                alert(JSON.stringify(result));
                $scope.user = result;
            },
            errorHandler);
    }
    $scope.share = function () {
        ngFB.api({
            method: 'POST',
            path: '/me/feed',
            params: { message: document.getElementById('Message').value || 'Testing Facebook APIs' }
        }).then(
            function () {
                alert('the item was posted on Facebook');
            },
            errorHandler);
    }
    //$scope.readPermissions = function () {
    //    ngFB.api({
    //        method: 'GET',
    //        path: '/me/permissions'
    //    }).then(
    //        function (result) {
    //            alert(JSON.stringify(result.data));
    //        },
    //        errorHandler
    //    );
    //}
    //$scope.revoke = function () {
    //    ngFB.revokePermissions().then(
    //        function () {
    //            alert('Permissions revoked');
    //        },
    //        errorHandler);
    //}
    //$scope.logout = function () {
    //    ngFB.logout().then(
    //        function () {
    //            alert('Logout successful');
    //        },
    //        errorHandler);
    //}
    function errorHandler(error) {
        alert(error.message);
    }


    // View changer.  Have to use $scope. to make available to the view
    // --------------
    $scope.gotoView = function () {
        globalService.changeView('admindash');
    };

}); //controller end