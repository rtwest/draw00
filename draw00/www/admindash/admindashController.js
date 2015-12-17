// admindashController

cordovaNG.controller('admindashController', function ($scope, globalService, Azureservice) {

    // Scope is like the view datamodel.  'message' is defined in the paritial view html {{message}}
    //$scope.message = "Nothing here yet";  //- TEST ONLY

    var userarray = JSON.parse(localStorage.getItem('RYB_userarray')); // get array from localstorage key pair and string
    var clientarray = JSON.parse(localStorage.getItem('RYB_clientarray')); // get array from localstorage key pair and string

    function makeRegistrationCode(){        
        var text = "";        
        //var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";        
        var possible = "abcdefghijklmnopqrstuvwxyz";        
        for( var i=0; i < 6; i++ )            
            text += possible.charAt(Math.floor(Math.random() * possible.length));        
        return text;    
    }


    function addKid(name){
        Azureservice.insert('kid', {
            id: globalService.makeUniqueID(), // made GUID for Azure table        
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
    }


    // View changer.  Have to use $scope. to make available to the view
    // --------------
    $scope.gotoView = function () {
        globalService.changeView('/');
    };

}); //controller end