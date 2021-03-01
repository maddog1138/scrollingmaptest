/*############################################################################

    Copyright 2021 Mike Mytkowski

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

############################################################################*/

import { HexTray } from "./hextray.mjs";

const seaTray = '#seaTray';


/*
  MapObject.js - this component contains the code needed to manage a map widget in the browser.
               - this component lives within the Viewport container.
               - component keeps track of the smaller tiles that make up the larger map.
==========================================================
*/

/**
 * GameMap object.  
 * 
 * During initial setup, the object needs to initialize the following key compoents:
 * (1) Background tray that displays the visual hexagon map.  The tray needs to have the following properties/capabilties:
 *   (a) The background tray must be at least 3 x the size of the viewport.  this is to allow for the user to scroll the entire 
 *       length of the viewport without loosing the hex background. 
 *   (b) The background tray needs to react to user movement in realtime.
 *   (c) Upon stop of movement by user, the background tray needs to re-position iself to once again be centred on the viewport.  
 *       The repositioning needs to be aligned to current hex placement (should be smooth and invisible to user)
 * 
 * (2) World tiles are loaded to a tile tray represent each 1x1 degree of the world map. 
 *   (a) Visible world tiles are calculated based on viewport dimensions, tile resolution, and current focused world coordinate. 
 *   (b) Visible world tiles are anchored to an absolute coordinate within the tile tray
 *   (c) The tile tray needs to react to user movement in realtime. 
 */




class GameMap {

  /*
  constructor
  - calculate the size of the map component based on viewport size. 
  - register the object to listen to viewport resize events.  
  */
  constructor(initialCoord){
    console.info(`GameMap constructor start`);

    try {
      this._viewport = document.querySelector('#mapViewport');
      //this.coorinateSystem = new MapCoordinateSystem();


      console.info(`viewport dimensions are (width:${this._viewport.clientWidth}, height:${this._viewport.clientHeight})`);



      // TODO: the following constants will need to be re-visited.  Probably better to externalize this data
      // into a configuration object.  
      this.X_RESOLUTION = 500; // resolution in pixels for each map tile
      this.Y_RESOLUTION = 433; // resolution in pixels for each map tile
      this.X_Dimension = 360; // how many tiles wide is the map
      this.Y_Dimension = 180; // how many tiles tall is the map
    
      this.MAX_MAP_SIZE_X = this.X_RESOLUTION * this.X_Dimension;  
      this.MAX_MAP_SIZE_Y = this.Y_RESOLUTION * this.Y_Dimension;  

      this.hexTray = new HexTray({width:this._viewport.clientWidth, height:this._viewport.clientHeight});


      // TODO: need to figure out the correct sequence of where this belongs.
      this._gameMapDiv = document.querySelector(seaTray);      

      console.info(`we have a reference to seaTray`);


//      this.map_div.addEventListener('gameViewportResize', e => { console.log(`Resize event reports viewport is now (${e.detail.width},${e.detail.height})`), true});

//     console.info(`from within map: viewport width ${viewportObj.width}`);


      this.MAP = new Array(this.X_Dimension);
      var TILES = new Array();      

    
      //this.ajax = new IsiegeAjax();
    
      // TODO: investigate why this loop initializes the whole array to zero.
      for (let x = 0; x < this.X_Dimension; x++) 
      { 
        this.MAP[x] = new Array(this.Y_Dimension);
        for (let y=0; y < this.Y_Dimension; y ++)
        {
          this.MAP[x][y] = 0;
        }
      }

      
      //
      // TODO: map needs to have a method to figure out what are the visible tiles.  

      this.updateMap (initialCoord); 
      this.setVisibleMapX(initialCoord);

      console.info(`GameMap constructor end successfully`);
    } catch (err){
      console.error(`GameMap constructor caught error: ${err}`);
    } finally {
    }   

  }


  stopMovement(){
    this.hexTray.recalibrate();
  }


  applyMovementVector(vector){

    this.hexTray.moveByVector(vector);


  }


  listenerViewportResize(){
    console.info(`map has received viewport resize event`);

  }  

  /**
  this is the callback function that is given to the ajax routine for retrieving map tiles.
  */

