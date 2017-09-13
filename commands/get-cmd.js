const path = require('path');
const forceUtils = require('../lib/forceUtils.js');
const {
  exec
} = require('child_process');

(function () {
    'use strict';
  
    module.exports = {
        topic: 'user',
        command: 'get',
        description: 'gets localization info for the current user',
        help: 'help text for l18n:config:get',
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
        }],
        run(context) {
            let targetUsername = context.flags.targetusername;
            let returnJson = context.flags.json;

            forceUtils.getOrg(targetUsername, (org) => {
                org.force._getConnection(org, org.config).then((conn) => {
                    targetUsername = org.authConfig.username;
                    
                    const apexPath = path.join(__dirname, 'get.apex');
                    const apexLogListCommand = `sfdx force:apex:execute -u ${targetUsername} -f ${apexPath}`;

                    exec(apexLogListCommand, (err, stdout, stderr) => {
                        if (stderr && err) {
                            console.log('apexLogListCommand:stderr', stderr);
                            return;
                        }
                        const idx1 = stdout.indexOf('DEBUG|$$$');
                        const idx2 = stdout.indexOf('$$$', idx1+9);
                        const strjson = stdout.substring(idx1+9, idx2);
                        const obj = JSON.parse(strjson);
                        if (returnJson) {
                            console.log(JSON.stringify(obj));
                        } else {
                            console.log(`Locale: ${obj.locale}`);
                            console.log(`Language: ${obj.language}`);
                            console.log(`Timezone: ${obj.timezone}`);
                        }
                    });
                })
            });
        }
    }
})();