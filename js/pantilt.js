var mWidth = 0;
var mHeight = 0;

var mImg1;
var mImg2;

var host = location.host;
var hostname = host.split(":")[0];
var socketURL = 'http://' + hostname + ':' + '8888';
var imageURL = 'http://' + hostname + ':' + '9000/?action=snapshot';

var socket = io.connect(socketURL);

var mCount = 0;

var mCanvas;
var mCtx;

// for iOS
window.onorientationchange = function()
{
    var iR = Math.abs( window.orientation );
    if ( iR == 0 || iR == 90 ){
        resize_canvas();
    }
}

var sliderMin = 0;
var sliderMax = 255;
var sliderStep = 1;
var sliderValue = 128;

var slider1Value = sliderValue;
var slider2Value = sliderValue;

$(function() {
    var sliderHandler1 = function(e, ui){
        slider1Value = ui.value;
        socket.send(slider1Value+','+slider2Value);
    };
    var sliderHandler2 = function(e, ui){
        slider2Value = ui.value;
        socket.send(slider1Value+','+slider2Value);
    };

    $( "#slider1" ).slider({
        orientation: "vertical",
        min: sliderMin,
        max: sliderMax,
        step: sliderStep,
        value: sliderValue,
        change: sliderHandler1,
        slide: sliderHandler1
    });
    $( "#slider2" ).slider({
        orientation: "horizontal",
        min: sliderMin,
        max: sliderMax,
        step: sliderStep,
        value: sliderValue,
        change: sliderHandler2,
        slide: sliderHandler2
    });
});

function init(){
    mCanvas = document.getElementById("canvas");
    mCtx = mCanvas.getContext('2d');

    resize_canvas();

    // prevent scrolling for iOS
    document.addEventListener("touchstart", preventScroll, false);
    document.addEventListener("touchmove", preventScroll, false);
    document.addEventListener("touchend", preventScroll, false); 

    // detect rotation for Firefox
    var mqOrientation = window.matchMedia("(orientation: portrait)");
    mqOrientation.addListener(function() {
        resize_canvas();
    });
}

function resize_canvas(){

    if(window.innerWidth < window.innerHeight){
        isPortrait = true;
    }else{
        isPortrait = false;
    }

    if(isPortrait){
        mWidth = 0.9*window.innerWidth;
        mHeight = 3*mWidth/4;
    }else{
        mHeight = 0.9*window.innerHeight;
        mWidth = 4*mHeight/3;
    }

    mCanvas.width = mWidth;
    mCanvas.height = mHeight;

    $( "#slider1" ).height(mHeight);
    $( "#slider2" ).width(mWidth);

    imageSetup();
}

function imageSetup(){

    mImg1 = new Image();
    mImg2 = new Image();

    mImg1.src = imageURL+'&'+(mCount++);

    mImg1.onload = function() {
        mImg2.src = imageURL+'&'+(mCount++);
        mCtx.drawImage(mImg1, 0, 0, mWidth, mHeight);
    };

    mImg2.onload = function() {
        mImg1.src = imageURL+'&'+(mCount++);
        mCtx.drawImage(mImg2, 0, 0, mWidth, mHeight);
    };
}

function preventScroll(event) {
  if (event.touches[0].target.tagName.toLowerCase() == "li") {return;}

  event.preventDefault();
}
