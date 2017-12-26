"use strict";
var APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).
var SKILL_STATES = {
    QUESTIONS: "_QUESTIONMODE", // Asking questions.
    START: "_STARTMODE", // Entry point, start the game.
    HELP: "_HELPMODE" // The user is asking for help.
};

var animalSound = {
    kuh: {sound: "muhmuuuu mhuuu muuuu", article: 'die'},
    katze: {sound: "miau miau", article: 'die'},
    schwein: {sound: "oink oink", article: 'das'},
    huhn: {sound: "borg borg ", article: 'das'},
    hund: {sound: "wau wau wau", article: 'der'},
    pferd: {sound: "ühhhüühüüü", article: 'das'},
    frosch: {sound: "quak quak quak", article: 'der'},
    elefant: {sound: "töröö", article: 'der'},
    biene: {sound: "wau wau wau", article: 'die'},
    hummel: {sound: "zzzz", article: 'die'},
    maus: {sound: "piep piep", article: 'die'},
    uhu: {sound: "schuuhuuuhu schuuhuu", article: 'der'},
    eule: {sound: "schuuhuuuhu schuuhuu", article: 'die'},
    meerschwein: {sound: "quiek quiek", article: 'das'},
    kücken: {sound: "schiep schiep", article: 'das'},
    esel: {sound: "iaaaa iaaaaa", article: 'der'},
    ente: {sound: "nak nak nak", article: 'die'},
    vogel: {sound: "piep piep piep", article: 'der'},
    schaf: {sound: "määä määäh", article: 'das'},
    wal: {sound:'uuuuuuuuuuuuuuuuuuuu', article:'der'}
}

var Alexa = require("alexa-sdk");

exports.handler = function (event, context, callback) {
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
    'QuestionIntent': function (value) {

        //emit response directly
        var intent = this.event.request.intent
        var animal = intent && intent.slots && intent.slots.Animal && intent.slots.Animal.value;
        var article = intent && intent.slots && intent.slots.article && intent.slots.article.value;


        if (animal !== undefined) {
            if (animal === 'nein') {
                this.emit(':tell', "Alles klar, bis bald.");
            } else {
                var sound = animalSound[animal]
                console.log(sound);
                console.log(intent);
                if (article === undefined){
                    article = sound.article;
                }
                if (sound !== undefined) {
                    this.emit(':ask', sound.sound + " macht " + article + " " + animal + ". Frag mich nach einem anderen Tier oder sage Stop zum beenden.");
                }
                else {
                    console.dir("unknown animal sound detected. Plase add sound for '" + animal + "'");
                    this.emit(':ask', "Ich weiß leider nicht welchen Laut das Tier von sich gibt. Aber ich lerne immer weiter. Frag mich bald danach. Welches Tier möchtest du nun hören?");
                }

            }
        }
        else {
            console.dir("unknown animal detected. Add '" + intent + "'");
            this.emit(':ask', "Das Tier kenne ich noch nicht, aber ich lerne immer weiter. Frag mich bald danach. Welches Tier möchtest du jetzt hören?");
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
        this.emit(":tell", "OK, dann bis bald mal wieder.");
    },
    "SessionEndedRequest": function () {
        console.log("Session ended in trivia state: " + this.event.request.reason);
    }
});


const newSessionHandlers = {
    'LaunchRequest': function () {
        this.handler.state = SKILL_STATES.START;
        this.emitWithState("Intro");
    },
    "AMAZON.StartOverIntent": function () {
        this.handler.state = SKILL_STATES.START;
        this.emitWithState("StartGame", true);
    },
    "AMAZON.HelpIntent": function () {
        this.emit(":tell", "Nachdem du das Kill mit Alexa, starte wie macht, gestartet hast, kannst du beispielsweise fragen, wie macht die Katze oder wie macht der Esel. Zum beenden sage einfach Stop oder Abbrechen.");
    },
    "Unhandled": function () {
        this.emit(":tell", "Du kannst mich beispielsweise fragen wie macht die Katze, oder sage Stop zum beenden.");
    },

};

