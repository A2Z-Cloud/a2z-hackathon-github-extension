'use strict';

// –––– IMPORTS –––– //

// Github API
const {fetch_repo} = require('./api/github_api')

const express = require('express')
const app = express()

module.exports = app.get('/', async (req, res) => {
	let username = req.query.username
    let pat = req.query.pat
    const response = await fetch_repo(username, pat)
    return res.send(response)
})
