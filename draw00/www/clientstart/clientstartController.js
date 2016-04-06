// clientstartController

cordovaNG.controller('clientstartController', function ($scope, globalService, Azureservice) {

    // Scope is like the view datamodel.  'message' is defined in the paritial view html {{message}}
    //$scope.message = "Nothing here yet";  //- TEST ONLY


    // FOR TESTING HERE ONLY
    // FOR TESTING HERE ONLY
    // FOR TESTING HERE ONLY
    // FOR TESTING HERE ONLY
    // ==========================================
    //  Insert an Friend in the Event log based on Client GUID
    // ==========================================

    //var kid2_id = globalService.makeUniqueID();
    //var kid3_id = globalService.makeUniqueID();
    //var kid2_name = "Leo"
    //var kid3_name = "Piper"
    //var kid1_id = 'fa530f03-c3dc-4c10-9c0f-ce0ec2a5ff5e';
    //var kid1_name = 'Jason'

    //Azureservice.insert('kid', {
    //    id: kid2_id,
    //    name: kid2_name,
    //    parent_id: 'abe24128-e508-4d04-a450-10f33d5a07a5',
    //    registration_code: 'TEST',
    //    reg_status: "1",
    //    avatar_id: "1",
    //    parent_name: "test",
    //    parent_email: "test",
    //})
    //.then(function () {
    //    console.log('Insert successful');
    //}, function (err) {
    //    console.log('Azure Error: ' + err);
    //});
    //Azureservice.insert('kid', {
    //    id: kid3_id,
    //    name: kid3_name,
    //    parent_id: 'abe24128-e508-4d04-a450-10f33d5a07a5',
    //    registration_code: 'TEST',
    //    reg_status: "1",
    //    avatar_id: "1",
    //    parent_name: "test",
    //    parent_email: "test",
    //})
    //.then(function () {
    //    console.log('Insert successful');
    //}, function (err) {
    //    console.log('Azure Error: ' + err);
    //});



    //Azureservice.insert('friends', {
    //    //id: globalService.makeUniqueID(), // i don't need to track this so let Azure handle it
    //    kid1_id: kid1_id,
    //    kid1_name: kid1_name,
    //    kid2_id: kid2_id,
    //    kid2_name: kid2_name,
    //})
    //.then(function () {
    //    console.log('Insert successful');
    //}, function (err) {
    //    console.log('Azure Error: ' + err);
    //});

    //Azureservice.insert('friends', {
    //    //id: globalService.makeUniqueID(), // i don't need to track this so let Azure handle it
    //    kid1_id: kid1_id,
    //    kid1_name: kid1_name,
    //    kid2_id: kid3_id,
    //    kid2_name: kid3_name,
    //})
    //.then(function () {
    //    console.log('Insert successful');
    //}, function (err) {
    //    console.log('Azure Error: ' + err);
    //});

    //Azureservice.insert('events', {
    //    fromkid_id: '7adfe169-3113-4b51-95ad-6e3c48e0a14e',
    //    tokid_id: 'fa530f03-c3dc-4c10-9c0f-ce0ec2a5ff5e',
    //    fromkid_name: 'Piper',
    //    tokid_name: 'Jason',
    //    event_type: 'like',
    //    picture_url: 'https://rtwdevstorage.blob.core.windows.net/imagecontainer/aeb62c31-a951-4b04-bfe7-e7d9d939f0f8.png',
    //    fromkid_avatar: 1,
    //    tokid_avatar: 2,
    //    datetime: Date.now(),
    //    comment_content:'',
    //})
    //.then(function () {
    //    console.log('Insert successful');
    //}, function (err) {
    //    console.log('Azure Error: ' + err);
    //});

    //Azureservice.insert('events', {
    //    //id: globalService.makeUniqueID(), // i don't need to track this so let Azure handle it
    //    picture_url: 'https://rtwdevstorage.blob.core.windows.net/imagecontainer/aeb62c31-a951-4b04-bfe7-e7d9d939f0f8.png',
    //    fromkid_id: '7adfe169-3113-4b51-95ad-6e3c48e0a14e',
    //    fromkid_name: 'Piper',
    //    event_type: "sharepicture", // 
    //    tokid_id: 'fa530f03-c3dc-4c10-9c0f-ce0ec2a5ff5e',
    //    tokid_name: 'Jason',
    //    fromkid_avatar: 1,
    //    tokid_avatar: 2,
    //    //comment_content: 'this is a comment here',
    //    datetime: Date.now(),
    //})
    //.then(function () {
    //    console.log('Insert successful');
    //}, function (err) {
    //    console.log('Azure Error: ' + err);
    //});

    // ==========================================











    var tempArray = [];

    // ==========================================
    //  Get local user name, guid, and avatar
    // ==========================================

    var clientGUID = globalService.userarray[0];
    $scope.avatarID = globalService.userarray[3];
    $scope.clientName = globalService.userarray[4];

    // ==========================================

    // Set the local data model here to the data in the global service between views
    $scope.eventarray = globalService.eventArray;
    $scope.friendArray = globalService.friendArray;
    //alert(globalService.lastTimeChecked);

    if (globalService.lastTimeChecked < (Date.now() - 300000)) { // if last data pull was over 5 MIN ago, then check again
        getEventLog();
        getFriendsArray();
        globalService.lastTimeChecked = Date.now();
    };


    // ==========================================
    //  Get friends from Azure based on Client GUID.  THIS CODE USED ON CLIENTPROPERTIESCONTROLLER.JS and CLIENTSTARTCONTROLLER.JS
    // ==========================================
    var len, j;

    function getFriendsArray() {

        Azureservice.read('friends', "filter=kid1_id eq '" + clientGUID + "' or kid2_id eq '" + clientGUID + "'")
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
                    len = items.length;
                    for (i = 0; i < len; i++) {
                        if (items[i].kid1_id == clientGUID) {  // If the first kid is this client, using the 2nd
                            var element = {  // make a new array element
                                client_id: clientGUID,
                                record_id: items[i].id,
                                friend_id: items[i].kid2_id,
                                friend_name: items[i].kid2_name,
                                friend_avatar: ' ', //empty placeholder
                                //friend_parentname: ' ',
                                //friend_parentemail: ' ',
                            };
                            tempArray.push(element); // add back to array
                        }
                        else { // else use the first kid
                            var element = {  // make a new array element
                                client_id: clientGUID,
                                record_id: items[i].id,
                                friend_id: items[i].kid1_id,
                                friend_name: items[i].kid1_name,
                                friend_avatar: ' ', //empty placeholder
                                //friend_parentname: ' ',
                                //friend_parentemail: ' ',
                            };
                            tempArray.push(element); // add back to array
                        };
                    };//end for

                    // Different way of setting up the loop 
                    j = 0;
                    len = tempArray.length;
                    //alert(len);
                    getkiddetails(); // @@@ Call recursive Azure call

                };
            }).catch(function (error) {
                console.log(error); alert(error);
            });

    };//end function

    // RECURSIVELY Go through Friend array and get addtional info Kid table in Azure 
    // !!!!! LOTS OF CALL TO AZURE NOW  // !!!!! BETTER TO HAVE A CUSTOM API IN NODE TO DO THIS JOINING
    // --------------------------------------
    function getkiddetails() {
        //alert(j); alert(len);

        if (j < tempArray.length) { // Don't know why this is going over the array size but this is a hack to fix

            Azureservice.getById('kid', tempArray[j].friend_id)
            .then(function (item) {

                // TRYING TO TAKE IT OUT OF THE OTHER AZURE CALL
                // -----
                tempArray[j].friend_avatar = item.avatar_id;
                //tempArray[j].friend_parentname = item.parent_name;
                //tempArray[j].friend_parentemail = item.parent_email;

                globalService.friendArray = tempArray;
                $scope.friendArray = globalService.friendArray; // @@@ Set to $scope array

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
    //  Get the Event log based on Client GUID.   THIS CODE USED ON CLIENTPROPERTIESCONTROLLER.JS and CLIENTSTARTCONTROLLER.JS
    // ==========================================

    function getEventLog() {

        // Before getting the event log from Azure, take Imagepropertiesarray and make a new local array of ['ImageID; UserID',] so its easy to check against
        // ---------------
        var likesArrayFlattened = [];
        var imagepropertiesarray = [];
        imagepropertiesarray = JSON.parse(localStorage.getItem('RYB_imagepropertiesarray')); // get array from localstorage key pair and string
        for (x = 0; x < imagepropertiesarray.length; x++) { // Loop through to array for ImageID
            for (y = 0; y < imagepropertiesarray[x].commentarray.length; y++) {  // Loop through subarray for comments
                var el = imagepropertiesarray[x].id + imagepropertiesarray[x].commentarray[y].kid_id;
                likesArrayFlattened.push(el);
            };
        }; //end for
        alert("likes array is = " + likesArrayFlattened);

        //  XXXXX REMOVING POUCHDB
        ////globalService.drawappDatabase.allDocs({ include_docs: true }).then(function (result) {
        ////    // --- Split the JSON collection into an Array of JSON
        ////    // Each PouchDB row has a .doc object.  To split into array of just these rows, map the array to contain just the .doc objects.
        ////    records = result.rows.map(function (row) { // this iterates through the JSON
        ////        //row.doc.Date = new Date(row.doc.Date);  // you can change data on the way as you iterate through
        ////        //return row.doc;  // return just the 'doc' parts in the JSON
        ////        var el = {ImageID:row.doc._id, CommentArr:row.doc.commentarray}; // Get just the ImageID and Likes subarray
        ////        likesArray.push(el); // put string into array
        ////    });
        ////    //alert(JSON.stringify(likesArray));
        ////    // Take likesArray and iterate through CommentArr to flatten this out
        ////    // ---------------
        ////    for (x = 0; x < likesArray.length; x++) {
        ////        for (y = 0; y < likesArray[x].CommentArr.length; j++) {
        ////            var el = likesArray[x].ImageID + likesArray[x].CommentArr[y].kid_id;
        ////            likesArrayFlattened.push(el);
        ////        };
        ////    }; //end for
        ////    alert(likesArrayFlattened);
        ////}).catch(function (err) {
        ////    console.log(err); //alert(err);
        ////});



        var tempArray = []; // This resets the local array (which $scope is set to later)
        // Read Event Log from Azure
        // ------------------------
        Azureservice.read('events', "filter=from_kid_id eq '" + clientGUID + "' or to_kid_id eq '" + clientGUID + "'")
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
                  var day, time, fromkid, tokid, lastimageurl, lasteventtype;
                  thiseventday = new Date();
                  lasteventday = new Date();
                  montharray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

                  items = items.reverse()  // @@@ This puts them in newest first order. 

                  for (i = 0; i < len; i++) {

                      lasteventday = thiseventday; // when i=0, this is useless and skipped over with coniditional below
                      thiseventday = new Date(items[i].datetime); // convert datetime to number


                      // @@@ Check for Like Events for this Client and put into ImagePropertiesArray
                      // ---------------------
                      if ((items[i].tokid_id == clientGUID) && (items[i].event_type == 'like')) {

                          // Get Image ID from Picture URL.  It's the last part.
                          var imageID = items[i].picture_url.replace('https://rtwdevstorage.blob.core.windows.net/imagecontainer/',''); 
                          imageID = imageID.replace('.png', ''); // Cut off the .png at the end

                          // Check to see if this Like (ImageID, UserID) is in the quick check array.  IF NOT, then add to PouchDB
                          // ------------------
                          //alert(imageID + items[i].fromkid_id)
                          //alert(likesArrayFlattened.indexOf(imageID + items[i].fromkid_id))
                          if (likesArrayFlattened.indexOf(imageID + items[i].fromkid_id) == -1) {  // Not found in array
                              alert("adding new like");
                          
                              // Make new JSON element with the Like event details
                              var event = items[i].event_type;
                              var name = items[i].fromkid_name;
                              var avatar = items[i].fromkid_avatar;
                              var kid_id = items[i].fromkid_id;
                              var comment_element = { event_type: event, name: name, avatar: avatar, kid_id: kid_id }; // New object

                              // Update 'RYB_imagepropertiesarray' in LocalStorage
                              var imagepropertiesarray = [];
                              imagepropertiesarray = JSON.parse(localStorage.getItem('RYB_imagepropertiesarray')); // get array from localstorage key pair and string
                              for (x = 0; x < imagepropertiesarray.length; x++) { // Loop through to array for ImageID
                                  if (imagepropertiesarray[x].id == imageID) {
                                      imagepropertiesarray[x].commentarray.push(comment_element);
                                  };
                              }; //end for
                              localStorage["RYB_imagepropertiesarray"] = JSON.stringify(imagepropertiesarray); //push back to localStorage
                              alert("update image array with like comment" + JSON.stringify(imagepropertiesarray))

                              // XXXXX REMOVED POUCHBD
                              //// Update the record/doc using PouchDB
                              //globalService.drawappDatabase.upsert(imageID, function (doc) {
                              //    // Have to do this extra step for pushing into array
                              //    var tempobject = new Object();
                              //    tempobject = doc.commentarray; //alert(doc.commentarray);
                              //    tempobject.push(comment_element); //alert(tempobject);
                              //    // The actual update part 
                              //    doc.commentarray = tempobject;
                              //    return doc;
                              //}).then(function (response) {
                              //    console.log(response); //alert(JSON.stringify(response));
                              //}).catch(function (err) {
                              //    console.log(err); //alert(JSON.stringify(err));
                              //});

                          };
                          // ------------------


                       };




                      // @@@ Get Day - Compare Day and Month
                      // ---------------------
                      if (i > 0) { // If this is NOT first in array, check if you need to show it.
                          if ((thiseventday.getDate() == lasteventday.getDate()) && (thiseventday.getMonth() == lasteventday.getMonth())) {
                              day = null; // then it's the same as the last one and don't need to repeat the date
                          }
                              // may never have this case?
                          else if ((thiseventday.getDate() == today.getDate()) && (thiseventday.getMonth() == today.getMonth())) {
                              day = 'Today';}
                              // If Day is Today-1, Then its Yesterday
                          else if ((thiseventday.getDate() == (today.getDate() - 1)) && (thiseventday.getMonth() == today.getMonth())) {
                              day = 'Yesterday';}
                          else { day = montharray[thiseventday.getMonth()] + " " + thiseventday.getDate(); }
                      }
                      else { // If this IS first in array, then it has to have the date header
                          if ((thiseventday.getDate() == today.getDate()) && (thiseventday.getMonth() == today.getMonth())) {
                              day = 'Today';}
                              // If Day is Today-1, Then its Yesterday
                          else if ((thiseventday.getDate() == (today.getDate() - 1)) && (thiseventday.getMonth() == today.getMonth())) {
                              day = 'Yesterday';}
                          else { day = montharray[thiseventday.getMonth()] + " " + thiseventday.getDate(); }
                      }

                      // Get time 
                      // --------
                      var t = thiseventday.getHours();  //+1 to make up for 0 base
                      if (t > 12) {
                          time = Math.abs(12 - t) + ":" + thiseventday.getMinutes() + "pm";  // break down the 24h and use Am/pm
                      }
                      else {
                          time = t + ":" + thiseventday.getMinutes() + "am";  // break down the 24h and use Am/pm
                      }


                      // @@@ Checking for Image Share to multiple people to collapse as 1 event not several
                      // =========================
                      var timetest = lasteventday;
                      timetest.setSeconds(timetest.getSeconds() + 10); // last event time + 10 sec
                      // IF this imageURL is the same image URL as last one in the array
                      //    AND IF this event time is within 10 sec of last one
                      //    AND IF from the client
                      //    AND IF a ShareEvent
                      //    AND IF last event also a ShareEvent

                      // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ WORKING HERE : THIS IS GETTING PUSHED INTO THE LAST LIKE EVENT @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

                      if ((lastimageurl == items[i].picture_url) && (thiseventday < timetest) && (items[i].fromkid_id == clientGUID) && (items[i].event_type == 'sharepicture') && (lasteventtype == 'sharepicture')) {
                          // If this is same share event, modify LAST event arry item, DO NOT insert another
                          // --------------
                          var nameelement = { kidname: items[i].tokid_name };  // for JSON, have to make a new object
                          var avatarelement = { kidavatar: items[i].tokid_avatar };  // for JSON, have to make a new object
                          tempArray[tempArray.length - 1].tokid.push(nameelement); // push the subobject into the right place
                          tempArray[tempArray.length - 1].tokidavatar.push(avatarelement); // push the subobject into the right place
                      }
                      else { // IF NOT a repeated share item, make a new event item

                          // @@@ Small check to personalize the event details if it is YOU
                          // ------------------
                          var from_check;
                          if (items[i].fromkid_id == clientGUID) {
                              from_check = "You";
                          }
                          else { from_check = items[i].fromkid_name };

                          // @@@@@ Make array object for UI @@@@@
                          // ==============================
                          var element = {  // make a new array object.  If items[i] is NULL, the HTML binding for ng-show will hide the HTML templating
                              picture_url: items[i].picture_url,
                              fromkid: from_check,
                              fromkidavatar: items[i].fromkid_avatar,
                              fromkid_id: items[i].fromkid_id,
                              tokid: [{ // this is a notation for a nested object.  If someone sent to YOU, this has just your name in it
                                  kidname: items[i].tokid_name,
                                }],
                              tokidavatar: [{ // this is a notation for a nested object
                                  kidavatar: items[i].tokid_avatar,
                                }],
                              event_type: items[i].event_type,
                              comment_content: items[i].comment_content,
                              day: day,
                              time: time,
                          };

                          tempArray.push(element); // add back to array
    
                      }; // end make event array item
                      // =========================

                      lastimageurl = items[i].picture_url;
                      lasteventtype = items[i].event_type;

                  }; // ------ end for

                  globalService.eventArray = tempArray;
                  $scope.eventarray = globalService.eventArray;
                  alert("Event array - "+JSON.stringify($scope.eventarray))

              }; // end if


          }).catch(function (error) {
              console.log(error)
          });


    }; //end function

    // ==========================================







    // View changer.  Have to use $scope. to make available to the view
    // --------------
    $scope.gotoCanvasView = function () {
        globalService.changeView('/canvas');
    };
    $scope.gotoGalleryView = function () {
        globalService.lastView = '/clientstart';  // for knowing where to go with the back button
        globalService.changeView('/gallery');
    };
    $scope.gotoPictureView = function (clickEvent) {
        $scope.clickEvent = globalService.simpleKeys(clickEvent);
        $scope.idParameters = clickEvent.target.id;  // div ID has 3 values shoved in it

        globalService.pictureViewParams = $scope.idParameters;  // pass the 3 values as a string and split at the next view
        globalService.lastView = '/clientstart';  // for knowing where to go with the back button
        globalService.changeView('/picture');

    };

}); //controller end