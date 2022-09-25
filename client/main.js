// login button event
document.getElementById("button-login").addEventListener("click", function () { // get query parameters
    let username = document.getElementById('username').value
    let pat = document.getElementById('pat').value
    // fetch respository list
    fetch("https://a2z-hackathon-github-extension-20081899216.development.catalystserverless.eu/server/get_repository/?username=" + username + "&pat=" + pat).then((response) => response.json())
    .then((data) => {
       // add each repository to pick list
       for (var i = 0; i < data.length; i++) {
           add_option(data[i].repo_name, data[i].repo_id)
       }  
    })
});

// commit button event
document.getElementById("button-commit").addEventListener("click", function () {})

const add_option = (repo_name, repo_id) => {
    select = document.getElementById('repo-select')
    new_option = new Option(repo_name, repo_id)
    select.appendChild(new_option)
}

const get_code = () => {
    // get query 
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    fetch("https://a2z-hackathon-github-extension-20081899216.development.catalystserverless.eu/server/access_cache/read?id=" + id, {
    method: "GET"
    }).then((res) => res.json())
    .then((data) => {
        console.log(data)
        code_element = document.getElementById("code")
        code_element.innerHTML = data.code
    });
}

window.onload = get_code;
