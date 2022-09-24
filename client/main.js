document.getElementById("button-login").addEventListener("click", function () { // get query parameters
    let username = document.getElementById('username').value
    let pat = document.getElementById('pat').value
    // fetch respository list
    fetch("https://a2z-hackathon-github-extension-20081899216.development.catalystserverless.eu/server/get_repository?username=" + username + "&pat=" + pat).then((response) => response.json())
    .then((data) => {
       // add each repo to pick list
       for (var i = 0; i < data.length; i++) {
           add_option(data[i].repo_name, data[i].repo_id)
       }  
    })
});
document.getElementById("button-commit").addEventListener("click", function () {})

const add_option = (repo_name, repo_id) => {
    select = document.getElementById('repo-select')
    new_option = new Option(repo_name, repo_id)
    select.appendChild(new_option)
}
