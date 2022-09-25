chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {

    if (!tabs[0].url.includes("creator.zoho") || (!tabs[0].url.includes("workflowbuilder") && !tabs[0].url.includes("customFunction"))) {
        document.getElementsByTagName("iframe")[0].src = "popupcheck.html";
    }
});

(async () => {
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  let result;
  try {
    [{result}] = await chrome.scripting.executeScript({
      target: {tabId: tab.id},
      func: () => document.documentElement.innerText,
    });
  } catch (e) {
    document.body.textContent = 'Cannot access page';
    return;
  }

  content_list = result.split("\n");

 url_list = tab.url.split("/");
 payload_id = url_list[4];
 script_type = url_list[6];
 file_name = url_list[7];

 if (script_type == "workflowbuilder") {

  code = "";

  for (let i = 0; i < content_list.length; i++) {
    if (i > 24) {

        line_counter_check = false;
        code_line_check = false;
        substring_counter = 0;

        for (let char = 0; char < content_list[i].length; char++) {

            if (content_list[i][char].match(/\d/) && line_counter_check != true) {

                substring_counter = substring_counter + 1;
                code_line_check = true;
            }
            else {
                line_counter_check = true;
            }
        }

        content_list[i] = content_list[i].substring(substring_counter);

        if (code_line_check == true) {
            code = code + content_list[i] + "\n"
        }
        code = code.replace("\n Action", "")

    }
 }
 }
 else  {

  code = "";

  line_counter_check = false;

  for (let i = 0; i < content_list.length; i++) {
    if (i > 105) {

        if (content_list[i] == "Trial has expired") {

            line_counter_check = true;
        }
        if (line_counter_check == false) {

            let is_line_number = /^\d+$/.test(content_list[i]);

            if (content_list[i] != "\n" && is_line_number == false) {

                code = code + content_list[i] + "\n"
            }
        }
    }
 }
 }

 var today = new Date();
 var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
 var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
 var dateTime = date + '-' + time;

 payload_id = payload_id + "-" + dateTime;

 payload_id = payload_id.replace("/edit", "-" + dateTime)

 payload = {"id": payload_id, "code": encodeURI(code)}

 query = "?id=" + payload_id + "&code=" + encodeURI(code);

 console.log(payload);

 fetch("https://a2z-hackathon-github-extension-20081899216.development.catalystserverless.eu/server/access_cache/write" + query, {
    method: "GET"
 }).then(res => {
    // load iFrame
    // console.log("Request complete! response:", res);
    console.log(tab.url);

    if (tab.url.includes("creator.zoho") && (tab.url.includes("workflowbuilder") || tab.url.includes("customFunction"))) {
        document.getElementsByTagName("iframe")[0].src = "https://a2z-hackathon-github-extension-20081899216.development.catalystserverless.eu/app/index.html?id=" + payload_id + "&file_name=" + file_name;
    }
 });

})();