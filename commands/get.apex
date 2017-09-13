User user = [SELECT LanguageLocaleKey,LocaleSidKey,TimeZoneSidKey FROM User WHERE Id =: UserInfo.getUserId()];
System.debug('$$${"language": "' + user.LanguageLocaleKey + '", "locale": "' + user.LocaleSidKey + '", "timezone": "' + user.TimeZoneSidKey + '"}$$$');
