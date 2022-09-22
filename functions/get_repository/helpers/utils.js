// –––– IMPORTS –––– //
// Make standard HTTPS web requests
const https = require('https')


// –––– CONSTANTS –––– //
const SENSITIVE_PLACEHOLDER = "- REMOVED -"

// HTTP Codes
const HTTP_CODE = {
    "ACCEPTED": 200,
    "NOT_ACCEPTED": 300,
    "PERMANENT_REDIRECT": 308,
    "UNAUTHORIZED": 401,
    "NOT_FOUND": 404,
    "INTERNAL_ERROR": 500
}


// –––– FUNCTIONS –––– //
/**
 * Sorts object keys in alphabetical order.
 * @param params
 * @returns {Object}
 */
const key_sort = (item) => {
    const result = {}
    Object.keys(item).sort().forEach((key) => result[key] = item[key])
    return result
}

/**
 * Outputs a date object as a string in the format dd-MMM-yyyy.
 * @param params
 * @returns {string}
 */
const format_date = (date) => {
    let month_names = ["Jan","Feb","Mar","Apr",
                       "May","Jun","Jul","Aug",
                       "Sep","Oct","Nov","Dec"]
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()
    const date_parts = [(day<=9?`0${day}`:day),month_names[month],year]
    return date_parts.join('-')
}

/**
 * If status code is not 200, log then throw error.
 * @param payload
 * @param result
 */
 const check_result = (options, payload, result) => {
    if(result.statusCode > HTTP_CODE.NOT_ACCEPTED) {
        // get the callee
        const callee = new Error().stack.split('at ')[2].split(' ')[0]

        // log to console
        console.error('\n--Unexpected Result--\n')
        console.error(`Failed to call:\n${callee}\n`)
        console.error(`Target URL:\n${options.host}\n`)
        console.error(`Set path:\n${options.path}\n`)
        console.error(`Sent headers:\n${JSON.stringify(options.headers,null,4)}\n`)
        console.error(`Sent content:\n${JSON.stringify(payload,null,4)}\n`)
        console.error(`Recieved response:\n${JSON.stringify(result,null,4)}\n`)

        // raise error
        let message = "Unreadable response."
        if(result.body.message || result.body.error)
            message = result.body.message ? result.body.message : result.body.error.message
        throw Error(message)
    }
}

/**
 * Converts a json structure into a url parameter string.
 * @function to_query_string
 * @param params
 * @returns {string} the url arg string.
 */
const to_query_string = (params, encode_values=true) => {
    let query_string = '', delimiter = '?'
    for (const key in params) {
        let value = params[key]
        if(typeof value == 'object') value = JSON.stringify(value)
        query_string += `${delimiter}${key}=${encode_values?encodeURIComponent(value):value}`
        delimiter = '&'
    }
    return query_string
}

/**
 * Sends an HTTPS request.
 * @function send
 * @param options
 * @param body
 * @returns {Object|Error} the response from the attempt or an error.
 */
const send = (options,body) => {
    // return new pending promise
    return new Promise((resolve, reject) => {
        // send request
        const request = https.request(options, (response) => {
            // push data chunks into the result and resolve
            let result = []
            response.on('data', (chunk) => result.push(chunk))
            response.on('end', () =>  {
                let end_result = result.join('')
                try {
                    // parse if JSON is returned
                    if(end_result.length > 0 && end_result[0] == '{')
                        end_result = JSON.parse(end_result)
                }
                catch(err) { console.error(err) }
                resolve({
                    'statusCode': response.statusCode,
                    'headers': JSON.parse(JSON.stringify(response.headers)),
                    'body': end_result
                })
            })
        })

        // push data and handle connection errors
        request.on('data', (content) => process.stdout.write(content))
        request.on('error', (err) => reject(err))

        // make sure body is a string
        if(body != null && typeof body == 'object')
            body = JSON.stringify(body)

        // send request
        if(body) request.write(body)
        request.end()
    })
}


/**
 * Logs an error message and generates a response object for the API to return
 * to a client as html.
 * @param message
 * @param code
 * @returns {Response}
 */
const set_client_error = (message, code) => {
    // set a default error message
    if(message == null || message == "")
        message = "Something has gone wrong."

    // set a default error code
    if(code == null || code == "")
        code = HTTP_CODE.INTERNAL_ERROR

    // supplement the client message with a contact notice
    message += " <br><br>If you are seeing this message then you will need to contact a support representative to resolve this issue."

    // log the error to the server
    console.error(message)

    // prepare a result object to return to the client
    return { headers: {"Content-Type": "text/html"}, code, message }
}

/**
 * Logs an error message and generates a response object for the API to return
 * to a service as json.
 * @param message
 * @param code
 * @returns {Response}
 */
const set_service_error = (message, code) => {
    // set a default error code
    if(code == null || code == "")
        code = HTTP_CODE.INTERNAL_ERROR

    // set default content
    let content = { success: false, code: code, message: "Something has gone wrong." }

    // set a default error content
    if(message != null && message != "")
        content.message = message

    // log the error to the server
    console.error(content.message)

    // prepare a result object to return to the client
    return { headers: {"Content-Type": "application/json"}, code, content }
}

/**
 * Logs an error message and generates a response object for the API to return
 * to a service as json.
 * @param message
 * @param code
 * @returns {Response}
 */
const set_service_accepted = (message) => {
    // set default content
    let content = { success: true, code: HTTP_CODE.ACCEPTED, message: "Accepted." }

    // set a default error content
    if(message != null && message != "" && typeof message != 'undefined')
        content.message = message

    // log the message to the server
    //console.log(content.message)

    // prepare a result object to return to the client
    return { headers: {"Content-Type": "application/json"}, code: HTTP_CODE.ACCEPTED, content }
}

// –––– MODULE EXPORT –––– //
module.exports = {
    key_sort,
    format_date,
    check_result,
    to_query_string,
    send,
    set_client_error,
    set_service_error,
    set_service_accepted,
    HTTP_CODE,
    SENSITIVE_PLACEHOLDER
}
