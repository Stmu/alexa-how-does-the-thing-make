"use strict";
var APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).
var SKILL_STATES = {
    TRIVIA: "_TRIVIAMODE", // Asking trivia questions.
    START: "_STARTMODE", // Entry point, start the game.
    HELP: "_HELPMODE" // The user is asking for help.
};

var Alexa = require("alexa-sdk");

exports.handler = function(event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.appId = APP_ID // APP_ID is your skill id which can be found in the Amazon developer console where you create the skill.
    alexa.registerHandlers(newSessionHandlers, startHandler, questionHandler);
    alexa.execute();
};

var startHandler = Alexa.CreateStateHandler(SKILL_STATES.START, {
    "Intro": function () {
      this.emit(':tell', "Hallo frag mich wie ein Tier macht. Sage dazu: Wie macht eine Kuh?");
        
      this.handler.state = SKILL_STATES.TRIVIA;
      //this.emit(":ask", "Was möchtest du wissen?");
       this.emitWithState("QuestionIntent");
    }
});

const questionHandler = Alexa.CreateStateHandler(SKILL_STATES.TRIVIA, {
    'QuestionIntent' : function() {
        //emit response directly
        var intent = this.event.request.intent
        var animal = intent && intent.slots && intent.slots.Animal && intent.slots.Animal.value;
        
        this.emit(':tell', "Hello...");
        this.emit(":tell", "muuuuuhhhh");
    },
    "AMAZON.StartOverIntent": function () {
        this.handler.state = SKILL_STATES.START;
        this.emitWithState("Intro", false);
    },
    "AMAZON.HelpIntent": function () {
        this.handler.state = SKILL_STATES.START;
        this.emitWithState("Intro", false);
    },
    "AMAZON.StopIntent": function () {
        this.handler.state = SKILL_STATES.HELP;
        var speechOutput = this.t("STOP_MESSAGE");
        this.emit(":ask", speechOutput, speechOutput);
    },
    "AMAZON.CancelIntent": function () {
        this.emit(":tell","OK, dann bis bald mal wieder.");
    },
    "SessionEndedRequest": function () {
        console.log("Session ended in trivia state: " + this.event.request.reason);
    }
});


const newSessionHandlers = {
    'LaunchRequest':function(){
        this.handler.state = SKILL_STATES.START;
        this.emitWithState("Intro");
    },
    "AMAZON.StartOverIntent": function() {
        this.handler.state = GAME_STATES.START;
        this.emitWithState("StartGame", true);
    },
    "AMAZON.HelpIntent": function() {
        this.handler.state = GAME_STATES.HELP;
        this.emitWithState("helpTheUser", true);
    },
    "Unhandled": function () {
        this.emit(":tell", "Du kannst jederzeit von vorn beginnen, sage einfach „Neue Frage starten“.");
    },
    
};     

