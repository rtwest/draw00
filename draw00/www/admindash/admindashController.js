// admindashController

// - Load the client array.  CRUD operations here are pushed to web, so the local store is always most current


cordovaNG.controller('admindashController', function ($scope, globalService, Azureservice) {
    // Scope is like the view datamodel.  'message' is defined in the paritial view html {{message}}
    //$scope.message = "Nothing here yet";  //- TEST ONLY

    $scope.showaddclientui = false; // boolean for ng-show for add client modal
    $scope.showClientAddedUI = false; // boolean for ng-show for ClientAdded message
    $scope.noClientFlag = false; // boolean for ng-show for 'no client' message
    // ---
    $scope.showInvitationForm = false; // boolean for ng-show for add invitation modal


    //alert(globalService.userarray);
    // alert(localStorage.getItem('RYB_clientarray'));  // the returned string is not a usable array.  Needs Json.Parse for that.

    // FOR TESTING HERE ONLY
    // FOR TESTING HERE ONLY
    // FOR TESTING HERE ONLY
    // FOR TESTING HERE ONLY
    // ==========================================
    //  Insert an Event in the Event log based on Client GUID
    // ==========================================

    //Azureservice.insert('events', {
    //    //id: globalService.makeUniqueID(), // i don't need to track this so let Azure handle it
    //    picture_url: 'https://rtwdevstorage.blob.core.windows.net/imagecontainer/9627402787096.png',
    //    fromkid_id: '08ba64e5-4271-412f-9fd1-c59738e4c4a5',
    //    fromkid_name: 'TEST',
    //    event_type: "shared a picture with",
    //    tokid_id: 'fa530f03-c3dc-4c10-9c0f-ce0ec2a5ff5e',
    //    tokid_name:'Jason',
    //    //comment_content: 'this is a comment here',
    //    datetime: Date.now(),
    //})
    //.then(function () {
    //    console.log('Insert successful');
    //}, function (err) {
    //    console.log('Azure Error: ' + err);
    //});

    // ==========================================

















    // ==========================================
    //  Get local client array.   
    // ==========================================
    $scope.clientarray = []; //create as an array

    if (localStorage.getItem('RYB_clientarray')) { 
        $scope.clientarray = JSON.parse(localStorage.getItem('RYB_clientarray')); // get array from localstorage key pair and string
        alert("array length: " + $scope.clientarray.length + " - " + $scope.clientarray)
    }
    else { // if no clients, show special message for this case 
        alert('no clients found')
        $scope.noClientFlag = true;
    };
    // ==========================================

    // This will be a default avatar the kid can change on first logon
    // ==========================================
    $scope.randomAvatarID = function() {
        $scope.avatarID = Math.floor((Math.random() * 10) + 1); // Random number between 1-10
    };
    // ==========================================



    // ==========================================
    //  Create new client.  Store locally and create on Azure
    // ==========================================
    $scope.addNewClient = function (name) {
        addKid(name);
        $scope.showaddclientui = false;
    };

    function makeRegistrationCode() {
        var text = "";
        //var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";        
        var possible = "abcdefghijklmnopqrstuvwxyz";
        for (var i = 0; i < 6; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    };

    function addKid(name) {

        var guid = globalService.makeUniqueID();
        var registrationCode = makeRegistrationCode();

        // Store new Client info in localStorage
        // ---------------
        var clientitemarray = [];
        clientitemarray[0] = guid;
        clientitemarray[1] = name;
        clientitemarray[2] = $scope.avatarID;
        clientitemarray[3] = registrationCode

        $scope.clientarray.push(clientitemarray); //add first item to localstorage arraystring
        localStorage["RYB_clientarray"] = JSON.stringify($scope.clientarray); //push back to localStorage
        //if ($scope.clientarray.length > 0) { // if it exists already (not the first one)
        //    var arraylength = $scope.clientarray.length; // 'length' is actually array+1 because of zero index
        //    $scope.clientarray[arraylength] = clientitemarray; //add new item to client array
        //    localStorage["RYB_clientarray"] = JSON.stringify($scope.clientarray); //push back to localStorage
        //}
        //else{ // it doesn't already exist and this is the first one
        //    $scope.clientarray[0] = clientitemarray; //add first item to localstorage arraystring
        //    localStorage["RYB_clientarray"] = JSON.stringify($scope.clientarray); //push back to localStorage
        //};
        $scope.clientarray = JSON.parse(localStorage.getItem('RYB_clientarray')); // get updated array from localstorage key pair and string
        //alert("array length = "+ $scope.clientarray.length + " - " + $scope.clientarray)

        // Confirmation message
        $scope.showClientAddedUI = true; // toggle this boolean for ng-show in the UI
        $scope.noClientFlag = false;

        // Create on Azure
        // ---------------
        Azureservice.insert('kid', {
            id: guid, // made GUID for Azure table        
            name: name,
            parent_id: globalService.userarray[0],
            registration_code: registrationCode,
            reg_status: '0',
            avatar_id: $scope.avatarID,
            parent_name:globalService.userarray[4],
            parent_email: globalService.userarray[3],
        })
        .then(function () {
            console.log('new client insert successful');

            // Make array of parent and friends to iterate through recursively to add as friends
            var kid_array = [guid, name, $scope.avatarID];// new kid
            var client_item_array = [];
            client_item_array = $scope.clientarray.slice(0); // add all the clients.  ".slice(0)" make sure you copy the array, not link to it.
            var admin_array = [globalService.userarray[0], globalService.userarray[4], globalService.userarray[5]];  // id, firstname, avatar
            client_item_array.push(admin_array); // push the admin/parent in there

            // Call function with this array, start index, end index
            CheckAndInsertFriendRecord(kid_array,client_item_array, 0, client_item_array.length);

        },
        function (err) {
            console.error('Azure Error: ' + err);
        });
    };
    // ==========================================

    // ==========================================
    // Insert family friend record in Azure Friend Table
    // ==========================================
    function CheckAndInsertFriendRecord(kid_array,client_item_array, startindex, endindex) {

        if (startindex < endindex) {

            var friend_array = client_item_array[startindex];
            var kid2id = friend_array[0];
            var kid2name = friend_array[1];
            var kid2avatar = friend_array[2];

            var kid1id = kid_array[0];
            var kid1name = kid_array[1];
            var kid1avatar = kid_array[2];

            if (kid2id != kid1id) { // check IDs so you don't add kid as friend to themself

                Azureservice.insert('friends', {
                    //id: guid, // I'll let Azure handle this GUID since I don't need to track it locally        
                    kid1_id: kid1id,
                    kid2_id: kid2id,
                    kid1_name: kid1name,
                    kid2_name: kid2name
                })
                .then(function () {
                    console.log('new friend insert successful');
                    //InsertEventRecord(kid1id, kid2id, kid1name, kid2name, kid1avatar,kid2avatar); // @@@ On success, Insert new Event record in Azure Event Table
                },
                function (err) {
                    console.error('Azure Error: ' + err);
                });

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
                    //alert('freind record inserted');
                    console.log('new event insert successful');
                },
                function (err) {
                    console.error('Azure Error: ' + err);
                });

            }; // end if

            // @@@ Recursive part
            CheckAndInsertFriendRecord(kid_array, client_item_array, startindex + 1, endindex)

        }; // end if
    };


    // ==========================================
    // Delete Client
    // ==========================================
    $scope.deleteClientClick = function (clickEvent) {
        $scope.clickEvent = globalService.simpleKeys(clickEvent);
        $scope.clientId = clickEvent.target.id;
        alert('delete item = ' + $scope.clientId);

        deleteClient($scope.clientId);
    }

    function deleteClient(id) {
        // Delete from localStorage
        // ---------------
        var foundIndex;
        var len = $scope.clientarray.length;
        for (i = 0; i < len; i++) {
            if ($scope.clientarray[i].indexOf(id) > -1) { // If found in this subarray 
                foundIndex = i;
                //alert('found at: ' + foundIndex);
                $scope.clientarray.splice(foundIndex, 1) // remove from this element at index number from 'clientarray'
                //alert($scope.clientarray);
                localStorage["RYB_clientarray"] = JSON.stringify($scope.clientarray); //push back to localStorage

                // Delete on Azure
                // ---------------
                Azureservice.del('kid', {
                    id: id // ID for the row to delete    
                })
                .then(function () {
                    console.log('Delete successful');

                    // @@@ Once the Client is deleted, have to delecte other records this client is in
                    GetFriendRecordsAndDelete(id);

                }, function (err) {
                    //console.error('Azure Error: ' + err);
                    alert('Azure Error: ' + err);
                });

                break;
            };
        };
        if (len == 1) { $scope.noClientFlag = true }; // If only one item in client array and you remove it, then show no clients UI

    };
    // ==========================================

    // ==========================================
    //  Delete friends records from Azure based on Client GUID
    // ==========================================
    var len, j;

    function GetFriendRecordsAndDelete(id) {

     Azureservice.read('friends', "$filter=kid1_id eq '" + id + "' or kid2_id eq '" + id + "'")
        .then(function (items) {
            if (items.length == 0) { // if no Friend record found, then
                console.log('no connections yet')
            }
            else { // if friend records found, Go through Items and Delete them  
                alert(JSON.stringify(items));

                // Different way of setting up the loop 
                // ---
                j = 0;
                len = items.length;
                DeleteFriendRecords(items); // @@@ Call recursive Azure call

            };
        }).catch(function (error) {
            console.log(error); alert(error);
        });
    };

    // RECURSIVELY Go through Friend array and delete each from Friends table in Azure 
    // !!!!! LOTS OF CALL TO AZURE NOW  // !!!!! BETTER TO HAVE A CUSTOM API IN NODE TO DO THIS JOINING
    // --------------------------------------
    function DeleteFriendRecords(items) {
        alert(j);
        // Delete on Azure
        // ---------------
        Azureservice.del('friends', {
            id: items[j].id // ID for the row to delete    
        })
        .then(function () {
            console.log('Delete successful');
            // @@@ RECUSIVE PART.  Regular FOR loop didn't work.
            // ------
            j++;
            if (j < len) {
                DeleteFriendRecords(items);
            };
        }, function (err) {
            //console.error('Azure Error: ' + err);
            alert('Azure Error: ' + err);
        });
        // ---------------

    };

    // ==========================================










    // ==========================================
    // Click on Client
    // ==========================================
    // Ng-repeat used to list DOM elements with DB table rowid loaded into elementID so its captured on the target.id
    // Need this to retreive GUID in Div ID property for record CRUD
    // ------------------------------------------
    $scope.clientclick = function (clickEvent) {
        $scope.clickEvent = globalService.simpleKeys(clickEvent);
        globalService.selectedClient = clickEvent.target.id; // Tracked the selected client in Global Var in Service
        alert('selected item = ' + globalService.selectedClient);
        globalService.changeView('/clientproperties');

    };
    // ==========================================








    // ==========================================
    //  Create New Friend request record on Azure.  Store locally and create on Azure
    // ==========================================
    //1. enter parent email and lookup to verify, and get clients for this admin
    //2. enter the kids display name and lookup in client array verify
    //3. default to the display of the kid whose context you're creating the invitation in
    //4. create new invitation record with the 4 corresponding IDs
    // INVITATION RECORD: fromparent_id, toparent_id, fromkid, tokid, datetime

    // #########################################################################################################################################################
    var ToParentID, ToParentName, ToKidName, FromKidName, FromKidID, ToKidID;
    var clientarray2 = [];

    // Choose Client (if needed)
    // ------------
    FromKidID = '08ba64e5-4271-412f-9fd1-c59738e4c4a5' // FOR TESTING
    FromKidName = 'Berk'
    // ------------




    // Verify Parent
    // ------------
    $scope.verifyParent = function (email) {
        azureQueryParent(email)
        $scope.verifyParentError = false;
    };
    function azureQueryParent(email) {
        var query = "$filter=email eq '" + email + "'";
        Azureservice.read('parents', query).then(function (items) {  // query to see if this 'reg_code' exists
            if (items.length == 0) { // if email not found, then
                // 'verifyParentError' is a flag the UI uses to check for 'show/hide' error div
                $scope.verifyParentError = true;
                $scope.verifyParentErrorMessage = '"' + email + '" is not a valid email.  Please check and try again.'
                console.log('email not found')
            }
            else { // if email found, show verify success and kid verification UI
                $scope.verifyParentSuccess = true;
                ToParentID = items[0].id; // Get the GUID for the parent
                ToParentName = items[0].name; // Get the GUID for the parent
                azureQueryClientList(ToParentID)
            };
        }).catch(function (error) {
            console.log(error)
            alert(error);
        })
    };

    // Get Clients for Admin ID
    // ------------
    function azureQueryClientList(adminGUID) {
        var query = "$filter=parent_id eq '" + adminGUID + "'";
        Azureservice.read('kid', query).then(function (items) {  // query to see if this 'name' exists
            if (items.length == 0) { // if admin guid not found, then
                console.log('admin guid  not found')
            }
            else { // if admin guid found, get the client list (JSON) and put in array
                clientarray2 = items;  //alert(clientarray2[0].name);
            };
        }).catch(function (error) {
            console.log(error);
            alert(error);
        })
    };

    // Verify Kid by looking up in Client Array
    // ------------
    $scope.verifyKid = function (name) {
        $scope.verifyKidError = false;
        lookUpClientinArray(name)
    };
    function lookUpClientinArray(name) {
        var found = false;
        for (i = 0, len = clientarray2.length; i < len; i++) {
            //alert(clientarray2[i].name);
            if (clientarray2[i].name == name) {
                found = true;
                ToKidID = clientarray2[i].id; // Get the GUID for this client
                break;
            };
        };
        if (found == true) { // name is in the Client array (-1 means not found), then show verify success and addNewInvitation button
            $scope.verifyKidSuccess = true;
            ToKidName = name; // use the name for the kid
        }
        else { // if kid name not found, 
            // 'verifyKidError' is a flag the UI uses to check for 'show/hide' error div
            $scope.verifyKidError = true;
            $scope.verifyKidErrorMessage = '"' + name + '" is not a valid user.  Please check and try again.'
            console.log('kid name not found')
        };
    };

    // Create invitation record
    // ------------
    $scope.addNewInvitation = function () {
        $scope.verifyKidSuccess = false; //toggle to turn off the UI modal (could be in html also)

        // Create on Azure
        // ---------------
        // @@@ Push Notification sent by Node after Insert to ToParent for invitation 
        Azureservice.insert('invitations', {
            id: globalService.makeUniqueID(), // made GUID for Azure table        
            fromparent_id: globalService.userarray[0],
            fromparent_name: globalService.userarray[4], //first name.  full name is [2]
            toparent_id: ToParentID,
            toparent_name: ToParentName,
            fromkid: FromKidName,
            tokid: ToKidName,
            fromkid_id: FromKidID,
            tokid_id: ToKidID,
            status: '0', // unaccepted
        })
        .then(function () {
            console.log('new invitation insert successful');
            $scope.invitationSuccess = true; // UI flag that invitation was sent
            $scope.showInvitationForm = false;
        },
        function (err) {
            console.error('Azure Error: ' + err);
            $scope.invitationError = true;
            $scope.invitationErrorMessage = err; // UI flag that invitation was sent
        });
    };

    // ==========================================



    // View changers.  Have to use $scope. to make available to the view
    // --------------
    $scope.gotoView = function () {
        globalService.changeView('/');
    };
    $scope.gotoInvitationView = function () {
        globalService.changeView('/invitationlist');
    };
    





}); //controller end