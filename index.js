const setCmd = require('./commands/set-cmd.js');
const getCmd = require('./commands/get-cmd.js');

(function() {
    'use strict';

    exports.topics = [{
        name: 'config',
        description: 'commands for config'}
    ];
    exports.namespace = {
        name: 'l18n',
        description: 'Various commands for user l18n'
    };
    exports.commands = [
        setCmd,
        getCmd
    ];
    
}());