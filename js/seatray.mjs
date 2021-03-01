

const seaTray = '#seaTray';

class SeaTray {

    constructor () {

      console.info("Start SeaTray constructor");
      try{

        this.__seaTray = document.querySelector(seaTray);

    
      } catch (err){
        console.error(`caught error: ${err}`);
      }
  
  
    }

    set domAnchor(vector){
      this.__seaTray.x += vector.x;
      this.__seaTray.y += vector.y;
    }

    
  
  
  }
  
  export {SeaTray};