  processMapData() {
/*    
    var httpRequest = me.ajax.getXmlHttp();
    if (httpRequest.readyState == 4) {
      if (httpRequest.status == 200) {
        var xmldoc = httpRequest.responseXML.documentElement;
        
        var sea = xmldoc.getElementsByTagName("sea");
        for(s=0; s<sea.length;s++) {
          var txt = "";
          var isle=sea[s].getElementsByTagName("isle");
          var islands = isle[0].getElementsByTagName("i");
          var seanamex = parseInt(sea[s].attributes.getNamedItem('x').nodeValue); 
          var seanamey = parseInt(sea[s].attributes.getNamedItem('y').nodeValue);
          if (me.MAP[seanamex][seanamey]==1) { 
  //            alert("Loading ["+seanamex + ","+seanamey+"] (" + me.MAP[seanamex][seanamey] + ")");
            for (i=0; i<islands.length; i++){
              var iname = islands[i].attributes.getNamedItem("name").nodeValue;
              var ix = parseInt(islands[i].attributes.getNamedItem("x").nodeValue);
              var iy = parseInt(islands[i].attributes.getNamedItem("y").nodeValue);
              //TODO: apply viewport size multiplier from viewport.js here.
              ix = ix * 10; // 50 is multiplier for viewport, 5 is offset for island size (island size is 40px.
              iy = iy * 10;
              txt += "<img class='sampleisland' style='top:"+iy+"%;left:"+ix+"%;' src='/island04.png' title='"+iname+"' />";
            }
            
            var seaname = "["+seanamex+","+seanamey+"]";
            document.getElementById(seaname).innerHTML += txt;
            me.MAP[seanamex][seanamey]=2;
  //            alert("Loaded ["+seanamex + ","+seanamey+"] (" + me.MAP[seanamex][seanamey] + ")");
            
          }
        }
      }
      me.viewport.splashLoading(0);     
    }
    */
  }  


  moveMap(oldXY, dragXY){
    console.debug(`attempting to move map coord to (${oldXY.x},${oldXY.y})`);    

    let ox = parseInt(document.getElementById('seaTray').style.left);
    let oy = parseInt(document.getElementById('seaTray').style.top);

    let newx = -(ox + dragXY.x - oldXY.x);
    let newy = -(oy + dragXY.y - oldXY.y);

    this.setVisibleMap(newx, newy);
  }
  
  
  /**
  
  */
  setVisibleMap(c) {
    console.debug(`setVisibleMap, input is: (${c.x},${c.y})`);

    if (c.x < 0) c.x = 0;
    if (c.y < 0) c.y = 0;
    if (c.y > (this.MAX_MAP_SIZE_X - this.X_RESOLUTION)) newx = this.MAX_MAP_SIZE_X - this.X_RESOLUTION;
    if (c.y > (this.MAX_MAP_SIZE_Y - this.Y_RESOLUTION)) newy = this.MAX_MAP_SIZE_Y - this.Y_RESOLUTION;

    console.debug(`attempting to set map coord to (${c.x},${c.y})`);

    document.getElementById('seaTray').style.left = -(c.x)+"px";
    document.getElementById('seaTray').style.top  = -(c.y)+"px";
  }

  
  setVisibleMapX(c) {
    c.x = c.x * this.X_RESOLUTION;
    c.y = c.y * this.Y_RESOLUTION;
    this.setVisibleMap(c) 
  }
  
  
  /*
  updateMap - this function will request map data from server.  
  the input mapx, mapy values correspond to the x,y coordinates of the sea to centre the view on.
  */
  updateMap(c){
    
  // load up the tiles we're centering on.
  // init function input is the (x,y) coordinate of the sea we're to centre on.
  // take that value and compute the tiles around it, verify if they're loaded or not.
  
    let cssClass = 'maplayer';
    
    
    c.x = c.x -1;
    c.y = c.y -1;
    if (c.x < 0) c.x = 0;
    if (c.y < 0) c.y = 0;
    var serverRequest = "";
    var request = 1;
  
  // test if the tiles need to be loaded.
    for (let x=0; x<3; x++)
    {
      var testx = c.x+x;
      for(let y=0; y<3; y++)
      {
        var testy = c.y+y;
        
//        alert("loading map ["+testx + ","+testy+"] (" + this.MAP[testx][testy] + ")");
        
        if (this.MAP[testx][testy] < 1) { // map not loaded yet for this tile.
//          this.viewport.splashLoading(1); 
          
          serverRequest += "&sea"+request+"="+testx+""+testy;
          this.MAP[testx][testy] = 1;
          request ++;
          
//          alert("initialized map ["+testx + ","+testy+"] (" + this.MAP[testx][testy] + ")");
          
          var mapGridId = "["+ testx + "," + testy + "]";
          var mapGrid = "<div id='"+ mapGridId+"' class='"+cssClass+"'>["+testx*10+","+testy*10+"]</div> ";
          

          document.getElementById('seaTray').innerHTML += mapGrid;

          document.getElementById(mapGridId).style.left = testx*this.X_RESOLUTION + 'px';
          document.getElementById(mapGridId).style.top = testy*this.Y_RESOLUTION + 'px';
          document.getElementById(mapGridId).style.width = this.X_RESOLUTION + 'px';
          document.getElementById(mapGridId).style.height = this.Y_RESOLUTION + 'px';
        }
      }
    }
    
    if (serverRequest.length > 0)
    {
//      alert (serverRequest);

    
      //**************************************************************************
      // fire off the request to server to get map data.
      // TODO: server string will need to be dynamic.
     // this.ajax.fireRequest("/cgi-bin/dwlcgi?a=isiegeGetMapData", serverRequest, me.processMapData);
    } else {

    }

  }  

}

  

export {GameMap};

