// clientpropertiesController

cordovaNG.controller('clientpropertiesController', function ($scope, globalService, Azureservice) {

    // Scope is like the view datamodel.  'message' is defined in the paritial view html {{message}}
    //$scope.message = "Nothing here yet";  //- TEST ONLY

    $scope.noFriendsFlag = false; // boolean for ng-show for 'no friends' message
    $scope.noEventsFlag = false;  


    // =======================================================
    // From the Client GUID, get the rest of Client Properties
    // =======================================================
    var client = [];
    var clientarray = [];
    clientarray = JSON.parse(localStorage.getItem('RYB_clientarray')); // get array from localstorage key pair and string
    // Search through array of arrays
    // ----
    var foundIndex = '';
    var len = clientarray.length;
    for (i = 0; i < len; i++) {
        if (clientarray[i].indexOf(globalService.selectedClient) > -1) { // If GUID found in this subarray 
            foundIndex = i;
            client = clientarray[i];
            alert(client);
            alert(client[1]);
            break;
        };
    };
    $scope.clientName = client[1];
    $scope.avatarID = client[2];
    // =======================================================



    // Get time line (tab)
    // - get from server (last 2 weeks only kept).  Has who, what, when.

    // Click on picture image for full picture view in modal (LATER FEATURE)

    // Get friends lists (tab)
    // - get from server.
    // - with friend guid, look up parent data to show parent name, email
    // - action: remove


    // ==========================================
    //  Get friends from Azure.  Set to global scope var to avoid unecessary refresh
    // ==========================================
    //$scope.friendsarray = []; //create as an array
    //var temparray = [];

    //if (globalService.friendArray) {

    //    // @@@ THIS HAS ALL FRINED RECORDS.  THE UI BINDING WILL FILTER THIS TO JUST THE CLIENT GUID
    //    friendsarray = JSON.parse(localStorage.getItem('RYB_friendsarray')); // get array from localstorage key pair and string
    //    // temparray = JSON.parse(localStorage.getItem('RYB_friendsarray'));

    //    //$scope.friendsarray = $filter('filter')(temparray, { parameter: value })[0];

    //}
    //else { // if no friends, show special message for this case 
    //    alert('no friends found')
    //    $scope.noFriendsFlag = true;
    //};


    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    // HOW TO AVOID UNCESSARY REPEAT AZURE CALL?  
    // --- set a scope var for last check time > 30min?
    // --- @@@@@ test how long a scope var is good for?
    // DIFFERENT CLIENTS TOO?
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


    // ==========================================
    //  Query Azure to get FRIENDS records based in GUID
    // ==========================================

    Azureservice.read('friends', "kid1_id=email eq '" + globalService.selectedClient + "' or kid2_id eq '" + globalService.selectedClient + "'")
        .then(function (items) {
            if (items.length == 0) { // if no Friend record found, then
                // 'noFriendsFlag' is a flag the UI uses to check for 'show/hide' msg div
                $scope.noFriendsFlag = true;
                console.log('no connections yet')
            }
            else { // if friend records found, add to friendsarray  // @@@@@@ MAYBE 'PUSH' INTO ARRAY FOR MULTIPLE CLIENTS?

                $scope.friendArray = []
                alert(JSON.stringify(items));

                // Go through Friend items and reorder it 
                // --------------------------------------
                var len = items.length;
                for (i = 0; i < len; i++) {
                    if (items[i].kid1_id == globalService.selectedClient) {  // If the first kid is this client, using the 2nd
                        var element = {  // make a new array element
                            client_id: globalService.selectedClient,
                            friend_id: items[i].kid2_id,
                            friend_name: items[i].kid2_name,
                        };
                        $scope.friendArray.push(element); // add back to array
                    }
                    else { // else use the first kid
                        var element = {  // make a new array element
                            client_id: globalService.selectedClient,
                            friend_id: items[i].kid1_id,
                            friend_name: items[i].kid1_name,
                        };
                        $scope.friendArray.push(element); // add back to array
                    };

                    //$scope.friendArray = globalService.friendArray; // Have to use $scope for this view's data model not globalService var

                };//end for

            };
        }).catch(function (error) {
            console.log(error); alert(error);
        })
    // ==========================================







    // ==========================================
    // Delete on Friend record
    // ==========================================
    $scope.deleteFriendClick = function (clickEvent) {
        $scope.clickEvent = globalService.simpleKeys(clickEvent);
        $scope.clientId = clickEvent.target.id;
        alert('delete item = ' + $scope.clientId);

        deleteFriendRecord($scope.clientId);
    }

    function deleteFriendRecord(id) {
        Azureservice.del('friends', {
            id: id // ID for the row to delete    
        })
        .then(function () {
            console.log('Delete successful');
            //alert('Delete successful')
        }, function (err) {
            //console.error('Azure Error: ' + err);
            alert('Azure Error: ' + err);
        });
    }

    // ==========================================




    // View changer.  Have to use $scope. to make available to the view
    // --------------
    $scope.gotoView = function () {
        globalService.changeView('/');
    };
    $scope.gotoAdminView = function () {
        globalService.changeView('/admindash');
    };

}); //controller end