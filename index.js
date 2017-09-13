const setCmd = require('./commands/set-cmd.js');
const getCmd = require('./commands/get-cmd.js');
const listLangsCmd = require('./commands/list-languages-cmd.js');
const listLocalesCmd = require('./commands/list-locales-cmd.js');
const listTzsCmd = require('./commands/list-timezones-cmd.js');

(function() {
    'use strict';

    exports.topics = [
        {name: 'user',
            description: 'commands for setting/getting localization for user'
        }, {name: 'list',
            description: 'commands for listing potential values'
        }
    ];
    exports.namespace = {
        name: 'l18n',
        description: 'Various commands for user localization (l18n)'
    };
    exports.commands = [
        setCmd,
        getCmd,
        listLangsCmd,
        listLocalesCmd,
        listTzsCmd
    ];
}());
