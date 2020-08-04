/*


*/

function Util() {

  var DEBUG_CONTAINER = document.getElementById('isDebug');
  
  var mouseXY = null;
  var nV = 0;
  var nNS = false;
  var nIE = false;
  

  this.mouseXYCoord = function(e){
    if ( e.pageX ) {
      return {x:e.pageX, y:e.pageY};
    }
    return {
      x : e.clientX + document.body.scrollLeft - document.body.clientLeft,
      y : e.clientY + document.body.scrollTop - document.body.clientTop
    };
  }
  
  this.isLeftButton = function(e) {
    if ((this.nNS && (e.which > 1)) || (this.nIE && (event.button > 1))) {return false;}
    return true;
  }
  
  this.initialize = function() {
    this.nV = parseInt(navigator.appVersion);
    alert(navigator.appName);
    this.nNS = navigator.appName == "Netscape";
    this.nIE = navigator.appName == "Microsoft Internet Explorer"
  
  }

} 

/* 
GameUtility : object containing helpers for game world.

mouseXYCoord : helper function that returns {x,y} coordinate object as relative to the location on the user agent.

 */
class GameUtility {
  constructor () {
    this.nV = parseInt(navigator.appVersion);
    console.info("browser type is " + navigator.appName);
    this.nNS = navigator.appName == "Netscape";
    this.nIE = navigator.appName == "Microsoft Internet Explorer"
  }

  mouseXYCoord (e){
    if ( e.pageX ) {
      return {x:e.pageX, y:e.pageY};
    }
    return {
      x : e.clientX + document.body.scrollLeft - document.body.clientLeft,
      y : e.clientY + document.body.scrollTop - document.body.clientTop
    };
  }

  isLeftButton(e) {
    if ((this.nNS && (e.which > 1)) || (this.nIE && (event.button > 1))) {return false;}
    return true;
  }  

}
