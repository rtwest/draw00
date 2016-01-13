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
            break;
        };
    };
    $scope.clientName = client[1];
    $scope.avatarID = client[2];
    // =======================================================



    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    // HOW TO AVOID UNCESSARY REPEAT AZURE CALL?  
    // --- Need persistent store.  Need LastTimeChecked var
    // --- set a scope var for last check time > 30min?
    // --- have a localStorage array for lastClientChecks?
    // --- use sessionStorage just for this session?
    // --- @@@@@ test how long a scope var is good for?
    // DIFFERENT CLIENTS TOO?
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@



    // Get time line (tab)
    // - get from server (last 2 weeks only kept).  Has who, what, when.

    // Click on picture image for full picture view in modal (LATER FEATURE)

    // Get friends lists (tab)
    // - get from server.
    // - with friend guid, look up parent data to show parent name, email
    // - action: remove


    // ==========================================
    //  Get friends from Azure based on Client GUID
    // ==========================================

    Azureservice.read('friends', "kid1_id=email eq '" + globalService.selectedClient + "' or kid2_id eq '" + globalService.selectedClient + "'")
        .then(function (items) {
            if (items.length == 0) { // if no Friend record found, then
                // 'noFriendsFlag' is a flag the UI uses to check for 'show/hide' msg div
                $scope.noFriendsFlag = true;
                console.log('no connections yet')
            }
            else { // if friend records found, add to friendsarray  // @@@@@@ MAYBE 'PUSH' INTO ARRAY FOR MULTIPLE CLIENTS?

                $scope.friendArray = []  // @@@ Make a brand New Array (( Dumping any existing one ))
                var tempArray = []
                //alert(JSON.stringify(items));

                // Go through Friend items and reorder it 
                // --------------------------------------
                var len = items.length;
                for (i = 0; i < len; i++) {
                    if (items[i].kid1_id == globalService.selectedClient) {  // If the first kid is this client, using the 2nd
                        var element = {  // make a new array element
                            client_id: globalService.selectedClient,
                            friend_id: items[i].kid2_id,
                            friend_name: items[i].kid2_name,
                            friend_avatar: ' ', //empty placeholder
                            friend_parentname: ' ',
                            friend_parentemail:' ',
                        };
                        tempArray.push(element); // add back to array
                    }
                    else { // else use the first kid
                        var element = {  // make a new array element
                            client_id: globalService.selectedClient,
                            friend_id: items[i].kid1_id,
                            friend_name: items[i].kid1_name,
                            friend_avatar: ' ', //empty placeholder
                            friend_parentname: ' ',
                            friend_parentemail: ' ',
                        };
                        tempArray.push(element); // add back to array
                    };
                };//end for

                //alert(tempArray[2].friend_id);

                // @@@@@ CALL TO GET KID INFORMATION - AVATAR, PARENT INFO
                // Go through Friend array and get addtional info Kid table in Azure 
                // !!!!! LOTS OF CALL TO AZURE NOW @@@@@@@@@@@@@@@@@@@@@@@@@ 
                // !!!!! BETTER TO HAVE A CUSTOM API IN NODE TO DO THIS JOINING
                // --------------------------------------
                for (i = 0; i < tempArray.length; i++) {
                    Azureservice.getById('kid', tempArray[i].friend_id)
                    .then(function (item) {

                        alert(JSON.stringify(item));

                        // @@@@@@@@@@@@@@@@DROP ALL CLIENT DATA AND START OVER WITH KIDS AND FRIENDS
                        // -----
                        //alert(JSON.stringify(tempArray[i]));

                        //$scope.friendArray[i].friend_avatar = item.avatar_id;
                        tempArray[i].friend_parentname = item.parent_name;
                        tempArray[i].friend_parentemail = item.parent_email;
                    }, function (err) {
                        console.error('Azure Error: ' + err);
                    });
                }; //end for
                $scope.friendArray = tempArray;

            };
        }).catch(function (error) {
            console.log(error); alert(error);
        });

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