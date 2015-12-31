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

        // Store in localStorage
        // ---------------
        var clientitemarray = [];
        clientitemarray[0] = guid;
        clientitemarray[1] = name;
        if ($scope.clientarray.length > 0) { // if it exists already (not the first one)
            var arraylength = $scope.clientarray.length; // 'length' is actually array+1 because of zero index
            $scope.clientarray[arraylength] = clientitemarray; //add new item to client array
            localStorage["RYB_clientarray"] = JSON.stringify($scope.clientarray); //push back to localStorage
        }
        else{ // it doesn't already exist and this is the first one
            $scope.clientarray[0] = clientitemarray; //add first item to localstorage arraystring
            localStorage["RYB_clientarray"] = JSON.stringify($scope.clientarray); //push back to localStorage
        };
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
            registration_code: makeRegistrationCode(),
            reg_status: '0'
        })
        .then(function () {
            console.log('new client insert successful');
        },
        function (err) {
            console.error('Azure Error: ' + err);
        });
    };
    // ==========================================


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
                    //alert('Delete successful')
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
    // Click on Client
    // ==========================================
    // Ng-repeat used to list DOM elements with DB table rowid loaded into elementID so its captured on the target.id
    // Need this to retreive GUID in Div ID property for record CRUD
    // ------------------------------------------
    $scope.clientclick = function (clickEvent) {
        $scope.clickEvent = globalService.simpleKeys(clickEvent);
        $scope.clientId = clickEvent.target.id;
        alert('selected item = ' + $scope.clientId);

    };
    // ==========================================








    // ==========================================
    //  Create New Friend request record on Azure.  Store locally and create on Azure
    // ==========================================
    //1. enter parent email and lookup to verify
    //2. enter the kids display name and lookup to verify
    //3. default to the display of the kid whose context you're creating the invitation in
    //4. create new invitation record with the 4 corresponding IDs
    // INVITATION RECORD: from_parent_id, from_kid_id, to_parent_id, to_kid_id, status, datetime

    var ToParentID, ToKidName;

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
            };
        }).catch(function (error) {
            console.log(error)
            alert(error);
        })
    };

    // Verify Kid
    // ------------
    $scope.verifyKid = function (name) {
        azureQueryKid(name)
        $scope.verifyKidError = false;
    };
    function azureQueryKid(name) {
        var query = "$filter=name eq '" + name + "'";
        Azureservice.read('kid', query).then(function (items) {  // query to see if this 'name' exists
            if (items.length == 0) { // if email not found, then
                // 'verifyKidError' is a flag the UI uses to check for 'show/hide' error div
                $scope.verifyKidError = true;
                $scope.verifyKidErrorMessage = '"' + name + '" is not a valid user.  Please check and try again.'
                console.log('kid name not found')
            }
            else { // if kid name found, show verify success and addNewInvitation button
                $scope.verifyKidSuccess = true;
                ToKidName = name; // Get the GUID for the parent
            };
        }).catch(function (error) {
            console.log(error);
            alert(error);
        })
    };


    $scope.addNewInvitation = function () {
        $scope.verifyKidSuccess = false; //toggle to turn off the UI modal (could be in html also)

        // Create on Azure
        // ---------------
        Azureservice.insert('invitations', {
            id: globalService.makeUniqueID(), // made GUID for Azure table        
            fromparent_id: globalService.userarray[0],
            toparent_id: ToParentID,
            fromkid: "name",
            tokid: ToKidName,
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



    // View changer.  Have to use $scope. to make available to the view
    // --------------
    $scope.gotoView = function () {
        globalService.changeView('/');
    };





}); //controller end