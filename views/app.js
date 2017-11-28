angular.module('eventsApp', [])
  .controller('eventController', function() {

    //app is governed under the title eventsList
    var eventsList = this;

    //This function provides the eventsList as a group of JSON objects.

    eventsList.getEvents = function() {
      var xmlHttp = new XMLHttpRequest();

      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readystate == 4 && xmlHttp.status == 200)
        console.log(xmlHttp.response);
        var k = JSON.parse(xmlHttp.response);
        console.log(k);
      }

      xmlHttp.open("GET", "/dbQuery", true);
      xmlHttp.send();
    }


    //Here our "events" variable is populated with events from the database.
    eventsList.events = eventsList.getEvents;



    //To do:
    //Take JSON encoded form data and send it to the server for processing
    //Then update the page again by calling eventsList.getEvents
    eventsList.addEvent = function() {


    }

    //Make a put request to to increase the number of individuals going
    eventsList.addGoing = function() {

    }

    //Make a put request to decrease the number of individuals going.
    eventsList.decreaseGoing = function() {


    }







  })
