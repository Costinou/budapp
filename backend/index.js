const express = require('express');
const dateModule = require('./datemodule.js');
const fetch = require('node-fetch');



const key = '8e3af3cd-891c-47c1-8727-4137f4dd53d8';
const version = '3';
const appVersion = 'apiary-1.0';
const includeReferences = "true";
const onlyDepartures = "true";
const limit = 10;
const minutesBefore = 0;
const minutesAfter = 60;
const baseurl = 'https://futar.bkk.hu/api/query/v1/ws/otp/api/where/';
const lon = '19.038035'
const lat = '47.527797'
const radius = 500

const app = express();


app.get('/stop/:id', (req, res) => {
    const stopId = req.params.id;
    console.log(key);
    const apiUrl = `${baseurl}arrivals-and-departures-for-stop.json?key=${key}&version=${version}&appVersion=${appVersion}&includeReferences=${includeReferences}&stopId=${stopId}&onlyDepartures=${onlyDepartures}&limit=${limit}&minutesBefore=${minutesBefore}&minutesAfter=${minutesAfter}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Process the data here
            res.send(data);
        })
        .catch(error => {
            console.error(error);
            res.status(500).send(`An error occurred ${error}`);
        });
});

app.get('/allstops', (req, res) => {
    fetch(`${baseurl}stops-for-location.json?key=${key}&version=${version}&appVersion=${appVersion}&includeReferences=${includeReferences}&lon=${lon}&lat=${lat}&radius=${radius}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.data) {
                const stops = data.data.list;
                const id_name = stops.map(obj => ({ id: obj.id, name: obj.name }));
                res.send(stops);
            } else {
                console.error('Unexpected data structure:', data);
                res.status(500).send('Unexpected data structure');
            }
        })
    });

app.get('/departures/:id', (req, res) => {
    console.log(`Departure requested for ${req.params.id}`);
    const apiUrl = `${baseurl}arrivals-and-departures-for-stop.json?key=${key}&version=${version}&appVersion=${appVersion}&includeReferences=${includeReferences}&stopId=${req.params.id}&onlyDepartures=${onlyDepartures}&limit=${limit}&minutesBefore=${minutesBefore}&minutesAfter=${minutesAfter}`
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data && data.data) {
                const departures = data.data;
                const list_departures = departures.entry.stopTimes
                const tripInfo = list_departures.map(item => {
                    return {
                        tripId: item.tripId,
                        stopHeadsign: item.stopHeadsign,
                        departureTime: dateModule.unixTimeToString(item.departureTime)
                    };
                });
                
                res.send(tripInfo);
            } else {
                console.error('Unexpected data structure:', data);
                res.status(500).send('Unexpected data structure');
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).send(`An error occurred ${error}`);
        });
})


// Define a route to display subway station information
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});




// gps system

var gpstracker = require("gpstracker");

var server = gpstracker.create().listen(5050, function(){
    console.log('listening your gps trackers on port', 5050);
    });

    server.trackers.on("connected", function(tracker){
    console.log("tracker on");
        console.log("tracker connected with imei:", tracker.imei);
        tracker.on("help me", function(){
            console.log(tracker.imei + " pressed the help button!!".red);
        });
      
        tracker.on("position", function(position){
            console.log("tracker {" + tracker.imei +  "}: lat",
                                position.lat, "lng", position.lng);
        });
      
        tracker.trackEvery(10).seconds();
});