// signinController

cordovaNG.controller('signinController', function ($scope, globalService, ngFB) {

    // Scope is like the view datamodel.  'message' is defined in the paritial view html {{message}}
    //$scope.message = "Nothing here yet";  //- TEST ONLY

    // check for local registration id (previous sign in)
    // select kid or parent mode
    // signin with kid id.  Check for valid kid ID and remove from invitation list
    // signin as parent
    // go to admin or client home view

    alert("controller loaded");

    // ngFB stuff
    // ---------------------
    // Defaults to sessionStorage for storing the Facebook token
    ngFB.init({ appId: '550469961767419' });

    //  Uncomment the line below to store the Facebook token in localStorage instead of sessionStorage
    //  openFB.init({appId: 'YOUR_FB_APP_ID', tokenStore: window.localStorage});

    $scope.login = function () {

        alert("login");

        ngFB.login({ scope: 'email' }).then(
            function (response) {
                alert('Facebook login succeeded, got access token: ' + response.authResponse.accessToken);
            },
            function (error) {
                alert('Facebook login failed: ' + error);
            });
    }
    $scope.getInfo = function () {
        ngFB.api({ path: '/me' }).then(
            function (user) {
                console.log(JSON.stringify(user));
                $scope.user = user;
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
    $scope.readPermissions = function () {
        ngFB.api({
            method: 'GET',
            path: '/me/permissions'
        }).then(
            function (result) {
                alert(JSON.stringify(result.data));
            },
            errorHandler
        );
    }
    $scope.revoke = function () {
        ngFB.revokePermissions().then(
            function () {
                alert('Permissions revoked');
            },
            errorHandler);
    }
    $scope.logout = function () {
        ngFB.logout().then(
            function () {
                alert('Logout successful');
            },
            errorHandler);
    }
    function errorHandler(error) {
        alert(error.message);
    }


    // View changer.  Have to use $scope. to make available to the view
    // --------------
    $scope.gotoView = function () {
        globalService.changeView('admindash');
    };

}); //controller end