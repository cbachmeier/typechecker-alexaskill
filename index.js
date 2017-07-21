var Alexa = require('alexa-sdk');

exports.handler = function(event, context, callback){
    var alexa = Alexa.handler(event, context, callback);
    alexa.registerHandlers(newSessionHandler);
    alexa.execute();
};

var effectiveAgainst={
    "bug": ["grass","psychic","dark"],
    "dragon": ["dragon"],
    "ice": ["grass","ground","flying","dragon"],
    "electric":["water","flying"],
    "fighting": ["normal","ice","rock","dark","steel"],
    "fire": ["grass","ice","bug","steel"],
    "flying": ["grass","fighting","bug"],
    "grass": ["water","ground","rock"],
    "ghost": ["psychic","ghost"],
    "ground": ["fire","electric","poison","rock","steel"],
    "normal": [],
    "poison": ["grass","fairy"],
    "psychic": ["fighting","poison"],
    "rock": ["fire","ice","flying","bug"],
    "water": ["fire","ground","rock"],
    "dark": ["psychic","ghost"],
    "steel": ["ice","rock","fairy"],
    "fairy": ["fighting","dragon","dark"]
};
var notEffectiveAgainst={
    "bug": ["fire","fighting","poison","flying","ghost","steel"],
    "dragon": ["steel"],
    "ice": ["fire","water","ice","steel"],
    "electric": ["electric","grass","dragon"],
    "fighting": ["poison","flying","psychic","bug","fairy"],
    "fire": ["fire","water","rock","dragon"],
    "flying": ["electric","rock","steel"],
    "grass": ["fire","grass","poison","flying","bug","dragon"],
    "ghost": ["dark"],
    "ground": ["grass","bug"],
    "normal": ["rock","steel"],
    "poison": ["poison","ground","rock","ghost"],
    "psychic": ["psychic","steel"],
    "rock": ["fighting","ground","steel"],
    "water": ["water","grass","dragon"],
    "dark": ["fighting","dark","fairy"],
    "steel": ["fire","water","electric","steel"],
    "fairy": ["fire","poison","steel"]
};

var noEffectAgainst={
    "dragon": ["fairy"],
    "electric": ["ground"],
    "fighting": ["ghost"],
    "ground": ["flying"],
    "ghost": ["normal"],
    "normal": ["ghost"],
    "poison": ["steel"],
    "psychic": ["dark"]
};


var helpMessage = "Please ask what a type is super effective against or not very effective against";
var goodbyeMessage = "Okay, leaving Type Advantage";
var errorMessage = "I'm sorry, I don't recognize that type. Please try a different one.";

var newSessionHandler = {
    'LaunchRequest': function () {
        this.emit(':ask', helpMessage);
    },
    //when asking what types a given type is super effective against
    'EffectiveIntent': function () {
        var type = this.event.request.intent.slots.type.value;
        if (!type){
            this.emit(':ask',errorMessage,helpMessage);
        }
        type=type.toLowerCase();
        if (type in effectiveAgainst){
            if (type=="normal"){
                this.emit(':tell',"Normal is not super effective against any Pokemon types.");
            }
            else {
                var message=type+" is super effective against ";
                var effectiveTypes = effectiveAgainst[type]
                if (effectiveTypes.length>1) {
                    for (i = 0; i < effectiveTypes.length - 1; i++) {
                        message += effectiveTypes[i] + " ";
                    }
                    message += "and " + effectiveTypes[effectiveTypes.length - 1]
                }
                else {
                    message+=effectiveTypes[0];
                }
                this.emit(':ask',message + ". Please ask for another type.",helpMessage)
            }
        }
        else{
            this.emit(':ask',errorMessage,helpMessage)
        }
    },
    //when asking what types a given type is not effective against
    'NotEffectiveIntent': function () {
        var type = this.event.request.intent.slots.type.value;
        if (!type){
            this.emit(':ask',errorMessage,helpMessage);
        }
        type=type.toLowerCase();
        if (type in notEffectiveAgainst){
            var message=type+" is not very effective against ";
            var notEffectiveTypes = notEffectiveAgainst[type]
            if (notEffectiveTypes.length>1) {
                for (i = 0; i < notEffectiveTypes.length - 1; i++) {
                    message += notEffectiveTypes[i] + " ";
                }
                message += "and " + notEffectiveTypes[notEffectiveTypes.length - 1];
            }
            else {
                message+=notEffectiveTypes[0]
            }
            if (type in noEffectAgainst){
                message+=". "+type+" also has no effect against "+noEffectAgainst[type][0];
            }
            this.emit(':ask',message + ". Please ask for another type.",helpMessage)
        }
        else{
            this.emit(':ask',errorMessage,helpMessage)
        }
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', helpMessage);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell',goodbyeMessage);
    }, 
    'SessionEndedRequest': function () {
        this.emit(':tell',goodbyeMessage);
    },
    'Unhandled': function () {
        this.emit(':ask', errorMessage,helpMessage);
    }
};