angular.module('eventsApp', ['ngBootbox'])
  .controller('eventController', ['$scope', '$ngBootbox', function($scope, $ngBootbox) {

    //app is governed under the title eventsList
    var eventsList = this;

    eventsList.events = [];
    console.log(eventsList.events);
    console.log("event should have been an empty array");
    eventsList.getEvents = function() {
        const startTime = performance.now();
      $.get("/dbQuery", function(data){
        console.log("Making Request");
        eventsList.events = data;
        console.log("Here's the current status of eventsList.events");
        console.log(eventsList.events);
        const duration = performance.now() - startTime;
        console.log("This function took " +duration+ "ms");
        $scope.$apply();
      });
    }

    eventsList.getEvents();

    //Here our "events" variable is populated with events from the database.
    //To do:
    //Take JSON encoded form data and send it to the server for processing
    //Then update the page again by calling eventsList.getEvents
    eventsList.addEvent = function() {
      console.log("Ok this launced");
      var name;
      var addy;

            $ngBootbox.prompt('Event Name?')
          .then(function(result) {
              console.log('Event name: ' + result);
              name = result;
              $ngBootbox.prompt('Address?')
              .then(function(result){
                console.log('Address: ' + result);
                addy = result;
                var data = {
                     "title": name,
                     "address": addy,
                     "Going": 1
                   }
                   $.post("/dbInsert", data, function(data){
                     console.log(data);
                   });
                   eventsList.getEvents();

              }, function() {
                console.log('Prompt dismissed!')
              });
          }, function() {
              console.log('Prompt dismissed!');
          });

    }

    //Make a put request to decrease the number of individuals going.
    eventsList.decreaseGoing = function() {


    }

    eventsList.increaseGoing = function() {


    }
}]);
