/* 
GameUtility : object containing helpers for game world.

mouseXYCoord : helper function that returns {x,y} coordinate object as relative to the location on the document.

 */
class GameUtility {

  constructor () {
    let nV = null;
    console.info("Start GameUtility constructor");

    try{
      nV = this.detectUseragent();

      console.info(`navigator version ${nV}`);
      console.info("browser type is " + navigator.appName);
      this.nNS = navigator.appName == "Netscape";
      this.nIE = navigator.appName == "Microsoft Internet Explorer"
  
    } catch (err){
      console.error(`caught error: ${err}`);
    }


  }

  detectUseragent(){

    return parseInt(navigator.appVersion);
  }

  getClientWindowXY (e){
    if (e.type == "touchmove"){
      console.info(`Touch event, movement point: (${e.changedTouches[0].pageX},${e.changedTouches[0].pageY}).`);
      return {x:e.changedTouches[0].pageX,y:e.changedTouches[0].pageY};
    }

    if ( e.pageX ) {
      console.info(`Mouse event, movemement point: (${e.pageX},${e.pageY}). `);
      return {x:e.pageX, y:e.pageY};
    }

    console.info('XYcoord calculation: calculating the old way');
    return {
      x : e.clientX + document.body.scrollLeft - document.body.clientLeft,
      y : e.clientY + document.body.scrollTop - document.body.clientTop
    };
  }

  isLeftButton(e) {
    if ((this.nNS && (e.which > 1)) || (this.nIE && (e.button > 1))) {return false;}
    return true;
  }  

}

export {GameUtility};