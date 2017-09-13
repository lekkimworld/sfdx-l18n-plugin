const path = require('path');
const forceUtils = require('../lib/forceUtils.js');
const {
  exec
} = require('child_process');

(function () {
    'use strict';
  
    module.exports = {
        topic: 'config',
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
            description: 'return as json',
            hasValue: false,
            required: false
        }, {
            name: 'locale',
            char: 'o',
            description: 'locale',
            hasValue: true,
            required: true
        }, {
            name: 'language',
            char: 'l',
            description: 'language',
            hasValue: true,
            required: true
        }, {
            name: 'timezone',
            char: 't',
            description: 'timezone',
            hasValue: true,
            required: true
        }],
        run(context) {
            let targetUsername = context.flags.targetusername;
            let returnJson = context.flags.json;
            let language = context.flags.language;
            let locale = context.flags.locale;
            let timezone = context.flags.timezone;

            forceUtils.getOrg(targetUsername, (org) => {
                org.force._getConnection(org, org.config).then((conn) => {
                    targetUsername = org.authConfig.username;
                    
                    const apexPath = path.join(__dirname, 'set.apex');
                    
                    const apexLogListCommand = `echo "User user = [SELECT LanguageLocaleKey,LocaleSidKey,TimeZoneSidKey FROM User WHERE Id =: UserInfo.getUserId()]; user.TimeZoneSidKey = '${timezone}'; user.LocaleSidKey = '${locale}'; user.LanguageLocaleKey = '${language}'; update user;" | sfdx force:apex:execute -u ${targetUsername}`;

                    exec(apexLogListCommand, (err, stdout, stderr) => {
                        if (stderr && err) {
                            console.log('apexLogListCommand:stderr', stderr);
                            return;
                        }
                       
                        const success = (stdout.indexOf('Executed successfully.') >= 0);
                        if (returnJson) {
                            console.log(JSON.stringify({"success": true}));
                        } else {
                            console.log('Success');
                        }
                    });
                    
                })
            });
        }
    }
})();