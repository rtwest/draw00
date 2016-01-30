// clientstartController

cordovaNG.controller('clientstartController', function ($scope, globalService, Azureservice) {

    // Scope is like the view datamodel.  'message' is defined in the paritial view html {{message}}
    //$scope.message = "Nothing here yet";  //- TEST ONLY


    // ==========================================
    //  Get local user name, guid, and avatar
    // ==========================================

    var clientGUID = globalService.userarray[0];
    $scope.avatarID = globalService.userarray[3];
    $scope.clientName = globalService.userarray[4];

    // ==========================================




    // ==========================================
    //  Get friends from Azure based on Client GUID.  THIS CODE USED ON CLIENTPROPERTIESCONTROLLER.JS and CLIENTSTARTCONTROLLER.JS
    // ==========================================

    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ HOW TO AVOID CALLING THIS EVERYTIME THE VIEW IS LOADED.  NEED ONCE A SESSION. @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    var len, j;
    Azureservice.read('friends', "filter=kid1_id eq '" + clientGUID + "' or kid2_id eq '" + clientGUID + "'")
        .then(function (items) {
            if (items.length == 0) { // if no Friend record found, then
                // 'noFriendsFlag' is a flag the UI uses to check for 'show/hide' msg div
                $scope.noFriendsFlag = true;
                console.log('no connections yet')
            }
            else { // if friend records found, add to friendsarray  // @@@@@@ MAYBE 'PUSH' INTO ARRAY FOR MULTIPLE CLIENTS TO AVOID LOTS OF AZURE CALLS

                $scope.friendArray = []  // @@@ Make a brand New Array (( Dumping any existing one ))

                //alert(JSON.stringify(items));

                // Go through Friend items and reorder it 
                // --------------------------------------
                var len = items.length;
                for (i = 0; i < len; i++) {
                    if (items[i].kid1_id == clientGUID) {  // If the first kid is this client, using the 2nd
                        var element = {  // make a new array element
                            client_id: clientGUID,
                            record_id: items[i].id,
                            friend_id: items[i].kid2_id,
                            friend_name: items[i].kid2_name,
                            friend_avatar: ' ', //empty placeholder
                            //friend_parentname: ' ',
                            //friend_parentemail: ' ',
                        };
                        tempArray.push(element); // add back to array
                    }
                    else { // else use the first kid
                        var element = {  // make a new array element
                            client_id: clientGUID,
                            record_id: items[i].id,
                            friend_id: items[i].kid1_id,
                            friend_name: items[i].kid1_name,
                            friend_avatar: ' ', //empty placeholder
                            //friend_parentname: ' ',
                            //friend_parentemail: ' ',
                        };
                        tempArray.push(element); // add back to array
                    };
                };//end for

                // Different way of setting up the loop 
                j = 0;
                len = tempArray.length;
                getkiddetails(); // @@@ Call recursive Azure call

            };
        }).catch(function (error) {
            console.log(error); alert(error);
        });
    // RECURSIVELY Go through Friend array and get addtional info Kid table in Azure 
    // !!!!! LOTS OF CALL TO AZURE NOW  // !!!!! BETTER TO HAVE A CUSTOM API IN NODE TO DO THIS JOINING
    // --------------------------------------
    function getkiddetails() {
        //alert(j);

        if (j < tempArray.length) { // Don't know why this is going over the array size but this is a hack to fix

            Azureservice.getById('kid', tempArray[j].friend_id)
            .then(function (item) {

                // TRYING TO TAKE IT OUT OF THE OTHER AZURE CALL
                // -----
                tempArray[j].friend_avatar = item.avatar_id;
                //tempArray[j].friend_parentname = item.parent_name;
                //tempArray[j].friend_parentemail = item.parent_email;

                $scope.friendArray = tempArray; // @@@ Set to $scope array

                // RECUSIVE PART.  Regular FOR loop didn't work.
                // ------
                j++;
                if (j < len) {
                    getkiddetails();
                };

            }, function (err) {
                console.error('Azure Error: ' + err);
            });
        };
    };

    // ==========================================








    // View changer.  Have to use $scope. to make available to the view
    // --------------
    $scope.gotoCanvasView = function () {
        globalService.changeView('/canvas');
    };
    $scope.gotoGalleryView = function () {
        globalService.changeView('/gallery');
    };


}); //controller end