// galleryController

cordovaNG.controller('galleryController', function ($scope, globalService) {

    // Scope is like the view datamodel.  'gallerymessage' is defined in the paritial view
    //$scope.gallerymessage = "Nothing here yet";  //- TEST ONLY

    //// ================================================
    //// Get all records (called 'docs' in PouchDB) from local storage (websql or indexeded)
    //// ================================================
    // include_docs:true is need to get the whole record
    globalService.drawappDatabase.allDocs({include_docs: true}).then(function (result) {
        // --- Split the JSON collection into an Array of JSON
        // Each PouchDB row has a .doc object.  To split into array of just these rows, map the array to contain just the .doc objects.
        records = result.rows.map(function (row) { // this iterates through the JSON
            //row.doc.Date = new Date(row.doc.Date);  // you can change data on the way as you iterate through
            return row.doc;  // return just the 'doc' parts in the JSON
        });
        $scope.galleryItems = records; // Put the array of records into this view's scope
        $scope.$apply(); // @@@ CRITICAL: To get view to update after $scope datamodel has updated -- but no UI action triggered it, use .$apply() @@@
        // ---
    }).catch(function (err) {
        console.log(err);
        alert(err)
    });
    //// ================================================
    //// ================================================



    // View changer.  Have to use $scope. to make available to the view
    // --------------
    $scope.gotoCanvas = function () {
        globalService.changeView('/');
    };


    // Method for getting the image UID in indexedDB from the DOM attributes
    // ----------------
    $scope.galleryImageClick = function (clickEvent) {
        $scope.clickEvent = globalService.simpleKeys(clickEvent);
        $scope.imageUID = clickEvent.target.id; // DOM attribute

        $scope.gallerymessage = $scope.imageUID; // FOR TESTTING
    };

}); //controller end