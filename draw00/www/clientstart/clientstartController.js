﻿// clientstartController

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
    //    fromkid_id: '9f0ed518-f388-4519-a2e5-6c0dc01308a4',
    //    tokid_id: 'fa530f03-c3dc-4c10-9c0f-ce0ec2a5ff5e',
    //    fromkid_name: 'Leo',
    //    tokid_name: 'Jason',
    //    event_type: 'like',
    //    picture_url: 'https://rtwdevstorage.blob.core.windows.net/imagecontainer/162460e7-7e67-4df7-a947-91b947b63e7d.png',
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
    //    fromkid_id: '9f0ed518-f388-4519-a2e5-6c0dc01308a4',
    //    tokid_id: 'fa530f03-c3dc-4c10-9c0f-ce0ec2a5ff5e',
    //    fromkid_name: 'Leo',
    //    tokid_name: 'Jason',
    //    event_type: 'like',
    //    picture_url: 'https://rtwdevstorage.blob.core.windows.net/imagecontainer/162460e7-7e67-4df7-a947-91b947b63e7d.png',
    //    fromkid_avatar: 1,
    //    tokid_avatar: 2,
    //    datetime: Date.now(),
    //    comment_content: '',
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

                    alert(JSON.stringify(items));

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
                //$scope.friendArray = tempArray; 

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

        var tempArray = []; // This resets the local array (which $scope is set to later)

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
                  var day, time, fromkid, tokid, lastimageurl;
                  thiseventday = new Date();
                  lasteventday = new Date();
                  montharray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

                  items = items.reverse()  // @@@ This puts them in newest first order. 

                  for (i = 0; i < len; i++) {

                      lasteventday = thiseventday; // when i=0, this is useless and skipped over with coniditional below
                      thiseventday = new Date(items[i].datetime); // convert datetime to number

                      // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  WORKING HERE @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                      // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  WORKING HERE @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

                      // @@@ Check for Like Events for this Client
                      // ---------------------
                      if ((items[i].tokid_id == clientGUID) && (items[i].event_type == 'like')) {

                          // Get Image ID from Picture URL.  It's the last part.
                          var imageID = items[i].picture_url.replace('https://rtwdevstorage.blob.core.windows.net/imagecontainer/',''); 
                          imageID = imageID.replace('.png', ''); // Cut off the .png at the end

                          // Look up in PouchDB
                          globalService.drawappDatabase.get(imageID).then(function (Found_Record) { // imageID is the index ID

                              alert("found in PouchDB - " + JSON.stringify(Found_Record))

                              // Add FromKid_name & FromKid_avatar to record/doc
                              var event = items[i].event_type;
                              var name = items[i].fromkid_name;
                              var avatar = items[i].fromkid_avatar;
                              var comment_element = { event_type: event, name: name, avatar: avatar };
                              Found_Record.commentarray.push(comment_element);
                              alert("2 found in PouchDB - " + JSON.stringify(Found_Record))

                              // Update PouchDB. Use .put for update or add new
                              globalService.drawappDatabase.put(Found_Record, function (error, response) { //record, onDBsuccess, onDBerror
                                  if (error) {
                                      console.log(error);
                                      return;
                                  } else if (response && response.ok) {
                                      // On successful update to PouchDB
                                      alert("Updated")
                                      console.log(response)
                                  }
                              });

                          });
                      };
                      // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  WORKING HERE @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                      // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  WORKING HERE @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@




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
                      if ((lastimageurl == items[i].picture_url) && (thiseventday < timetest)) {
                          // If this is same share event, modify LAST event arry item, DO NOT insert another
                          // --------------
                          var nameelement = { kidname: items[i].tokid_name };  // for JSON, have to make a new object
                          var avatarelement = { kidname: items[i].tokid_name };  // for JSON, have to make a new object
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

                  }; // ------ end for

                  globalService.eventArray = tempArray;
                  $scope.eventarray = globalService.eventArray;
                  //alert("Event array - "+JSON.stringify($scope.eventarray))

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