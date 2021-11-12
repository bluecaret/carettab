#!/usr/bin/env node
console.log("Awesome Command");
const fs = require('fs');
const { isObject } = require('util');


function jsonReader(filePath, cb) {
    fs.readFile(filePath, (err, fileData) => {
        if (err) {
            return cb && cb(err)
        }
        try {
            const object = JSON.parse(fileData)
            return cb && cb(null, object)
        } catch (err) {
            return cb && cb(err)
        }
    })
} 

function pushAndLog(key, val, arr) {
    arr.push(key);
    console.log(key + " : " + val);
}

jsonReader('src/assets/i18n/fr-FR.json', (err, i18nFile) => {
    if (err) {
        console.log(err)
        return
    }

    // purée ca marche mais un bon codeur js va avoir une crise cardiaque en voyant ca ci dessous.

    let arr= [];
    for (let key of Object.keys(i18nFile)) {
        if (isObject(i18nFile[key])) 
        for (let key2 of Object.keys(i18nFile[key])) {
            if (isObject(i18nFile[key][key2])) 
            for (let key3 of Object.keys(i18nFile[key][key2])) {
                if (isObject(i18nFile[key][key2][key3]))
                for (let key4 of Object.keys(i18nFile[key][key2][key3])) {
                    pushAndLog(key + "." + key2 + "." + key3 + "." + key4 , i18nFile[key][key2][key3][key4],arr);
                }
                else pushAndLog(key + "." + key2 + "." + key3 , i18nFile[key][key2][key3], arr);
            }
            else pushAndLog(key + "." + key2, i18nFile[key][key2], arr);
            
        }
        else pushAndLog(key, i18nFile[key], arr)
    }
    console.log(arr);



    
})

