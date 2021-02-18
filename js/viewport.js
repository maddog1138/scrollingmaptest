/*

Viewport object. 

The intent of the viewport object is to become a window into the game world. The Viewport 
object is mapped directly to a DOM object which becomes its host container.  
The Viewport has the following properties:
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

                
*/



class GameMapViewport{


  // ********************************************************************************
  // constructor parameters:
  // {initx, inity} these are the IN GAME coordinates that the viewport should center on.
  // TODO: work on input parameters.  Work on interactive UI controls. 
  // TODO: change the constructor inputs to reflect the true coordinate that should be in the middle of the viewport.  
  //       the coordinate needs to be passed to the map, and the map needs to figure out how to allign the tiles. 
  constructor(initx, inity){
    console.time("Viewport constructor");
    
    console.info(`Start of GameMapViewport constructor with inputs: (${initx},${inity}).`);
    this.isDragOn = false;
    this.initialized = false;
    this.width = 0;
    this.height = 0;
    
    
    try {
      
      this.splashLoading(true);



      // get reference to DOM viewport object and get the dimensions
      this.viewportDiv = document.querySelector('#map_viewport');
      this.viewportDimensions();
  
      console.info(`viewport width. ${this.width}, ${this.height}`);

      
      this.util = new GameUtility();
    
  

      //the following are mouse events for movement of map
      this.viewportDiv.addEventListener('mousedown', e => this.mouseDownEvent(e));
      this.viewportDiv.addEventListener('mouseup', e => this.mouseUpEvent(e));
      this.viewportDiv.addEventListener('mousemove', e => this.mouseMoveEvent(e));
      this.viewportDiv.addEventListener('mouseout', e => this.mouseOutEvent(e));

      this.viewportDiv.addEventListener('touchstart', e => this.mouseDownEvent(e));
      this.viewportDiv.addEventListener('touchmove',e => this.mouseMoveEvent(e));
      this.viewportDiv.addEventListener('touchend', e => this.mouseUpEvent(e));
      this.viewportDiv.addEventListener('touchcancel', e => this.mouseOutEvent(e));

      // add event listener for window resize.  Launch helper mehod viewportDimensions
      window.addEventListener('resize', e => this.viewportDimensions(e));
 

      // at this point we ask the map to load content.  
      this.mapObject = new GameMap( initx, inity, this.width, this.height);
      //this.mapObject.initialize(this, initx, inity);

      //this.viewportDiv.addEventListener("resizeViewportEvent", this.mapObject.listenerViewportResize(),false);

  
      this.initialized = true;
      this.splashLoading(false);    
      this.showDebugInfo();
  
    } catch (err){
      console.error(`caught error: ${err}`);
    }

    console.info(`End of GameMapViewport constructor.`);
    console.timeEnd ("Viewport constructor");

  }


  // helper method for capturing size of viewport and dispatching a custom event for other UI components to react to the viewport resizing.
  viewportDimensions(){

    //TODO: Document why a synthetic resize viewport event is triggered here.  
    
    this.width = this.viewportDiv.clientWidth;
    this.height = this.viewportDiv.clientHeight;

    this.viewportDiv.dispatchEvent(new CustomEvent('gameViewportResize', { detail : {width:this.width, height:this.height }}));


    this.showDebugInfo();
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

  /*-------------------------------------------------------------------------------------
  mouseDownEvent(e)
    registered method for the mouse down event with the viewport. Does the following:
    1. capture current mouse coordinates (to be used for calculating drag)
    2. turn drag ON.

  -------------------------------------------------------------------------------------*/
  mouseDownEvent(e) {
    console.info(`detected ${e.type} event`);
    e = e || window.event; 
    
    if (this.util.nNS){ 
      e.preventDefault(); // help stop drag of images off map.
    }

    if(e.type == 'mousedown' && !this.util.isLeftButton(e)) return false;
  
    
    this.oldXY = this.util.mouseXYCoord(e);
    this.isDragOn = true;
  }  

  /*-------------------------------------------------------------------------------------
  -------------------------------------------------------------------------------------*/
  mouseUpEvent(e) {
    console.info(`detected ${e.type} event`);
    this.isDragOn = false;
  }

  /*-------------------------------------------------------------------------------------
  -------------------------------------------------------------------------------------*/
  mouseOutEvent(e) {
    console.info(`detected ${e.type} event`);
    this.isDragOn = false;
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
    
    this.dragXY = this.util.mouseXYCoord(e);
    this.offsetXY = {x:this.dragXY.x - this.oldXY.x, y:this.dragXY.y - this.oldXY.y};
    this.mapObject.moveMap(this.oldXY, this.dragXY);
    this.oldXY = this.util.mouseXYCoord(e);
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
    let x = tileid.substring(1, tileid.indexOf(','));
    let y = tileid.substring((1 + tileid.indexOf(',')),tileid.indexOf(']'));
    this.mapObject.updateMap(x,y);
  }
  

}