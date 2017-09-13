const apexUtils = require('../lib/apexUtils.js');

(function () {
    'use strict';

    module.exports = {
        topic: 'list',
        command: 'timezones',
        description: 'lists timezones available for the org',
        help: 'help text for l18n:list:timezones',
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
        }],
        "run": apexUtils.makeListPicklistValues('timezones')
    }
})();