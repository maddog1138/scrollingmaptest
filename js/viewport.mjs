/*

Viewport object. 

The Viewport object is the 'window' into the game world. Through the Viewport the user can see and
interact with the world map. The Viewport intercepts all of the user interactions with the map object. 

- reference to DOM viewport component
- size in pixels on the device, inherited from the containing DOM object.
- the Viewport can react to containing DOM object resizing. 
- the Viewport intercepts mouse and touch events and translates them to game events.

When the viewport object is created, it needs to do the following:
(1) get a reference to the DOM viewport object
(2) register a listener for the resize event
    - this is a critical event listener, as viewport resize will change the geometry of what is 
      visible on screen, and may impact what needs to be loaded.
(2) capture the dimensions of the viewport
(3) register mouse/touch events
(4) instantiate map? 


===============================================================================================
GameMapViewport:
This object is the container for the visual representation of the world map.  

Event listeners: 
mouse events for movement and clicks.
touch events for movement and touches;
                

*/

import {GameMap} from './mapobject.mjs';
import {GameUtility} from './utility.js';


class GameMapViewport{


  // ********************************************************************************
  // constructor parameters:
  // {initx, inity} these are the IN GAME coordinates that the viewport should center on.
  // TODO: work on input parameters.  Work on interactive UI controls. 
  // TODO: change the constructor inputs to reflect the true coordinate that should be in the middle of the viewport.  
  //       the coordinate needs to be passed to the map, and the map needs to figure out how to allign the tiles. 
  constructor(initialCoord){
    console.time("Viewport constructor");
    
    console.info(`Start of GameMapViewport constructor with inputs: (${initialCoord.x},${initialCoord.y}).`);
    this.isDragOn = false;
    this.initialized = false;
    
    
    try {
      
      this.splashLoading(true);

      this.util = new GameUtility();


      this.__divMapViewport = document.querySelector('#mapViewport');

      // add event listener for window resize.  Launch helper mehod viewportDimensions
      window.addEventListener('resize', e => this.viewportDimensions(e));



      // get reference to DOM viewport object and get the dimensions
      //const viewportDiv = document.querySelector('#map_viewport');
      this.viewportDimensions();
  
 

      this.addMouseEvents();

      this.addTouchEvents();

 

      // at this point we ask the map to load content.  
      this.gameMap = new GameMap( initialCoord);
      //this.mapObject.initialize(this, initx, inity);

      

  
      this.initialized = true;
      this.splashLoading(false);    
      this.showDebugInfo();
  
    } catch (err){
      console.error(`caught error: ${err}`);
    }

    console.info(`End of GameMapViewport constructor.`);
    console.timeEnd ("Viewport constructor");

  }

  addTouchEvents() {
    this.__divMapViewport.addEventListener('touchstart', e => this.mouseDownEvent(e));
    this.__divMapViewport.addEventListener('touchmove', e => this.mouseMoveEvent(e));
    this.__divMapViewport.addEventListener('touchend', e => this.mouseUpEvent(e));
    this.__divMapViewport.addEventListener('touchcancel', e => this.mouseOutEvent(e));
  }

  addMouseEvents() {
    this.__divMapViewport.addEventListener('mousedown', e => this.mouseDownEvent(e));
    this.__divMapViewport.addEventListener('mouseup', e => this.mouseUpEvent(e));
    this.__divMapViewport.addEventListener('mousemove', e => this.mouseMoveEvent(e));
    this.__divMapViewport.addEventListener('mouseout', e => this.mouseOutEvent(e));
  }



  get width(){
    return this.w;
  }

  set width(w){
    this.w = w;
  }

  get height(){
    return this.h;
  }

  set height(h){
    this.h = h;
  }

  // helper method for capturing size of viewport and dispatching a custom event for other UI components to react to the viewport resizing.
  // TODO: this method adds no value, and the synthetic event can not be sent to the children of this element (map), it can only bubble
  // upwards.  
  viewportDimensions(){
    try {
    
    this.width = this.__divMapViewport.clientWidth;
    this.height = this.__divMapViewport.clientHeight;
    console.info(`viewport dimensions:(${this.width}, ${this.height}).`);


    this.showDebugInfo();
  } catch (err){
    console.error(`caught error: ${err}`);
  }
    
  }

  showDebugInfo(){
    console.info(`Showing viewport information on screen.`);

    document.querySelector('#debugViewportWidth').value=this.width;
    document.querySelector('#debugViewportHeight').value=this.height;
  }

  /*-------------------------------------------------------------------------------------
  small utility method to throw up a "loading" message on the viewport
  -------------------------------------------------------------------------------------*/
  splashLoading(toggle) {
    if (toggle) document.getElementById('mapLoading').style.visibility = 'visible';
    else document.getElementById('mapLoading').style.visibility = 'hidden';
  }

/**
 * touchstart/mousedown capture.
 * 
 * @param e 
 */
  mouseDownEvent(e) {
    e = e || window.event; 

    console.info(`detected ${e.type} event`);
    
    if (this.util.nNS){ 
      e.preventDefault(); // help stop drag of images off map.
    }

    if(e.type == 'mousedown' && !this.util.isLeftButton(e)) return false;
  
    
    this.oldXY = this.util.getClientWindowXY(e);
    this.isDragOn = true;
  }  

  /*-------------------------------------------------------------------------------------
  -------------------------------------------------------------------------------------*/
  mouseUpEvent(e) {
    console.info(`detected ${e.type} event`);
    this.isDragOn = false;
    this.gameMap.stopMovement();
  }

  /*-------------------------------------------------------------------------------------
  -------------------------------------------------------------------------------------*/
  mouseOutEvent(e) {
    console.info(`detected ${e.type} event on ${e.target.id}`);
    if (e.target.id == 'mapViewport'){
      this.isDragOn = false;
      this.gameMap.stopMovement();
    }
  }

  
  /*-------------------------------------------------------------------------------------
  -------------------------------------------------------------------------------------*/
  mouseMoveEvent(e) {
    console.info(`detected ${e.type} event`);

    if (!this.isDragOn) return;

    e = e || window.event; 
    
    if (this.util.nNS){ 
      e.preventDefault(); // help stop drag of images off map.
    }
    
    this.dragXY = this.util.getClientWindowXY(e);
    this.mV = {x:this.dragXY.x - this.oldXY.x, y:this.dragXY.y - this.oldXY.y};

    console.info(`movement vector: (${this.mV.x},${this.mV.y}). `);

    this.gameMap.applyMovementVector(this.mV);

   // this.gameMap.moveMap(this.oldXY, this.dragXY);

    this.oldXY = this.dragXY;
  }


  /**
  --------------------------------------------------------------------------------------
  this is a potentially dead function, it may need to be moved over to the map object.
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
    let c = {x:tileid.substring(1, tileid.indexOf(',')), y : tileid.substring((1 + tileid.indexOf(',')),tileid.indexOf(']'))};
    this.gameMap.updateMap(c);
  }
  

}


export {GameMapViewport};