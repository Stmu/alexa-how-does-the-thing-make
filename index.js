"use strict";
var APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

var Alexa = require("alexa-sdk");

exports.handler = function(event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.appId = APP_ID // APP_ID is your skill id which can be found in the Amazon developer console where you create the skill.
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'QuestionIntent' : function() {
        //emit response directly
        var intent = this.event.request.intent
        var animal = intent && intent.slots && intent.slots.Animal && intent.slots.Animal.value;
        
        this.emit(':tell', "Hello...");
        this.emit(":tell", "muuuuuhhhh");
    }
};     

