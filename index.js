"use strict";
var APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).
var SKILL_STATES = {
    QUESTIONS: "_QUESTIONMODE", // Asking questions.
    START: "_STARTMODE", // Entry point, start the game.
    HELP: "_HELPMODE" // The user is asking for help.
};

var animalSound = [
    {Kuh:"muhmuuuu mhuuu muuuu"}, 
    {Katze:"miau miau"},
    {Schwein:"oink oink"}
]

var Alexa = require("alexa-sdk");

exports.handler = function(event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.appId = APP_ID // APP_ID is your skill id which can be found in the Amazon developer console where you create the skill.
    alexa.registerHandlers(newSessionHandlers, startHandler, questionHandler);
    alexa.execute();
};

var startHandler = Alexa.CreateStateHandler(SKILL_STATES.START, {
    "Intro": function () {
      
        
      this.handler.state = SKILL_STATES.QUESTIONS;
      this.emit(':ask', "Hallo ich kann Tierstimmen nachmachen. Frage dazu Wie macht eine Kuh?");
      //this.emit(":ask", "Was möchtest du wissen?");
       this.emitWithState("QuestionIntent", true);
    }
});

const questionHandler = Alexa.CreateStateHandler(SKILL_STATES.QUESTIONS, {
    'QuestionIntent' : function(value) {

        //emit response directly
        var intent = this.event.request.intent
        var animal = intent && intent.slots && intent.slots.Animal && intent.slots.Animal.value;
        var article = intent && intent.slots && intent.slots.article && intent.slots.article.value;

        var sound = animalSound[animal]
        console.log(intent);

        this.emit(':tell', sound + " macht " + article + " " + animal);
      //  this.emit(":tell", "muuuuuhhhh");
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
        this.handler.state = SKILL_STATES.START;
        this.emitWithState("StartGame", true);
    },
    "AMAZON.HelpIntent": function() {
        this.handler.state = SKILL_STATES.HELP;
        this.emitWithState("helpTheUser", true);
    },
    "Unhandled": function () {
        this.emit(":tell", "Du kannst jederzeit von vorn beginnen, sage einfach „Neue Frage starten“.");
    },
    
};     

