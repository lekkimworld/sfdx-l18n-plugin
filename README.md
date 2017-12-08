# sfdx-l18n-plugin
A plugin for the Salesforce CLI built by Mikkel Flindt Heisterberg to allow you to update the localization values on the created users object. This allows you to set the user interface language, the locale of the user (date/time formats) and the timezone of the user from the command line.

## Setup
### Install from source

1. Install the SDFX CLI.
2. Clone the repository: `git clone git@github.com:lekkimworld/sfdx-l18n-plugin.git`
3. Link the plugin: `sfdx plugins:link .`

### Install as plugin
1. Install plugin: `sfdx plugins:install sfdx-l18n-plugin`

## Example Usage
Below example will use the plugin to change the user language for from default language to English. Same approach can be used to set the locale and timezone.

Create project
`$ sfdx force:project:create -n foo`
*target dir = /Users/mheisterberg/m*
   *create foo/sfdx-project.json*
   *create foo/README.md*
   *create foo/config/project-scratch-def.json*

Enter project
`$ cd foo`

Create a new scratch org - by default created with users locale - Danish in my case
`$ sfdx force:org:create -s -a org1 -f config/project-scratch-def.json`
*Successfully created scratch org: 00D7E0000000sWFUAY, username: test-a2ngdpsb8cvs@mheisterberg_company.net*

List SFDX commands
`$ sfdx --help`
*Usage: sfdx COMMAND*

*Help topics, type sfdx help TOPIC for more details:*

*force    tools for the Salesforce developer*
*l18n     Various commands for user localization (l18n)*
*plugins  manage plugins*
*update   update CLI*
 
 List languages in scratch org
 `$ sfdx l18n:list:languages -u test-a2ngdpsb8cvs@mheisterberg_company.net`
*Engelsk = en_US*
*Tysk = de*
*Spansk = es*
*Fransk = fr*
*Italiensk = it*
*Japansk = ja*
*Svensk = sv*
*Koreansk = ko*
*Kinesisk (traditionel) = zh_TW*
*Kinesisk (forenklet) = zh_CN*
*Portugisisk (Brasilien) = pt_BR*
*Hollandsk = nl_NL*
*Dansk = da*
*Thailandsk = th*
*Finsk = fi*
*Russisk = ru*
*Spansk (Mexico) = es_MX*
*Norsk = no*

Get the current config for the user (shows language is set to Danish)
`$ sfdx l18n:user:get -u test-a2ngdpsb8cvs@mheisterberg_company.net`
*Locale: da_DK*
*Language: da*
*Timezone: Europe/Paris*

Set language to English
`$ sfdx l18n:user:set -u test-a2ngdpsb8cvs@mheisterberg_company.net --language en_US`
*Success*

Get the new config for the user (shows language is now English)
`$ sfdx l18n:user:get -u test-a2ngdpsb8cvs@mheisterberg_company.net`
*Locale: da_DK*
*Language: en_US*
*Timezone: Europe/Paris*

Open the scratch org (will open in English)
`$ sfdx force:org:open`
*(org opens in English)*

JSON output supported
`sfdx l18n:user:get -u test-a2ngdpsb8cvs@mheisterberg_company.net --json`
*{"language":"da","locale":"da_DK","timezone":"Europe/Paris"}*