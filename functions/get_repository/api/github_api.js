// –––– IMPORTS –––– //
// local imports
const Utils = require('../helpers/utils')
const HTTP_CODE = Utils.HTTP_CODE


// –––– CONSTANTS –––– //
// ...


// –––– GLOBALS –––– //
// ...


// –––– FUNCTIONS –––– //
/**
 * Gets a list of pending actions from the Instalment Action Log.
 * @function fetch_repo
 * @param username A GitHub username.
 * @param token A personal access token.
 * @async
 * @returns {Array} A list of Action Objects.
 */
const fetch_repo = async (username, token) => {

    let params = {
        "type": "all"
    }

    // build request options
    const options = {
        host: 'api.github.com',
        path: `/user/repos`,
        method: 'GET',
        headers: {
            'User-Agent': username,
            'Accept': 'application/vnd.github+json',
            'Authorization': `Bearer ${token}`
        }
    }

    // send request
    let result = null
    try {
        result = await Utils.send(options)
        Utils.check_result(options, null, result)
    }
    catch (err) {
        if(err.message != "No records found for the given criteria."){
            throw err
        } else {
            return("No Actions Queued")
        }  
    }


    let body = JSON.parse(result.body)
    let response = []
    for (let i = 0; i < body.length; i++) {
        const record = body[i]
        console.log(record.name)
        response.push({
            "repo_name": record.name,
            "repo_id": record.id
        })
    }
    return response || []
}

// –––– MODULE EXPORT –––– //
module.exports = {
   fetch_repo
}