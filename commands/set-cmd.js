const path = require('path');
const forceUtils = require('../lib/forceUtils.js');
const apexUtils = require('../lib/apexUtils.js');
const {
  exec
} = require('child_process');

(function () {
    'use strict';
  
    module.exports = {
        topic: 'user',
        command: 'set',
        description: 'sets localization info for the current user',
        help: 'help text for l18n:config:set',
        flags: [{
            name: 'targetusername',
            char: 'u',
            description: 'username for the target org',
            hasValue: true,
            required: false
        }, {
            name: 'json',
            char: 'j',
            description: 'return data as json',
            hasValue: false,
            required: false
        }, {
            name: 'locale',
            char: 'l',
            description: 'locale to set for the active user - must be valid for Salesforce',
            hasValue: true,
            required: false
        }, {
            name: 'language',
            char: 'g',
            description: 'language to set for the active user - must be valid for Salesforce',
            hasValue: true,
            required: false
        }, {
            name: 'timezone',
            char: 't',
            description: 'timezone to set for the active user - must be valid for Salesforce',
            hasValue: true,
            required: false
        }],
        run(context) {
            // get flags
            let targetUsername = context.flags.targetusername;
            let returnJson = context.flags.json;
            let language = context.flags.language;
            let locale = context.flags.locale;
            let timezone = context.flags.timezone;
            if (!language && !locale && !timezone) {
                if (returnJson) {
                    cosole.log(JSON.stringify({"success": false, "error": "nothing to do"}));
                } else {
                    console.log("Nothing to do...");
                }
                return;
            }

            forceUtils.getOrg(targetUsername, (org) => {
                org.force._getConnection(org, org.config).then((conn) => {
                    targetUsername = org.authConfig.username;
                    
                    // verify input by getting allowed values
                    apexUtils.listPicklistValues(targetUsername).then(obj => {
                        // make sure we got valid values
                        let foundLocale = obj.locales.reduce((acc, obj) => {
                            if (acc) return acc;
                            if (obj.value === locale) {
                                return obj;
                            }
                        }, undefined);
                        let foundLanguage = obj.languages.reduce((acc, obj) => {
                            if (acc) return acc;
                            if (obj.value === language) {
                                return obj;
                            }
                        }, undefined);
                        let foundTimezone = obj.timezones.reduce((acc, obj) => {
                            if (acc) return acc;
                            if (obj.value === timezone) {
                                return obj;
                            }
                        }, undefined);
                        return Promise.resolve({"timezone": foundTimezone ? timezone : undefined, 
                            "language": foundLanguage ? language : undefined,
                            "locale": foundLocale ? locale : undefined});
                            
                    }).then(({timezone, language, locale}) => {
                        if (!language && !locale && !timezone) {
                            if (returnJson) {
                                cosole.log(JSON.stringify({"success": false, "error": "No allowed values found - nothing to do..."}));
                            } else {
                                console.log("No allowed values found - nothing to do...");
                            }
                            return;
                        }

                        const apexLogListCommand = `User user = [SELECT LanguageLocaleKey,LocaleSidKey,TimeZoneSidKey FROM User WHERE Id =: UserInfo.getUserId()]; if ('${timezone}' != 'undefined') user.TimeZoneSidKey = '${timezone}'; if ('${locale}' != 'undefined') user.LocaleSidKey = '${locale}'; if ('${language}' != 'undefined') user.LanguageLocaleKey = '${language}'; update user;`;
                        apexUtils.runApex(apexLogListCommand, targetUsername).then(stdout => {
                            const success = (stdout.indexOf('Executed successfully.') >= 0);
                            if (returnJson) {
                                console.log(JSON.stringify({"success": true}));
                            } else {
                                console.log('Success');
                            }
                        })
                    }).catch ((err, stderr) => {
                        console.log('apexLogListCommand:stderr', err, stderr);
                    });
                    
                })
            });
        }
    }
})();