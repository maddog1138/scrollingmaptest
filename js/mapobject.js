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

function MapObject() {

  this.RESOLUTION = 300;
  this.X_Dimension = 50; // how many tiles wide is the map
  this.Y_Dimension = 30; // how many tiles tall is the map

  this.MAX_MAP_SIZE_X = this.RESOLUTION * this.X_Dimension;  // 500 px per sea, 50 seas wide.
  this.MAX_MAP_SIZE_Y = this.RESOLUTION * this.Y_Dimension;  // 500 px per sea, 30 seas tall.
  

  this.origin = null;
  var me = this;
  
  var ajax = null;
  
  this.MAP = new Array(this.X_Dimension);
  var TILES = new Array();
  var viewport;


  
/*
initialize() function of MapObject.
This function essentially prepares the map tray for display.
input:
p = pointer to parent object (viewport)
initx = initial X coordinate to centre on.
inity = initial Y coordinate to centre on

*/
  this.initialize = function(p, initx, inity){
    
  
  
    this.viewport = p;
    this.ajax = new IsiegeAjax();
  
    for (i=0;i<50;i++) 
    { 
      this.MAP[i] = new Array(50);
      for (j=0; j < 50; j ++)
      {
        this.MAP[i][j] = 0;
      }
    }
    TILES.push;
     
    
    this.updateMap (initx, inity); 
    this.setVisibleMapX(initx, inity);
  }
  
  /**
  this is the callback function that is given to the ajax routine for retrieving map tiles.
  */

  this.processMapData = function() {
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
  
  
  this.moveMap = function(oldXY, dragXY){

    var ox = parseInt(document.getElementById('visiblemap').style.left);
    var oy = parseInt(document.getElementById('visiblemap').style.top);

    var newx = -(ox + dragXY.x - oldXY.x);
    var newy = -(oy + dragXY.y - oldXY.y);

    this.setVisibleMap(newx, newy);
  }
  
  
  /**
  
  */
  this.setVisibleMap = function(newx, newy) {
    if (newx < 0) newx = 0;
    if (newy < 0) newy = 0;
    if (newx > (this.MAX_MAP_SIZE_X - this.RESOLUTION)) newx = this.MAX_MAP_SIZE_X - this.RESOLUTION;
    if (newy > (this.MAX_MAP_SIZE_Y - this.RESOLUTION)) newy = this.MAX_MAP_SIZE_Y - this.RESOLUTION;
    
    document.getElementById('visiblemap').style.left = -(newx)+"px";
    document.getElementById('visiblemap').style.top  = -(newy)+"px";
  }
  
  this.setVisibleMapX = function(newx, newy) {
    newx = newx * this.RESOLUTION;
    newy = newy * this.RESOLUTION;
    this.setVisibleMap(newx, newy) 
  }
  
  
  /*
  the input mapx, mapy values correspond to the x,y coordinates of the sea to centre the view on.
  */
  this.updateMap = function(mapx, mapy){
    
  // load up the tiles we're centering on.
  // init function input is the (x,y) coordinate of the sea we're to centre on.
  // take that value and compute the tiles around it, verify if they're loaded or not.
  
    let cssClass = 'maplayer';
    if (this.viewport.util.nIE) {  // small fixes for IE presentation
      cssClass = 'iemapstyle';
    }
    
    
    mapx = mapx -1;
    mapy = mapy -1;
    if (mapx < 0) mapx = 0;
    if (mapy < 0) mapy = 0;
    var serverRequest = "";
    var request = 1;
  
  // test if the tiles need to be loaded.
    for (x=0; x<3; x++)
    {
      var testx = mapx+x;
      for(y=0; y<3; y++)
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