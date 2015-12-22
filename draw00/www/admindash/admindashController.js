// admindashController

// - load the client array.  CRUD operations here are pushed to web, so the local store is alway most current
// - check web for 





cordovaNG.controller('admindashController', function ($scope, globalService, Azureservice) {
    // Scope is like the view datamodel.  'message' is defined in the paritial view html {{message}}
    //$scope.message = "Nothing here yet";  //- TEST ONLY

    $scope.showaddclientui = false; // boolean for ng-show for add client modal

    // @@@@@@@@@@@@  Need to add it to global scope. Don't need this here if you already got it from the signin screen.  
    var userarray = JSON.parse(localStorage.getItem('RYB_userarray')); // get user array from localstorage key pair and string.  
    alert(userarray);

    $scope.clientarray = []; //create as an array

    // alert(localStorage.getItem('RYB_clientarray'));  // the returned string is not a usable array.  Needs Json.Parse for that.
    // Check for some clients
    // ---------------------
    if (localStorage.getItem('RYB_clientarray')) { 
        $scope.clientarray = JSON.parse(localStorage.getItem('RYB_clientarray')); // get array from localstorage key pair and string
        alert("array length: " + $scope.clientarray.length + " - " + $scope.clientarray)
    }
    else { // if no clients
        // @@@@@@@@@@@@@@ Add special message for this case  @@@@@@@@@@@@@@
        alert('no clients found')
    };


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
            localStorage["RYB_clientarray"] = JSON.stringify($scope.clientarray);
        }
        else{ // it doesn't already exist and this is the first one
            $scope.clientarray[0] = clientitemarray; //add first item to localstorage arraystring
            localStorage["RYB_clientarray"] = JSON.stringify($scope.clientarray);
        };
        $scope.clientarray = JSON.parse(localStorage.getItem('RYB_clientarray')); // get updated array from localstorage key pair and string
        //alert("array length = "+ $scope.clientarray.length + " - " + $scope.clientarray)

        // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@2@@@ ADD CONFIRMATION MESSAGE              

        // Create on Azure
        // ---------------
        Azureservice.insert('kid', {
            id: guid, // made GUID for Azure table        
            name: name,
            parent_id: userarray[0],  
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
    // Click on Client
    // ==========================================

    // Ng-repeat used to list DOM elements with DB table rowid loaded into elementID so its captured on the target.id
    // Need this to retreive GUID in Div ID property for record CRUD
    // ------------------------------------------
    $scope.clientclick = function (clickEvent) {
        $scope.clickEvent = globalService.simpleKeys(clickEvent);
        $scope.clientId = clickEvent.target.id;
        alert(clickEvent.target.id);
        alert('selected item = ' + $scope.clientId);
    };
    // ==========================================




    // View changer.  Have to use $scope. to make available to the view
    // --------------
    $scope.gotoView = function () {
        globalService.changeView('/');
    };

}); //controller end