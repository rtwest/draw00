// invitationlistController

cordovaNG.controller('invitationlistController', function ($scope, globalService, Azureservice) {

    // Scope is like the view datamodel.  'message' is defined in the paritial view html {{message}}
    //$scope.message = "Nothing here yet";  //- TEST ONLY

    $scope.noNewInvitationsMessage = false; // boolean for ng-show for 'no invitations' message
    $scope.noSentInvitationsMessage = false; // boolean for ng-show for 'no invitations' message


    // ==========================================
    //  Query Azure to get RECIEVED Invitiations and add to Invitation Array on the $scope
    // ==========================================
    $scope.newInvitationArray = []
    var localuserGUID = globalService.userarray[0]; //locally stored data about the user

    // Get new invitations sent to you
    // -----
    Azureservice.query('invitations', {
        criteria: { // Query for records where localuser is 'toparent_id'
            toparent_id: localuserGUID,
            status: '0'
            }
        })
        .then(function (items) {
            if (items.length == 0) { // if no invitations found, then
                // 'noInvitationsMessage' is a flag the UI uses to check for 'show/hide' msg div
                $scope.noNewInvitationsMessage = true;
                console.log('no invitations not found')
            }
            else { // if invitations found, add to invitationArray
                $scope.newInvitationArray = items; // Get the GUID for the parent
                alert(JSON.stringify(items));
            };
        }).catch(function (error) {
            console.log(error); alert(error);
        })
    // ==========================================


    // ==========================================
    //  Query Azure to get SENT Invitiations and add to Invitation Array on the $scope
    // ==========================================
    $scope.sentInvitationArray = []

    // Get invitations from you
    // -----
    Azureservice.query('invitations', {
        criteria: {   // Query for records where localuser is 'fromparent_id'
            fromparent_id: localuserGUID,
            status: '0'
            }
        })
        .then(function (items) {
            if (items.length == 0) { // if no invitations found, then
                // 'noInvitationsMessage' is a flag the UI uses to check for 'show/hide' msg div
                $scope.noSentInvitationsMessage = true;
                console.log('no sent invitations not found')
            }
            else { // if invitations found, add to invitationArray
                $scope.sentInvitationArray = items; // Get the Azure data into local array
                alert(JSON.stringify(items));
            };
        }).catch(function (error) {
            console.log(error); alert(error);
        });
    // ==========================================




    // ==========================================
    //  Accept invitation.  Update invitation record from Azure Invitation table.  
    //  Add Friend Record to Azure Friends table. 
    // ==========================================
    $scope.acceptInvitationClick = function (clickEvent) {
        $scope.clickEvent = globalService.simpleKeys(clickEvent);
        $scope.clientId = clickEvent.target.id;
        alert('accept invitation id = ' + $scope.clientId);

        // call AcceptInvitation with record ID
        acceptInvitation($scope.clientId);  // If the accept/delete is successful, this call Insert Friend record
    }

    // Update invitation record from Azure Invitation Table
    // ---------------
    function acceptInvitation(record_id) {
        var foundIndex;
        // Get the clicked record ID and look up in new invitation array to get kid names and GUID to pass to create Friends Record 
        for (i = 0, len = $scope.newInvitationArray.length; i < len; i++) {
            if ($scope.newInvitationArray[i].id == record_id) {
                foundIndex = i;
                kid1id = $scope.newInvitationArray[i].fromkid_id;
                kid2id = $scope.newInvitationArray[i].tokid_id;
                kid1name = $scope.newInvitationArray[i].fromkid;
                kid2name = $scope.newInvitationArray[i].tokid;
                break;
            };
        };
        // ----------
        // Azure part
        // ----------
        // @@@ Push Notification is sent from Node on Update to let FromParent know invitation was accepted.
        Azureservice.update('invitations', {
            id: record_id, // ID for the row to update
            status: '1', // column name to update. 1=accepted
        })
        .then(function () { // if success,
            console.log('Accept/Delete successful'); //alert('Accept/Delete successful')
            InsertFriendRecord(kid1id, kid2id, kid1name, kid2name); // @@@ On success, Insert new Friend record in Azure Friend Table
            //InsertEventRecord(kid1id, kid2id, kid1avatar, kid2avatar, kid1name, kid2name); // @@@ On success, Insert new Event record in Azure Event Table

            $scope.newInvitationArray.splice(foundIndex, 1) // remove from this element at index number from 'sentInvitationArray'

        }, function (err) {
            console.error('Azure Error: ' + err);
            alert('Azure Error: ' + err);
        });
        if ($scope.newInvitationArray.length == 1) { $scope.noNewInvitationsMessage = true }; // If only one item in new invitations array and you accept/remove it, then show no new invitations UI
    };

    // Insert new Friend record in Azure Friend Table
    // ---------------
    function InsertFriendRecord(kid1id, kid2id, kid1name, kid2name) {
        // Create on Azure
        // ---------------
        // @@@ Push Notification is sent from Node on Insert to let both Kids know Friend connection made
        // !!! NOTE: You can't get a push notification if the client haven't ever signed in and registered yet
        Azureservice.insert('friends', {
            //id: guid, // I'll let Azure handle this GUID since I don't need to track it locally        
            kid1_id: kid1id,
            kid2_id: kid2id,
            kid1_name:kid1name,
            kid2_name: kid2name
        })
        .then(function () {
            console.log('new friend insert successful');
            // --- THIS WASN'T FIRING SO I'M CHAINING THE AZURE INSERTS IN SERIAL IN CASE THEY CAN'T FIRE IN PARRALLEL.  WOULD BE BETTER AS 1 CALL AND DO IT IN NODE.JS
            InsertEventRecord(kid1id, kid2id, kid1name, kid2name); // @@@ On success, Insert new Event record in Azure Event Table

        },
        function (err) {
            console.error('Azure Error: ' + err);
        });

    };
    // ==========================================




    // ####################################################################### NOT SURE YOU CAN SEQUENCE AZURE CALLS.  i'VE HAD TO CHAIN THEM IN THE PAST
    // Insert new Event record in Azure Event Table
    // ---------------
    function InsertEventRecord(kid1id, kid2id, kid1name, kid2name) {

        // @@@@@@@@@@@@@@ need to get Avatars
        var kid1avatar
        var kid2avatar

        //Query Azure
        // -----------
        Azureservice.getById('kid', kid1id)
        .then(function (item) {
            kid1avatar = item.avatar_id;
            alert('got kid1 avatar - ' + kid1avatar);
        }, function (err) {
            console.error('Azure Error: ' + err);
        });

        //Query Azure
        // -----------
        Azureservice.getById('kid', kid2id)
        .then(function (item) {
            kid2avatar = item.avatar_id;
            alert('got kid2 avatar - ' + kid2avatar);
        }, function (err) {
            console.error('Azure Error: ' + err);
        });


        // Create on Azure
        // ---------------
        Azureservice.insert('events', {
            //id: guid, // I'll let Azure handle this GUID since I don't need to track it locally        
            fromkid_id: kid1id,
            tokid_id: kid2id,
            fromkid_avatar: kid1avatar,
            tokid_avatar: kid2avatar,
            fromkid_name: kid1name,
            tokid_name: kid2name,
            datetime: Date.now(),
            event_type: "friends",
        })
        .then(function () {
            alert('freind record inserted');
            console.log('new event insert successful');
        },
        function (err) {
            console.error('Azure Error: ' + err);
        });

    };
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