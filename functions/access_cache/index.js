'use strict';

// –––– IMPORTS –––– //

// Zoho Catalyst SDK
const catalyst = require('zcatalyst-sdk-node');

// Express.js
const express = require('express')
const app = express()
app.use(express.json())


// read endpoint
module.exports = 
    app.get('/read', async (req, res) => {
		// initialise Zoho Catalyst SDK
		const app = catalyst.initialize(req)

		// get component and segment instance
		let cache = app.cache()
		let segment = cache.segment()

		// get id from request query
		let id = req.query.id

        // get code from cache
		let cachePromise = segment.getValue(id);
		cachePromise.then((entity) => {
			console.log(entity);
			let entity_response = {"code":entity}
			return res.send(entity_response)
		});
    })

// write endpoint
module.exports = 
app.get('/write', async (req, res) => {
	// initialise Zoho Catalyst SDK
	const app = catalyst.initialize(req)
	// get component and segment instance
	let cache = app.cache()
	let segment = cache.segment()
	// get id and code from request body
	let id = req.query.id
	let code = req.query.code
	// write to cache
	let cachePromise = segment.put(id, code);
    cachePromise.then((entity) => {
		// console.log(entity);
		return res.send("Successfully written to cache!")
    });
})

module.exports = 
    app.get('/', async (req, res) => {
        let response = "hello world!"
        return res.send(response)
    })


	
    

