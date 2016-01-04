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
    var query = "$filter=toparent_id eq '" + localuserGUID + "'";  // Query for records where localuser is 'toparent_id'
    Azureservice.read('invitations', query).then(function (items) {  
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
    var query = "$filter=fromparent_id eq '" + localuserGUID + "'";  // Query for records where localuser is 'toparent_id'
    Azureservice.read('invitations', query).then(function (items) {
        if (items.length == 0) { // if no invitations found, then
            // 'noInvitationsMessage' is a flag the UI uses to check for 'show/hide' msg div
            $scope.noNewInvitationsMessage = true;
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
    //  Accept invitation.  Delete invitation record from Azure Invitation table.  Add Friend Record to Azure Friends table. 
    //     ????? Add to Friend Local Storage ?????
    // ==========================================
    $scope.acceptInvitationClick = function (clickEvent) {
        $scope.clickEvent = globalService.simpleKeys(clickEvent);
        $scope.clientId = clickEvent.target.id;
        alert('accept invitation id = ' + $scope.clientId);

        acceptInvitation($scope.clientId);  // If the accept/delete is successful, this call Insert Friend record
    }

    // Delete invitation record from Azure Invitation Table
    // ---------------
    function acceptInvitation(record_id) {


        // @@@@@@@@@@@@@@@@@@@ WORKING HERE @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@2
        //  NEED TO GET THE CLICKED RECORD ID AND LOOK UP IN INVITATION ARRAY TO GET KID NAMES AND GUIDS FOR FRIENDS RECORD



        // ----------


        // Azure part
        // ----------
        // @@@ Push Notification is sent from Node on Delete to let both users know invitation was accepted.
        Azureservice.del('invitations', {
            id: record_id // ID for the row to delete
        })
        .then(function () { // if success,
            console.log('Accept/Delete successful'); alert('Accept/Delete successful')
            InsertFriendRecord(kid1, kid2, kid1name, kid2name); // @@@ On success, Insert new Friend record in Azure Friend Table
        }, function (err) {
            console.error('Azure Error: ' + err);
            alert('Azure Error: ' + err);
        });
        if ($scope.newInvitationArray.length == 1) { $scope.noNewInvitationsMessage = true }; // If only one item in new invitations array and you accept/remove it, then show no new invitations UI
    };

    // Insert new Friend record in Azure Friend Table
    // ---------------
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@2
    // How will this be pulled down by clients?  If just GUID, then i'll have to do another look up to the the name from the GUID>
    // Do I store friends list on Admin local storage also -- or just pull down on the view?
    function InsertFriendRecord(kid1, kid2, kid1name, kid2name) {
        // Create on Azure
        // ---------------
        // @@@ Push Notification is sent from Node on Insert to let both Kids know Friend connection made
        Azureservice.insert('friends', {
            //id: guid, // I'll let Azure handel this GUID since I don't need to track it locally        
            kid1_id: kid1,
            kid2_id: kid2,
            kid1_name:kid1name,
            kid2_name: kid2name
        })
        .then(function () {
            console.log('new friend insert successful');
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