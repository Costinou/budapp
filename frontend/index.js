const { log } = require('console');
const express = require('express');
const path = require('path');

// index.html json file

const app = express();;
const port = 8080;

// Serve static files from the 'html' folder
app.use(express.static(path.join(__dirname, 'html')));

// Define a route to display subway station information
app.get('/subway-stations/:id', (req, res) => {
    const stopId = req.params.id;
    const apiUrl = `http://localhost:3000/stop/${stopId}`;
    fetch(apiUrl)
    .then(response => response.json())
    .then(
        data => {
        res.send(data);
    })
    .catch(error => {
        console.error(error);
        res.status(500).send(`An error occurred ${error}`);
    }); 
});

app.get('/plot-all-stops', (req, res) => {
    const apiUrl = `http://localhost:3000/allstops`;
    console.log('Fetching data for allstops');
    fetch(apiUrl)
    .then(response => response.json())
    .then(
        data => {
            console.log("Filtered data for allstops");
            res.send(data);
    })
    .catch(error => {
        console.error(error);
        res.status(500).send(`An error occurred ${error}`);
    }); 
});

app.get('/next-departures/:id', (req, res) => {

    const stopId = req.params.id;
    const apiUrl = `http://localhost:3000/departures/${stopId}`;
    fetch(apiUrl)
    .then(response => response.json())
    .then(
        data => {
            res.send(data[0]);
    })
    .catch(error => {
        console.error(error);
        res.status(500).send(`An error occurred ${error}`);
    }); 
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'favicon.ico'));
});