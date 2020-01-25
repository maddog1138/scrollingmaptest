/*
Container for a map section. Each world map will be a grid of n*n map sections.
The section needs to keep track of how many grid elements it spans, also needs to keep track of 
the REAL map coordinates it represents (we need the starting top left corner coords.)
It also needs to keep handy the name of the DIV layer element which represents it.
*/
function MapGridObject(size, mapX, mapY, divID) {
  this.gridWidth = size;    // how wide is this container
  this.mapXcoord = mapX;    // Real map x coordinate
  this.mapYcoord = mapY;    // Real map y coodinate
  this.viewportx = 0;
  this.viewporty = 0;
  this.divID = divID;       // id of html div which represents this sector
  this.DIVSTRING = "<div id='' class='maplayer' ></div> ";
}