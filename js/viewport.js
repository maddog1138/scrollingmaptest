/*
Viewport object. 

The intent of the viewport object is to become a window into the game world. The Viewport 
object is mapped directly to a DOM object which becomes its host container.  
The Viewport has the following properties:
- size in pixels on the device, inherited from the containing DOM object.
- the Viewport can react to containing DOM object resizing. 
- the Viewport intercepts mouse and touch events and translates them to game events.

                
*/

class GameMapViewport{



  // constructor parameters:
  // {initx, inity} these are the IN GAME coordinates that the viewport should center on.
  constructor(initx, inity){
    console.info(`"Start of GameMapViewport constructor with inputs: (${initx},${inity}).`);

    this.splashLoading(true);

    let isDragOn = false;

    this.viewportDiv = document.querySelector('#map_viewport');

    this.util = new GameUtility();
  

    // at this point we ask the map to load content.  
    this.mapObject = new MapObject();

    this.mapObject.initialize(this, initx, inity);

    this.viewportDiv.addEventListener('mousedown', e => this.mouseDownEvent(e));
    this.viewportDiv.addEventListener('mouseup', e => this.mouseUpEvent(e));
    this.viewportDiv.addEventListener('mousemove', e => this.mouseMoveEvent(e));
    this.viewportDiv.addEventListener('mouseout', e => this.mouseOutEvent(e));


    // document.onmouseup=function(){viewportObj.mouseUpEvent();};
    // document.onmousemove=function(event){viewportObj.mouseMoveEvent(event);};

    this.initialized = true;
    this.splashLoading(false);    

  }


  splashLoading(toggle) {
    if (toggle) document.getElementById('mapLoading').style.visibility = 'visible';
    else document.getElementById('mapLoading').style.visibility = 'hidden';
  }

  /*-------------------------------------------------------------------------------------
  mouseDownEvent(e)
    registered method for the mouse down event with the viewport. Does the following:
    1. capture current mouse coordinates (to be used for calculating drag)
    2. turn drag ON.

  -------------------------------------------------------------------------------------*/
  mouseDownEvent(e) {
    e = e || window.event; 
    
    if (this.util.nNS){ 
      e.preventDefault(); // help stop drag of images off map.
    }
    
    console.info("registered mouse down event");

    if (!this.util.isLeftButton(e)) return false;
    
    this.oldXY = this.util.mouseXYCoord(e);
    this.isDragOn = true;
  }  

  /*-------------------------------------------------------------------------------------
  -------------------------------------------------------------------------------------*/
  mouseUpEvent(e) {
    this.isDragOn = false;
    console.info("registered mouse up event");
  }

  /*-------------------------------------------------------------------------------------
  -------------------------------------------------------------------------------------*/
  mouseOutEvent(e) {
    this.isDragOn = false;
    console.info("registered mouse out event");
  }

  
  /*-------------------------------------------------------------------------------------
  -------------------------------------------------------------------------------------*/
  mouseMoveEvent(e) {
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


  /**
  --------------------------------------------------------------------------------------
  
  --------------------------------------------------------------------------------------
  */
  loadMap(e) {
    e = e|| window.event;
    if (this.util.nNS) {
      e.preventDefault();
    }
  
    let tile = e.target;
    let tileid = tile.id;
    console.info(`loadMap function tile id: ${tileid}`);
    let x = tileid.substring(1, tileid.indexOf(','));
    let y = tileid.substring((1 + tileid.indexOf(',')),tileid.indexOf(']'));
    this.mapObject.updateMap(x,y);
  }
  

}