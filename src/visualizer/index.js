'use strict';

/**
 * Created by acastillo on 5/25/16.
 */
var SD = require('..');

exports.NMR = SD.NMR;
exports.NMR2D = SD.NMR2D;
exports.formatter = SD.formatter;
exports.JAnalyzer = SD.JAnalyzer;

//var options1D = {type:"rect", line:0, lineLabel:1, labelColor:"red", strokeColor:"red", strokeWidth:"1px", fillColor:"green"};
var options1D = {type:"rect", line:0, lineLabel:1, labelColor:"red", strokeColor:"red", strokeWidth:"1px", fillColor:"green", width:0.05, height:10,toFixed:1};
var options2D = {type:"rect",labelColor:"red", strokeColor:"red", strokeWidth:"1px", fillColor:"green", width:"6px", height:"6px"};

function annotations1D(signals, optionsG){
    var options = Object.assign({}, options1D, optionsG);
    var height = options.height;
    var annotations=[];
    for (var i=0; i<signals.length; i++) {
        var prediction=signals[i];
        var annotation={};

        annotations.push(annotation);
        annotation.line = options.line;
        annotation._highlight = prediction._highlight;
        if(!annotation._highlight || annotation._highlight.length === 0){
            annotation._highlight = [prediction.signalID];
            prediction.signal.forEach(function(signal){
                annotation._highlight.push(...signal.diaID);
            });
        }

        prediction._highlight = annotation._highlight;

        annotation.type=options.type;

        if(!prediction.to||!prediction.from||prediction.to==prediction.from){
            annotation.position=[{x:prediction.signal[0].delta-options.width, y:(options.line*height)+"px"},
                {x:prediction.signal[0].delta+options.width, y:(options.line*height+3)+"px"}];
        }
        else{
            annotation.position=[{x:prediction.to, y:(options.line*height)+"px"},
                {x:prediction.from, y:(options.line*height+3)+"px"}];
        }

        if(!options.noLabel && prediction.integral){
            annotation.label={
                text: prediction.integral.toFixed(options.toFixed),
                size: "11px",
                anchor: 'middle',
                color:options.labelColor,
                position: {x:(annotation.position[0].x+annotation.position[1].x)/2,
                    y:((options.line+options.lineLabel)*height)+"px", dy: "5px"}
            };
        }


        annotation.strokeColor=options.strokeColor;
        annotation.strokeWidth=options.strokeWidth;
        annotation.fillColor=options.fillColor;
        annotation.info=prediction;
    }
    return annotations;
} 

function annotations2D(signals2D, optionsG){
    var options = Object.assign({}, options2D, optionsG);
    var annotations=[];
    for(var k=signals2D.length-1;k>=0;k--){
        var signal = signals2D[k];
        var annotation={};
        annotation.type=options.type;
        annotation._highlight=signal._highlight;//["cosy"+k];
        if(!annotation._highlight || annotation._highlight.length === 0){
            annotation._highlight = [signal.signalID];
        }
        signal._highlight = annotation._highlight;

        annotation.position = [{x:signal.fromTo[0].from-0.01, y:signal.fromTo[1].from-0.01, dx:options.width, dy:options.height},
            {x:signal.fromTo[0].to+0.01,y:signal.fromTo[1].to+0.01}];
        annotation.fillColor=options.fillColor;
        annotation.label={text:signal.remark,
            "position": {
                "x": signal.signal[0].delta[0],
                "y": signal.signal[0].delta[1]-0.025}
        };
        if(signal.integral==1)
            annotation.strokeColor=options.strokeColor;
        else
            annotation.strokeColor="rgb(0,128,0)";

        annotation.strokeWidth=options.strokeWidth;
        annotation.width=options.width;
        annotation.height=options.height;
        annotation.info=signal;
        annotations.push(annotation);
    }
    return annotations;
}

exports.GUI = {annotations2D:annotations2D, annotations1D: annotations1D};




