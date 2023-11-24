const fs = require('fs');
const request = require('request');

// Define the DeepL API endpoint and parameters
const deeplApiEndpoint = 'https://api-free.deepl.com/v2/translate';
const deeplApiKey = 'f0f088f9-8869-924a-1465-3da302db2b8c:fx'; // Replace with your DeepL API key
const targetLanguage = 'FR';

fs.readdir('client/src/locales/en', (err, files) => {
    let totalContent = {};
    for (let i = 0; i < files.length; i++) {
        console.log(files[i]);
        // Read the source JSON file
        if (files[i] === 'index.js') {
            continue;
        }
        fs.readFile('client/src/locales/en/' + files[i], 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
        
            const content = unwrap(JSON.parse(data));
        
            console.log("Intitial content", content);
        
            const requestData = JSON.stringify({text: Object.values(content), "target_lang":targetLanguage, "source_lang":"EN"});
            
        
            const options = {
                'method': 'POST',
                'url': deeplApiEndpoint,
                'headers': {
                  'Content-Type': 'application/json',
                  'Authorization': 'DeepL-Auth-Key ' + deeplApiKey
                },
                body: requestData
            };
        
            request(options, function (error, response) {
                if (error) throw new Error(error);
        
                const responseArr = JSON.parse(response.body).translations;
        
                console.log("Response array", typeof responseArr);
        
                for (let i = 0; i < responseArr.length; i++) {
                    content[Object.keys(content)[i]] = responseArr[i].text;
                }
        
                console.log("Final content", content);
                totalContent = {...totalContent, ...content};

                if (i === files.length - 1) {
                    console.log("Done");
        
                    // Write the translated text to the target JSON file
                    fs.writeFile('client/src/locales/fr/translation.json', JSON.stringify(totalContent), err => {
                        if (err) {
                            console.error(err);
                            return;
                        }
            
                        console.log('Translation successful');
                    });
                }
            });
        });
    }
});

function unwrap(obj, prefix) {
    var res = {};
    for (var k of Object.keys(obj)) {
        var val = obj[k],
            key = prefix ? prefix + '.' + k : k;

        if (typeof val === 'object')
            Object.assign(res, unwrap(val, key)); // <-- recursion
        else
            res[key] = val;
    }

    return res;
}