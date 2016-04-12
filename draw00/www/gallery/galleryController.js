// galleryController

cordovaNG.controller('galleryController', function ($scope, globalService, Azureservice) {

    // Scope is like the view datamodel.  'gallerymessage' is defined in the paritial view
    //$scope.gallerymessage = "Nothing here yet";  //- TEST ONLY

    $scope.kidavatar = globalService.userarray[3];
    $scope.kidname = globalService.userarray[4];



    // Get local storage for saved images filepath.  @@@@@@@ NEED TO ACCOUNT FOR WHEN AN IMAGE IS REMOVED FROM PHONE GALLERY (TRY/CATCH)
    if (localStorage.getItem('RYB_imagepropertiesarray')) {
        var imagepropertiesarray = JSON.parse(localStorage.getItem('RYB_imagepropertiesarray')); // get array from localstorage key pair and string
        $scope.galleryItems = imagepropertiesarray; // Put the array of records into this view's scope
        alert(JSON.stringify($scope.galleryItems));
    };
    // XXXXXXXXXXXXXXXXXXXXXXX REPLACING POUCHDB
    //// ================================================
    //// Get all records (called 'docs' in PouchDB) from local storage (websql or indexeded)
    //// ================================================
    //// include_docs:true is need to get the whole record
    //globalService.drawappDatabase.allDocs({include_docs: true}).then(function (result) {
    //    // --- Split the JSON collection into an Array of JSON
    //    // Each PouchDB row has a .doc object.  To split into array of just these rows, map the array to contain just the .doc objects.
    //    records = result.rows.map(function (row) { // this iterates through the JSON
    //        //row.doc.Date = new Date(row.doc.Date);  // you can change data on the way as you iterate through
    //        return row.doc;  // return just the 'doc' parts in the JSON
    //    });
    //    $scope.galleryItems = records; // Put the array of records into this view's scope
    //    alert(JSON.stringify($scope.galleryItems));
    //    $scope.$apply(); // @@@ CRITICAL: To get view to update after $scope datamodel has updated -- but no UI action triggered it, use .$apply() @@@
    //    // ---
    //}).catch(function (err) {
    //    console.log(err); //alert(err);
    //});
    //// ================================================
    //// ================================================






    // View changer.  Have to use $scope. to make available to the view
    // --------------
    $scope.goBack = function () {
        globalService.changeView(globalService.lastView); // go back to Previous view
    };


    // Method for getting the UID in PouchDB from the DOM attributes
    // ----------------
    $scope.galleryImageClick = function (clickEvent) {
        $scope.clickEvent = globalService.simpleKeys(clickEvent);
        $scope.image_ID_Src = clickEvent.target.id; // DOM attribute

        //alert($scope.image_ID_Src);  
        globalService.pictureViewParams = $scope.image_ID_Src; // put in global var to pass to the next view.  Should have Image ID and Image filepath data
        globalService.changeView('/gallerypicture'); // Go to gallerypicture view
    };

}); //controller end