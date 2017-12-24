"use strict";
var APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).
var SKILL_STATES = {
    QUESTIONS: "_QUESTIONMODE", // Asking questions.
    START: "_STARTMODE", // Entry point, start the game.
    HELP: "_HELPMODE" // The user is asking for help.
};

var animalSound = {
    kuh:"muhmuuuu mhuuu muuuu", 
    katze:"miau miau",
    schwein:"oink oink",
    huhn:"borg borg ",
    hund:"wau wau wau",
    pferd:"ühhhüühüüü",
    frosch:"quak quak quak",
    elefant:"töröö",
    biene:"wau wau wau",
    hummel:"zzzz",
    maus:"piep piep",
    uhu:"schuuhuuuhu schuuhuu",
    meerschwein:"quiek quiek",
    kücken:"schiep schiep",
    esel:"iaaaa iaaaaa",
    ente: "nak nak nak",
    vogel: "piep piep piep",
    schaf: "määä määä"
}

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
      this.emit(':ask', "Hallo ich kann Tierstimmen nachmachen. Frage dazu beispielsweise: Wie macht die Katze?");
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
       
        if (animal !== undefined){
            
            var sound = animalSound[animal]
            console.log(intent);
            if ( sound !== undefined) {
                this.emit(':ask', sound + " macht " + article + " " + animal + ". Möchtest du ein anderes Tier hören?");
            }
            else{        
                this.emit(':ask', "ich weiß leider nicht welchen ton " + article + " " + animal + " von sich gibt. Aber ich lerne immer weiter. Frag mich bald danach. Möchtest du ein anderes Tier hören?");
            }
            
        }
        else{
            console.dir(intent);
            this.emit(':ask', "Das Tier kenne ich noch nicht, aber ich lerne immer weiter. Frag mich bald danach. Möchtest du ein anderes Tier hören?");
        }
        
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
    
        this.emit(":tell", "bis bald...");
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
        this.emit(":tell", "Nachdem du das Kill mit ALexa, starte wie macht, kannst du mich beispielsweise fragen wie macht die Katze, oder sage Stop zum beenden.");
    },
    "Unhandled": function () {
        this.emit(":tell", "Du kannst mich beispielsweise fragen wie macht die Katze, oder sage Stop zum beenden.");
    },
    
};     

