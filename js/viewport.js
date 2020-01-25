/*
object Viewport - a container for the MapObject.
                - the viewport controls properties such as viewport size on screen.
                - the viewport has methods for mouse events.
                - the viewport exists within the confines of it's parent html element.
*/
function Viewport() {
  var MAX_X = 500;
  var MAX_Y = 500;
  
  var viewportDiv = null;
  var isDragOn = false;
  var util     = null;
  var oldXY  = null;
  var dragXY   = null;
  var offsetXY = null;
  
  var mapObject = null;
  

  
  var initialized = false;

  /*
  initialize() - initialize function for viewport object.
  input (x,y), Map coordinate that the viewport is to display.  Right now this map coordinate is placed in left top corner of viewport.
  
  */
  this.initialize = function(initx, inity) {

    this.splashLoading(1);

    this.viewportDiv = document.getElementById('viewport');
    this.util = new Util();
    this.util.initialize();
    this.mapObject = new MapObject();
    this.mapObject.initialize(this, initx, inity);

    document.onmouseup=function(){viewportObj.mouseUpEvent();};
    document.onmousemove=function(event){viewportObj.mouseMoveEvent(event);};

    this.initialized = true;
    this.splashLoading(0);
  }


  /*
    registered method for the mouse down event with the viewport. Do the following:
    1. capture current mouse coordinates (to be used for calculating drag)
    2. turn drag ON.
  */
  this.mouseDownEvent = function(e) {
    e = e || window.event; 
    
    if (this.util.nNS){ 
      e.preventDefault(); // help stop drag of images off map.
    }
    
    if (!this.util.isLeftButton(e)) return false;
    
    this.oldXY = this.util.mouseXYCoord(e);
    this.isDragOn = true;
  }
  
  
  /**
  --------------------------------------------------------------------------------------
  
  --------------------------------------------------------------------------------------
  */
  this.loadMap = function(e) {
    e = e|| window.event;
    if (this.util.nNS) {
      e.preventDefault();
    }
//    this.splashLoading(1); 

    
    var tile = e.target;
    var tileid = tile.id;
    var x = tileid.substring(1, tileid.indexOf(','));
    var y = tileid.substring((1 + tileid.indexOf(',')),tileid.indexOf(']'));
    this.mapObject.updateMap(x,y);
  }
  
  
  /*-------------------------------------------------------------------------------------
  -------------------------------------------------------------------------------------*/
  this.mouseUpEvent = function() {
    this.isDragOn = false;
  }
  
  /*-------------------------------------------------------------------------------------
  -------------------------------------------------------------------------------------*/
  this.mouseMoveEvent = function(e) {
    if (!this.isDragOn) return;
    e = e || window.event; 
    
    if (this.util.nNS){ 
      e.preventDefault(); // help stop drag of images off map.
    }
    
    this.dragXY = this.util.mouseXYCoord(e);
    this.offsetXY = {x:this.dragXY.x - this.oldXY.x, y:this.dragXY.y - this.oldXY.y};
    this.mapObject.moveMap(this.oldXY, this.dragXY);
    this.oldXY = this.util.mouseXYCoord(e);
  }
  

  this.splashLoading = function(toggle) {
    if (toggle !=0) document.getElementById('mapLoading').style.visibility = 'visible';
    else document.getElementById('mapLoading').style.visibility = 'hidden';
  }

}