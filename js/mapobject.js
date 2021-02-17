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



/*
  MapObject.js - this component contains the code needed to manage a map widget in the browser.
               - this component lives within the Viewport container.
               - component keeps track of the smaller tiles that make up the larger map.

500 x 10 x 5 = 5000 x 5 = 25000


methods needed: 
(1) load map tiles
(2) unload map tiles
(3) calculate what are the visible tiles in the given viewport.




*/

class GameMap {

  constructor(initx, inity){
    console.info(`GameMap constructor start`);

    try {

      this.RESOLUTION = 300; // resolution in pixels for each map tile
      this.X_Dimension = 360; // how many tiles wide is the map
      this.Y_Dimension = 180; // how many tiles tall is the map
    
      this.MAX_MAP_SIZE_X = this.RESOLUTION * this.X_Dimension;  // 500 px per sea, 50 seas wide.
      this.MAX_MAP_SIZE_Y = this.RESOLUTION * this.Y_Dimension;  // 500 px per sea, 30 seas tall.

      this.MAP = new Array(this.X_Dimension);
      var TILES = new Array();      

      this.coorinateSystem = new MapCoordinateSystem();
    
      this.ajax = new IsiegeAjax();
    
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

      this.updateMap (initx, inity); 
      this.setVisibleMapX(initx, inity);

      console.info(`GameMap constructor end successfully`);
    } catch (err){
      console.error(`GameMap constructor caught error: ${err}`);
    } finally {
    }   

  }


  listenerViewportResize(){
    console.info(`map has received viewport resize event`);

  }  

  /**
  this is the callback function that is given to the ajax routine for retrieving map tiles.
  */

  processMapData() {
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
  }  


  moveMap(oldXY, dragXY){
    console.debug(`attempting to move map coord to (${oldXY.x},${oldXY.y})`);    

    let ox = parseInt(document.getElementById('visiblemap').style.left);
    let oy = parseInt(document.getElementById('visiblemap').style.top);

    let newx = -(ox + dragXY.x - oldXY.x);
    let newy = -(oy + dragXY.y - oldXY.y);

    this.setVisibleMap(newx, newy);
  }
  
  
  /**
  
  */
  setVisibleMap(newx, newy) {
    if (newx < 0) newx = 0;
    if (newy < 0) newy = 0;
    if (newx > (this.MAX_MAP_SIZE_X - this.RESOLUTION)) newx = this.MAX_MAP_SIZE_X - this.RESOLUTION;
    if (newy > (this.MAX_MAP_SIZE_Y - this.RESOLUTION)) newy = this.MAX_MAP_SIZE_Y - this.RESOLUTION;

    console.debug(`attempting to set map coord to (${newx},${newy})`);

    document.getElementById('visiblemap').style.left = -(newx)+"px";
    document.getElementById('visiblemap').style.top  = -(newy)+"px";
  }

  
  setVisibleMapX(newx, newy) {
    newx = newx * this.RESOLUTION;
    newy = newy * this.RESOLUTION;
    this.setVisibleMap(newx, newy) 
  }
  
  
  /*
  updateMap - this function will request map data from server.  
  the input mapx, mapy values correspond to the x,y coordinates of the sea to centre the view on.
  */
  updateMap(mapx, mapy){
    
  // load up the tiles we're centering on.
  // init function input is the (x,y) coordinate of the sea we're to centre on.
  // take that value and compute the tiles around it, verify if they're loaded or not.
  
    let cssClass = 'maplayer';
    
    
    mapx = mapx -1;
    mapy = mapy -1;
    if (mapx < 0) mapx = 0;
    if (mapy < 0) mapy = 0;
    var serverRequest = "";
    var request = 1;
  
  // test if the tiles need to be loaded.
    for (let x=0; x<3; x++)
    {
      var testx = mapx+x;
      for(let y=0; y<3; y++)
      {
        var testy = mapy+y;
        
//        alert("loading map ["+testx + ","+testy+"] (" + this.MAP[testx][testy] + ")");
        
        if (this.MAP[testx][testy] < 1) { // map not loaded yet for this tile.
//          this.viewport.splashLoading(1); 
          
          serverRequest += "&sea"+request+"="+testx+""+testy;
          this.MAP[testx][testy] = 1;
          request ++;
          
//          alert("initialized map ["+testx + ","+testy+"] (" + this.MAP[testx][testy] + ")");
          
          var mapGridId = "["+ testx + "," + testy + "]";
          var mapGrid = "<div id='"+ mapGridId+"' class='"+cssClass+"' onmousedown='viewportObj.loadMap(event);' >["+testx*10+","+testy*10+"]</div> ";
          

          document.getElementById('visiblemap').innerHTML += mapGrid;

          document.getElementById(mapGridId).style.left = testx*this.RESOLUTION + 'px';
          document.getElementById(mapGridId).style.top = testy*this.RESOLUTION + 'px';
          document.getElementById(mapGridId).style.width = this.RESOLUTION + 'px';
          document.getElementById(mapGridId).style.height = this.RESOLUTION + 'px';
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

