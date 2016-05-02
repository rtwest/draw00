// clientpropertiesController

cordovaNG.controller('clientpropertiesController', function ($scope, globalService, Azureservice) {

    // Scope is like the view datamodel.  'message' is defined in the paritial view html {{message}}
    //$scope.message = "Nothing here yet";  //- TEST ONLY

    $scope.noFriendsFlag = false; // boolean for ng-show for 'no friends' message
    $scope.noEventsFlag = false;  


    // =======================================================
    // From the Client GUID, get the rest of Client Properties
    // =======================================================
    var selectedclientguid = globalService.selectedClient;
    var client = [];
    var clientarray = [];
    clientarray = JSON.parse(localStorage.getItem('RYB_clientarray')); // get array from localstorage key pair and string
    // Search through array of arrays
    // ----
    var foundIndex = '';
    var clientarraylength = clientarray.length;
    for (i = 0; i < clientarraylength; i++) {
        if (clientarray[i].indexOf(selectedclientguid) > -1) { // If GUID found in this subarray 
            foundIndex = i;
            client = clientarray[i];
            break;
        };
    };
    $scope.clientName = client[1];
    $scope.avatarID = client[2];
    $scope.registrationCode = client[3];
    // =======================================================


    // Click on picture image for full picture view in modal (LATER FEATURE)


    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    // HOW TO AVOID UNCESSARY REPEAT AZURE CALL?  
    // --- Need persistent store.  Need LastTimeChecked var
    // --- set a scope var for last check time > 30min?
    // --- have a localStorage array for lastClientChecks?
    // --- use sessionStorage just for this session?
    // --- @@@@@ test how long a scope var is good for?
    // DIFFERENT CLIENTS TOO?
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@



    // Set the local data model here to the data in the global service between views
    // -------
    //$scope.eventarray = globalService.eventArray;

    // if last data pull was over 5 MIN ago, then check again
    // -------
    //if (globalService.lastTimeChecked < (Date.now() - 300000)) { 
    //    getEventLog();
    //    globalService.lastTimeChecked = Date.now();
    //};




    // ==========================================
    //  Get the Event log based on Client GUID.   THIS CODE USED ON CLIENTPROPERTIESCONTROLLER.JS and CLIENTSTARTCONTROLLER.JS
    // ==========================================

    //function getEventLog() {

        alert(selectedclientguid)
        //alert('admin id is ' + globalService.userarray[0])

    //Azureservice.read('events', "$filter=from_kid_id eq '03537ad8-b55c-41c7-b122-8997ac7cdca4'")
    //Azureservice.query('events', {
    //    criteria: {
    //        from_kid_id: 'c9b8cb86-130c-4274-adf8-1931a9de18de',
    //    }
    //})
        Azureservice.read('events', "$filter=fromkid_id eq '" + selectedclientguid + "' or tokid_id eq '" + selectedclientguid + "'")
              .then(function (items) {

                  alert(JSON.stringify(items));

                  if (items.length == 0) { // if no Event record found, then
                      $scope.noEventsFlag = true;   // '...Flag' is a flag the UI uses to check for 'show/hide' msg div
                      console.log('no events in last 2 weeks')
                  }
                  else {
                      // Go through Friend items and reorder it 
                      // --------------------------------------
                      var tempArray = [];
                      var len = items.length;
                      alert(len)
                      var today = new Date(); // today for comparison
                      var day, time, fromkid, tokid, lastimageurl;
                      thiseventday = new Date();
                      lasteventday = new Date();
                      montharray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

                      //items = items.reverse()  // @@@ This puts them in newwest first order.  
                      alert(JSON.stringify(items))

                      for (i = 0; i < len; i++) {

                          lasteventday = thiseventday; // when i=0, this is useless and skipped over with coniditional below
                          thiseventday = new Date(items[i].datetime); // convert datetime to number

                          // @@@ Get Day - Compare Day and Month
                          // ---------------------
                          if (i > 0) { // If this is NOT first in array, check if you need to show it.
                              if ((thiseventday.getDate() == lasteventday.getDate()) && (thiseventday.getMonth() == lasteventday.getMonth())) {
                                  day = null; // then it's the same as the last one and don't need to repeat the date
                              }
                                  // may never have this case?
                              else if ((thiseventday.getDate() == today.getDate()) && (thiseventday.getMonth() == today.getMonth())) {
                                  day = 'Today';
                              }
                                  // If Day is Today-1, Then its Yesterday
                              else if ((thiseventday.getDate() == (today.getDate() - 1)) && (thiseventday.getMonth() == today.getMonth())) {
                                  day = 'Yesterday';
                              }
                              else { day = montharray[thiseventday.getMonth()] + " " + thiseventday.getDate(); }
                          }
                          else { // If this IS first in array, then it has to have the date header
                              if ((thiseventday.getDate() == today.getDate()) && (thiseventday.getMonth() == today.getMonth())) {
                                  day = 'Today';
                              }
                                  // If Day is Today-1, Then its Yesterday
                              else if ((thiseventday.getDate() == (today.getDate() - 1)) && (thiseventday.getMonth() == today.getMonth())) {
                                  day = 'Yesterday';
                              }
                              else { day = montharray[thiseventday.getMonth()] + " " + thiseventday.getDate(); }
                          }

                          // @@@ Get time 
                          // --------
                          var t = thiseventday.getHours();  //+1 to make up for 0 base
                          if (t > 12) {
                              time = Math.abs(12 - t) + ":" + thiseventday.getMinutes() + "pm";  // break down the 24h and use Am/pm
                          }
                          else {
                              time = t + ":" + thiseventday.getMinutes() + "am";  // break down the 24h and use Am/pm
                          }

                          // @@@ Small check to personalize the event details if it is YOU
                          // ------------------
                          var from_check;
                          if (items[i].fromkid_id == globalService.userarray[0]) {
                              from_check = "You";
                          }
                          else { from_check = items[i].fromkid_name };

                          //make a new array based on urls.  url is like object key index.  its all about the Image Url.
                          //then each event adds properties around that url Object

                          // Look at Image URL and see if it is in the tempArray.  If not, make new object.  If so, add to Object
                          var event_type = items[i].event_type;

                          // @@@ If a 'friend' event, it does not have a URL
                          // ---------------------------------
                          if (event_type == 'friends') {
                              //alert('found freind event')
                              var element = {  // @@@ Make a new array object.  If items[i] is NULL, the HTML binding for ng-show will hide the HTML templating
                                  //picture_url: items[i].picture_url,  // not relevant in this case
                                  fromkid: from_check,  // who shared it
                                  fromkidavatar: items[i].fromkid_avatar,
                                  fromkid_id: items[i].fromkid_id,
                                  tokid: [{ // this is a notation for a nested object.  If someone sent to YOU, this has just your name in it
                                      tokidname: items[i].tokid_name,  // each kids shared with
                                      tokid_id: items[i].tokid_id,
                                      tokidavatar: items[i].tokid_avatar,
                                      tokidreply: '',  // null in this case
                                  }],
                                  event_type: event_type, // 
                                  comment_content: items[i].comment_content,
                                  day: day,
                                  time: time,
                              };
                              tempArray.push(element); // add into array for UI & $scope
                          }

                          else { // If not a 'friend' event, it should have a URL
                              // ---------------------------------

                              // Get Image ID from Picture URL.  It's the last part.
                              var imageID = items[i].picture_url.replace('https://rtwdevstorage.blob.core.windows.net/imagecontainer/', '');
                              imageID = imageID.replace('.png', ''); // Cut off the .png at the end

                              var imageurlfound = false;
                              var tempArrayLength = tempArray.length;
                              for (x = 0; x < tempArrayLength; x++) { // Loop through to array for ImageID

                                  if (tempArray[x].picture_url == items[i].picture_url) {

                                      alert('found imageurl')
                                      // Inspect to know how to add to Object
                                      // ------------
                                      // cases: SharePicture - track this url.  Like Picture - append to tracked url.  

                                      // url, shared, to any kid
                                      if (event_type == 'sharepicture') {
                                          // Update object to add ToKid element
                                          // ------------
                                          var kidobject = {
                                              tokidname: items[i].tokid_name,
                                              tokidavatar: items[i].tokid_avatar,
                                              tokidreply: '', //null in this case
                                          };
                                          tempArray[x].tokid.push(kidobject);
                                          alert('new kid shared with - ' + JSON.stringify(tempArray[x]));
                                      }

                                          // url, liked, from any kid
                                      else if (event_type == 'like') {
                                          // Update your reply in the ToKid element
                                          // ------------
                                          //tempArray[x].tokid[items[i].tokid_id == clientGUID].tokidreply = items[i].comment_content
                                          var kidArrayLength = tempArray[x].tokid.length; // 'tokid' is a subarray
                                          for (y = 0; y < kidArrayLength; y++) { // Loop through to subarray for tokid_id
                                              if (tempArray[x].tokid[y].tokid_id == items[i].fromkid_id) {
                                                  tempArray[x].tokid[y].tokidreply = 'likes' //items[i].comment_content
                                                  alert('updated kid response - ' + JSON.stringify(tempArray[x]));
                                                  break;
                                              };
                                          }; // end for
                                      }
                                      else { alert('unknown case') };

                                      imageurlfound = true;
                                      break;
                                  } // end if URL found

                              }; //end for

                              if ((imageurlfound == false) && (event_type == 'sharepicture')) {  // New SharedUrl found 

                                  alert('found unknow imageurl and share event')

                                  // @@@@ Make new array object for UI 
                                  // ==============================
                                  var element = {  // @@@ Make a new array object.  If items[i] is NULL, the HTML binding for ng-show will hide the HTML templating
                                      picture_url: items[i].picture_url, // this object is all about what happens around this image url
                                      fromkid: from_check,  // who shared it
                                      fromkidavatar: items[i].fromkid_avatar,
                                      fromkid_id: items[i].fromkid_id,
                                      tokid: [{ // this is a notation for a nested object.  If someone sent to YOU, this has just your name in it
                                          //tokidname: items[i].tokid_name,  // each kids shared with
                                          tokidname: from_check,  // each kids shared with
                                          tokid_id: items[i].tokid_id,
                                          tokidavatar: items[i].tokid_avatar,
                                          tokidreply: "",  // null right now
                                      }],
                                      event_type: event_type, // 
                                      comment_content: items[i].comment_content,
                                      day: day,
                                      time: time,
                                  };
                                  tempArray.push(element); // add into array for UI & $scope
                                  alert('updated with new imageurl share event - ' + JSON.stringify(tempArray));
                              };

                          }; //end if event type




                      }; //end for

                      $scope.eventarray = tempArray.reverse();
                      alert(JSON.stringify($scope.eventarray))

                  }; // end if


              }).catch(function (error) {
                  console.log(error)
              });

    //}; // end func


    // ==========================================









    // ==========================================
    //  Get friends from Azure based on Client GUID.  THIS CODE USED ON CLIENTPROPERTIESCONTROLLER.JS and CLIENTSTARTCONTROLLER.JS
    // ==========================================
    function getfriends() {

    var friendsarraylen, j;
    var quickfriendarray = []; //this is for quickly looking up redundancies in friends list
    var tempArray = []; // This resets the local array (which $scope is set to later)       

    Azureservice.read('friends', "filter=kid1_id eq '" + selectedclientguid + "' or kid2_id eq '" + selectedclientguid + "'")
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
                var len = items.length;
                for (i = 0; i < len; i++) {
                    if (items[i].kid1_id == selectedclientguid) {  // If the first kid is this client, using the 2nd
                        // check to make sure this friend isn't alredy in the tempArray by checking the quickfriendarray
                        if (quickfriendarray.indexOf(items[i].kid2_id) == -1) {
                            var element = {  // make a new array element
                                client_id: selectedclientguid,
                                record_id:items[i].id,
                                friend_id: items[i].kid2_id,
                                friend_name: items[i].kid2_name,
                                friend_avatar: ' ', //empty placeholder
                                friend_parentname: ' ',
                                friend_parentemail:' ',
                            };
                            tempArray.push(element); // add back to array
                            quickfriendarray.push(items[i].kid2_id)//add to quickfriendarray
                        };
                    }
                    else { // else use the first kid
                        // check to make sure this friend isn't alredy in the tempArray by checking the quickfriendarray
                        if (quickfriendarray.indexOf(items[i].kid1_id) == -1) {
                            var element = {  // make a new array element
                                client_id: selectedclientguid,
                                record_id: items[i].id,
                                friend_id: items[i].kid1_id,
                                friend_name: items[i].kid1_name,
                                friend_avatar: ' ', //empty placeholder
                                friend_parentname: ' ',
                                friend_parentemail: ' ',
                            };
                            tempArray.push(element); // add back to array
                            quickfriendarray.push(items[i].kid1_id)//add to quickfriendarray
                        };
                    };
                };//end for

                // Different way of setting up the loop to get kid details
                j = 0;
                friendsarraylen = tempArray.length;
                getkiddetails(); // @@@ Call recursive Azure call

            };
        }).catch(function (error) {
            console.log(error); alert(error);
        });
    // RECURSIVELY Go through Friend array and get addtional info Kid table in Azure 
    // !!!!! LOTS OF CALL TO AZURE NOW  // !!!!! BETTER TO HAVE A CUSTOM API IN NODE TO DO THIS JOINING
    // --------------------------------------
    function getkiddetails() {

        if (j < friendsarraylen) { // Don't know why this is going over the array size but this is a hack to fix
            if (tempArray[j].friend_id != globalService.userarray[0]) { //if not the Admin/parent GUID

                Azureservice.getById('kid', tempArray[j].friend_id)
                .then(function (item) {
                    // TRYING TO TAKE IT OUT OF THE OTHER AZURE CALL
                    // -----
                    tempArray[j].friend_avatar = item.avatar_id;
                    tempArray[j].friend_parentname = item.parent_name;
                    tempArray[j].friend_parentemail = item.parent_email;
                    $scope.friendArray = tempArray; // @@@ Set to $scope array;
                    // RECUSIVE PART.  Regular FOR loop didn't work.
                    j++;
                    if (j < friendsarraylen) {
                        getkiddetails();
                    };
                }, function (err) {
                    console.error('Azure Error: ' + err);
                });
            }
            else { //else if it is the parent ID, just recurse 
                tempArray[j].friend_name = "You";
                tempArray[j].friend_avatar = globalService.userarray[5];
                $scope.friendArray = tempArray; // @@@ Set to $scope array;
                // RECUSIVE PART.  Regular FOR loop didn't work.
                j++;
                if (j < friendsarraylen) {
                    getkiddetails();
                };
            };
        };
    };

    }; // end getFriends
    // ==========================================







    // ==========================================
    // Delete on Friend record
    // ==========================================
    $scope.deleteFriendClick = function (clickEvent) {
        $scope.clickEvent = globalService.simpleKeys(clickEvent);
        $scope.clientId = clickEvent.target.id;
        //alert('delete item = ' + $scope.clientId);

        deleteFriendRecord($scope.clientId);
    }

    function deleteFriendRecord(id) {
        Azureservice.del('friends', {
            id: id // ID for the row to delete    
        })
        .then(function () {
            console.log('Delete successful');
            //alert('Delete successful')

            // Remove from $scope.friendArray.  Its a pain to rebuild
            // -----------
            var foundIndex;
            var len = $scope.friendArray.length;
            for (i = 0; i < len; i++) {
                //alert(JSON.stringify($scope.friendArray[i]));
                if ($scope.friendArray[i].record_id == id) { // If found in this subarray 
                    foundIndex = i;
                    //alert('found at: ' + foundIndex);
                    $scope.friendArray.splice(foundIndex, 1) // remove from this element at index number from 'clientarray'
                    //alert($scope.friendArray);
                    break;
                };
            };
            if ($scope.friendArray.length == 0) {
                $scope.noFriendsFlag = true; // UI flag
            };

        }, function (err) {
            console.error('Azure Error: ' + err);  //alert('Azure Error: ' + err);
        });
    }

    // ==========================================




    // View changer.  Have to use $scope. to make available to the view
    // --------------
    $scope.gotoView = function () {
        globalService.changeView('/');
    };
    $scope.gotoAdminView = function () {
        globalService.changeView('/admindash');
    };
    $scope.gotoPictureView = function (clickEvent) {
        $scope.clickEvent = globalService.simpleKeys(clickEvent);
        $scope.idParameters = clickEvent.target.id;  // div ID has 3 values shoved in it

        globalService.pictureViewParams = $scope.idParameters;  // pass the 3 values as a string and split at the next view
        globalService.lastView = '/clientproperties';  // for knowing where to go with the back button
        globalService.changeView('/picture');
    }

}); //controller end