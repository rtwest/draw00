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

    // ==========================================  WORKING HERE ===================================
    alert(localStorage.getItem('RYB_clientarray'));

    if (localStorage.getItem('RYB_clientarray')) { // check for some clients

        $scope.clientarray = JSON.parse(localStorage.getItem('RYB_clientarray')); // get array from localstorage key pair and string
        alert($scope.clientarray)
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
        var clientitemarray = new Array();
        clientitemarray[0] = guid;
        clientitemarray[1] = name;
        localStorage["RYB_clientarray"] = localStorage.getItem('RYB_clientarray') + JSON.stringify(clientitemarray); //append to localstorage arraystring


        // Create on Azure
        // ---------------
        Azureservice.insert('kid', {
            id: guid, // made GUID for Azure table        
            name: name,
            parent_id: userarray[0],  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  ERROR looks like the FB guid, not my Azure guid %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
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
        alert('selected item ' + $scope.clientId);
    };
    // ==========================================




    // View changer.  Have to use $scope. to make available to the view
    // --------------
    $scope.gotoView = function () {
        globalService.changeView('/');
    };

}); //controller end