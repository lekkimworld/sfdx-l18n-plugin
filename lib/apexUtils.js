const path = require('path');
const forceUtils = require('../lib/forceUtils.js');
const {
  exec
} = require('child_process');

const runApex = (apex, targetUsername) => {
    return new Promise((resolve, reject) => {
        exec(`echo "${apex}" | sfdx force:apex:execute -u ${targetUsername}`, (err, stdout, stderr) => {
            if (stderr && err) {
                reject(err, stderr);
            } else {
                resolve(stdout);
            }
        });
    });
}
const listPicklistValues = (targetUsername) => {        
    // get allowed values
    const apex4values = `
        List<Schema.PicklistEntry> locales = User.LocaleSidKey.getDescribe().getPicklistValues();
        List<Schema.PicklistEntry> langs = User.LanguageLocaleKey.getDescribe().getPicklistValues(); 
        List<Schema.PicklistEntry> tzs = User.TimeZoneSidKey.getDescribe().getPicklistValues();
        JSONGenerator gen = JSON.createGenerator(false);
        gen.writeStartObject();
        gen.writeFieldName('languages');
        gen.writeStartArray();
        for (Schema.PicklistEntry entry : langs) {
            gen.writeStartObject();
            gen.writeStringField('label', entry.getLabel());
            gen.writeStringField('value', entry.getValue());
            gen.writeEndObject();
        
        }
        gen.writeEndArray();
        gen.writeFieldName('locales');
        gen.writeStartArray();
        for (Schema.PicklistEntry entry : locales) {
            gen.writeStartObject();
            gen.writeStringField('label', entry.getLabel());
            gen.writeStringField('value', entry.getValue());
            gen.writeEndObject();
        }
        gen.writeEndArray();
        gen.writeFieldName('timezones');
        gen.writeStartArray();
        for (Schema.PicklistEntry entry : tzs) {
            gen.writeStartObject();
            gen.writeStringField('label', entry.getLabel());
            gen.writeStringField('value', entry.getValue());
            gen.writeEndObject();
        
        }
        gen.writeEndArray();
        gen.writeEndObject();
        gen.close();
        System.debug(gen.getAsString() + '<<<');`;
        
    return new Promise((resolve, reject) => {
        runApex(apex4values, targetUsername).then((stdout) => {
            // get json
            let idx1 = stdout.indexOf('DEBUG|{');
            let idx2 = stdout.indexOf('<<<', idx1+6);
            let str = stdout.substring(idx1+6, idx2);
            let obj = JSON.parse(str);
            resolve(obj);

        }).catch(() => {
            reject();
        })
    })
}
const makeListPicklistValues = key => context => {
    // get flags
    let targetUsername = context.flags.targetusername;
    let returnJson = context.flags.json;
    
    forceUtils.getOrg(targetUsername, (org) => {
        org.force._getConnection(org, org.config).then((conn) => {
            targetUsername = org.authConfig.username;
            
            listPicklistValues(targetUsername).then((obj) => {
                if (returnJson) {
                    console.log(JSON.stringify(obj[key]));
                } else {
                    obj[key].forEach(obj => {
                        console.log(`${obj.label} = ${obj.value}`);
                    })
                }
            })
        })
    });
}

module.exports = {
    "runApex": runApex,
    "listPicklistValues": listPicklistValues, 
    "makeListPicklistValues": makeListPicklistValues
}