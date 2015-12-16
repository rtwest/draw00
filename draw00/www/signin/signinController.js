// signinController



// NEED TO THINK THROUGH ALL THE LOGIC ON THIS PAGE AND THE ORDER IN WHICH IT GOES









cordovaNG.controller('signinController', function ($scope, globalService, ngFB, Azureservice) {

    // Scope is like the view datamodel.  'message' is defined in the paritial view html {{message}}
    //$scope.message = "Nothing here yet";  //- TEST ONLY

    // check for local registration id (previous sign in)
    // select kid or parent mode
    // signin with kid id.  Check for valid kid ID and remove from invitation list
    // signin as parent
    // go to admin or client home view

    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    //  Azure testing
    // - Uses JSON obj
    // - You can use custom row IDs when inserting
    // - When updating, specify the row ID and values to update
    // - https://github.com/TerryMooreII/angular-azure-mobile-service
    // Query example where col = val
    // ------------------------------
    //Azureservice.read('parents', "$filter=email eq 'bogus@test.com'")
    //.then(function (items) {
    //    //console.log(items)
    //    console.log(items.length)
    //}).catch(function (error) {
    //    console.log(error)
    //})
    // Insert example with customer row ID
    // ------------------------------
    //Azureservice.insert('parents', {
    //    id: globalService.makeUniqueID(), // made GUID for Azure table
    //    name: 'johny quest',
    //    email: 'test@test.com',
    //    isFinished: false
    //})
    //.then(function () {
    //    console.log('Insert successful');
    //}, function (err) {
    //    console.error('Azure Error: ' + err);
    //});
    // Update example with customer row ID
    // ------------------------------
    //Azureservice.update('kids', {
    //    id: rowGUID, // ID for the row to update
    //    status: 'accepted', // columns to update
    //    isFinished: false
    //})
    //.then(function () {
    //    console.log('Update successful');
    //}, function (err) {
    //    console.error('Azure Error: ' + err);
    //});
    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%



    // ==========================================
    //  Admin Sign In
    // ==========================================


    // OpenFB / ngFB stuff
    // ---------------------

    ngFB.init({ appId: '550469961767419', tokenStore: window.localStorage });

    // -- KEPT FOR REFERENCE
    ////check localStorage for 'fbAccessToken' and use it for user properties
    //if (window.localStorage.getItem('fbAccessToken')) {
    //    ngFB.api({
    //        method: 'GET',
    //        path: '/me',
    //        params: { fields: 'id,name,email,first_name' }
    //    }).then(
    //        function (result) {
    //            $scope.user = result;
    //            // put JSON result into User Array
    //            var userarray = new Array();
    //            userarray[0] = globalService.makeUniqueID(); // made GUID for Azure table
    //            userarray[1] = "admin"; //user role
    //            userarray[2] = result.name;
    //            userarray[3] = result.email;
    //            userarray[4] = result.first_name;
    //            localStorage["RYB_userarray"] = JSON.stringify(userarray);
    //        },
    //        errorHandler);
    //};

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
                    userarray[1] = "admin"; //user role
                    userarray[2] = result.name;
                    userarray[3] = result.email;
                    userarray[4] = result.first_name;
                    localStorage["RYB_userarray"] = JSON.stringify(userarray);

                    azureCheckUserandInsert(result.email, result.name); //@@@ Function to query azure 'parent' table to look for email and insert record

                    //globalService.changeView('admindash'); // @@@ this was moved to the end of azureCheckandInsert to ensure a serial order of successful tasks
                },
                errorHandler);
                // -----------------------------------

            },
            function (error) {
                alert('Facebook login failed: ' + error);
            });
    }
    // -- KEPT FOR REFERENCE
    //$scope.getInfo = function () {
    //    ngFB.api({ path: '/me' }).then(
    //        function (user) {
    //            console.log(JSON.stringify(user));
    //            alert(JSON.stringify(user));
    //            $scope.user = user;
    //        },
    //        errorHandler);
    //}
    //$scope.getProfile = function () {
    //    ngFB.api({
    //        method: 'GET',
    //        path: '/me',
    //        params: { fields: 'id,name,email,first_name' }
    //    }).then(
    //        function (result) {
    //            alert(JSON.stringify(result));
    //            $scope.user = result;
    //        },
    //        errorHandler);
    //}
    //$scope.share = function () {
    //    ngFB.api({
    //        method: 'POST',
    //        path: '/me/feed',
    //        params: { message: document.getElementById('Message').value || 'Testing Facebook APIs' }
    //    }).then(
    //        function () {
    //            alert('the item was posted on Facebook');
    //        },
    //        errorHandler);
    //}
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


    // ==========================================
    //  Client Sign In
    //  - Enter client ID.  Validate ID in Azure record.  Update Azure client record status
    // ==========================================


    // ==========================================
    //  Store new Admin user on Azure
    // ==========================================
    function azureCheckUserandInsert(email, name) {
        var query = "$filter=email eq '" + email + "'";
        Azureservice.read('parents', query).then(function (items) {  // query to see if 'email' exists
            if (items.length == 0) { // if not found, then insert it
                //console.log('email not found')

                Azureservice.insert('parents', {
                    id: globalService.makeUniqueID(),
                    name: name,
                    email: email,
                    isFinished: false
                })
                .then(function () {
                    //console.log('Insert successful');
                    globalService.changeView('admindash'); // @@@ after user is added, go to admin dash

                }, function (err) {
                    alert('Azure Error: ' + err);
                });
            }
            else {
                //alert('email exists already'),
                //console.log('email exists already')
                globalService.changeView('admindash'); // @@@ if user already exists, go to admin dash
            };

        }).catch(function (error) {
            console.log(error)
        })
    };
    // ==========================================

    // ==========================================
    //  Update Client registration on Azure
    // ==========================================
    function azureUpdateClientRegistration(reg_code) {
        var query = "$filter=reg_code eq '" + reg_code + "'";
        Azureservice.read('kids', query).then(function (items) {  // query to see if this 'reg_code' exists
            if (items.length == 0) { // if reg_code not found, then

                alert('reg_code not found.  start over')
                //console.log('reg_code not found')

            }
            else {
                alert('found code'),
                //console.log('email exists already')

                // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ Get row GUID to update.  Get client details and make localStorage array.  

                // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ Update client   @@@@@@@@@ REMOVE CODE AFTER ACCEPTING?  USE THAT COL FOR STATUS ALSO?  
                Azureservice.update('kids', {
                    id: rowGUID, // ID for the row to update
                    status: 'accepted', // columns to update
                    isFinished: false
                })
                .then(function () {
                    console.log('Update successful');
                    globalService.changeView('clientstart'); // @@@ go to clientstart view
                }, function (err) {
                    console.error('Azure Error: ' + err);
                });

            };

        }).catch(function (error) {
            console.log(error)
        })
    };
    // ==========================================


    // -- NOT NEEDED
    //// View changer.  Have to use $scope. to make available to the view
    //// --------------
    //$scope.gotoView = function () {
    //    globalService.changeView('admindash');
    //};






}); //controller end