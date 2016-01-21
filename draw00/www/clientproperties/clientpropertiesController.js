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


    // Click on picture image for full picture view in modal (LATER FEATURE)


    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    // HOW TO AVOID UNCESSARY REPEAT AZURE CALL?  
    // --- Need persistent store.  Need LastTimeChecked var
    // --- set a scope var for last check time > 30min?
    // --- have a localStorage array for lastClientChecks?
    // --- use sessionStorage just for this session?
    // --- @@@@@ test how long a scope var is good for?
    // DIFFERENT CLIENTS TOO?
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    var tempArray = []; // This resets the local array (which $scope is set to later)

    // ==========================================
    //  Get the Event log based on Client GUID
    // ==========================================
    Azureservice.read('events', "filter=from_kid_id eq '" + globalService.selectedClient + "' or to_kid_id eq '" + globalService.selectedClient + "'")
      .then(function (items) {

          if (items.length == 0) { // if no Event record found, then
              $scope.noEventsFlag = true;   // '...Flag' is a flag the UI uses to check for 'show/hide' msg div
              console.log('no events in last 2 weeks')
          }
          else {
              // Go through Friend items and reorder it 
              // --------------------------------------
              var tempArray = [];
              var len = items.length;
              var today = new Date(); // today for comparison
              var day, time; // @@@@@@@@@@@@@@ PLACEHOLDERS 
              thiseventday = new Date();
              lasteventday = new Date();

              items = items.reverse()

              for (i = 0; i < len; i++) {

                  lasteventday = thiseventday;
                  thiseventday = new Date(items[i].datetime); // convert datetime to number

                  // @@@@@@@@@@@@@@@@@@@@@@@2222 CHECK FOR FIRST ITEM IN ARRAY --- IT HAS TO HAVE A HEADER

                  // Compare Day and Month
                  if (i > 0) { // If this is not first in array, check if you need it.
                      if ((thiseventday.getDate() == lasteventday.getDate()) && (thiseventday.getMonth() == lasteventday.getMonth())) {
                          day = null;
                      }
                      else if ((thiseventday.getDate() == today.getDate()) && (thiseventday.getMonth() == today.getMonth())) {
                          day = 'Today';
                      }
                          // If Day is Today-1, Then its Yesterday
                      else if ((thiseventday.getDate() == (today.getDate() - 1)) && (thiseventday.getMonth() == today.getMonth())) {
                          day = 'Yesterday';
                      }
                      else { day = thiseventday }
                  }
                  else { // If this is first in array, choose the date header
                      if ((thiseventday.getDate() == today.getDate()) && (thiseventday.getMonth() == today.getMonth())) {
                          day = 'Today';
                      }
                          // If Day is Today-1, Then its Yesterday
                      else if ((thiseventday.getDate() == (today.getDate() - 1)) && (thiseventday.getMonth() == today.getMonth())) {
                          day = 'Yesterday';
                      }
                      else { day = thiseventday }
                  }

                  var element = {  // make a new array element
                      picture_id:items[i].picture_id,
                      fromkid_id:items[i].fromkid_id,
                      tokid_id:items[i].tokid_id,
                      comment_content:items[i].comment_content, 
                      day: day,
                      time: thiseventday,
                      datetime: items[i].datetime,  // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@2  WORKING HERE TO PARSE DATE TIME 
                  };
                  tempArray.push(element); // add back to array
              }; //end for

              $scope.eventarray = tempArray;
              alert(JSON.stringify($scope.eventarray))

          }; // end if


      }).catch(function (error) {
          console.log(error)
    });




    // ==========================================









    // ==========================================
    //  Get friends from Azure based on Client GUID
    // ==========================================
    var len, j;
    Azureservice.read('friends', "filter=kid1_id eq '" + globalService.selectedClient + "' or kid2_id eq '" + globalService.selectedClient + "'")
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
                    if (items[i].kid1_id == globalService.selectedClient) {  // If the first kid is this client, using the 2nd
                        var element = {  // make a new array element
                            client_id: globalService.selectedClient,
                            record_id:items[i].id,
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
                            record_id: items[i].id,
                            friend_id: items[i].kid1_id,
                            friend_name: items[i].kid1_name,
                            friend_avatar: ' ', //empty placeholder
                            friend_parentname: ' ',
                            friend_parentemail: ' ',
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
                tempArray[j].friend_parentname = item.parent_name;
                tempArray[j].friend_parentemail = item.parent_email;

                $scope.friendArray = tempArray; // Set to $scope array

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







    // ==========================================
    // Delete on Friend record
    // ==========================================
    $scope.deleteFriendClick = function (clickEvent) {
        $scope.clickEvent = globalService.simpleKeys(clickEvent);
        $scope.clientId = clickEvent.target.id;
        //alert('delete item = ' + $scope.clientId);

        deleteFriendRecord($scope.clientId);
    }

    function deleteFriendRecord(id) {
        Azureservice.del('friends', {
            id: id // ID for the row to delete    
        })
        .then(function () {
            console.log('Delete successful');
            //alert('Delete successful')

            // Remove from $scope.friendArray.  Its a pain to rebuild
            // -----------
            var foundIndex;
            var len = $scope.friendArray.length;
            for (i = 0; i < len; i++) {
                //alert(JSON.stringify($scope.friendArray[i]));
                if ($scope.friendArray[i].record_id == id) { // If found in this subarray 
                    foundIndex = i;
                    //alert('found at: ' + foundIndex);
                    $scope.friendArray.splice(foundIndex, 1) // remove from this element at index number from 'clientarray'
                    //alert($scope.friendArray);
                    break;
                };
            };
            if ($scope.friendArray.length == 0) {
                $scope.noFriendsFlag = true; // UI flag
            };

        }, function (err) {
            console.error('Azure Error: ' + err);  //alert('Azure Error: ' + err);
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