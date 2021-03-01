

function toRad (d){
  return d*(Math.PI/180);
}

function isEven (n){
  return !(n % 2);
}

const div_id = '#hexTray';

const _DEGREE_WIDTH_IN_HEX_ = 10;
const _DEGREE_HEIGHT_IN_HEX_ = 10;

const HEX_WIDTH = 100;                                         // hex width edge to edge
const HEX_R = HEX_WIDTH / 2;                                   // width divided by 2
const HEX_H = Math.round( Math.tan( toRad( 30 ) ) * HEX_R );   // height of triangle on top or bottom of hexagon
const HEX_S = Math.round( HEX_H / Math.sin( toRad(30) ) );     // height of the side of the hexagon
const HEX_HEIGHT = Math.round(HEX_S + (HEX_H*2));              // full height of the hexagon


class HexTray {

    constructor (viewportSize) {

      console.info("Start HexTray constructor");
      try{

        this.__hexTray = document.querySelector(div_id);
        this.__hexTray.style.backgroundSize = HEX_WIDTH + 'px';


        this.initialAnchor = {x: - viewportSize.width, y: - viewportSize.height};

        this.visibleHexAcross = viewportSize.width / HEX_WIDTH;



        this.traySize(viewportSize);
        this.anchorToPoint(this.initialAnchor);

        console.group(`hexTray configuration report`)
        console.info (`hexTray size is (${this.__hexTray.clientWidth},${this.__hexTray.clientHeight})`);
        console.info (`hexTray anchor is (${this.__hexTray.offsetLeft},${this.__hexTray.offsetTop})`);
        console.info (`number of hex visible on screen is ${this.visibleHexAcross}`);
        console.info (`hexagon width is ${HEX_WIDTH}, hexagon height is ${HEX_HEIGHT}, effective height is ${Math.round(HEX_S+HEX_H)}`);
        console.groupEnd();

    
      } catch (err){console.error(`caught error: ${err}`)}
  
  
    }

    traySize(viewportSize){
      this.__hexTray.setAttribute('height', viewportSize.height * 3);
      this.__hexTray.style.width = viewportSize.width * 3 + 'px';
      this.__hexTray.style.height = viewportSize.height * 3 + 'px';
    }

    recalibrate(){
      // 1. calcluate offset from initialAnchor to current position.  
      let xOffset = this.__hexTray.offsetLeft - this.initialAnchor.x;
      let yOffset = this.__hexTray.offsetTop - this.initialAnchor.y;

      // 2. count how many hexes will fit into that offset.  
      let xHexOffset = Math.round (xOffset / HEX_WIDTH );
      let yHexOffset = Math.round (yOffset / (HEX_S+HEX_H));

      // 3. if hexes > 0, move the hex tile by that amount.  


      if (Math.abs(yHexOffset) >= 1) {
        this.__hexTray.style.top = Math.round(this.__hexTray.offsetTop - (HEX_S+HEX_H)*yHexOffset) + 'px';
      }


      if (Math.abs(xHexOffset) >= 1) {
        if (isEven(yHexOffset)) {
          this.__hexTray.style.left = Math.round(this.__hexTray.offsetLeft - (HEX_WIDTH*xHexOffset)) + 'px';
        } else {
          this.__hexTray.style.left = Math.round(this.__hexTray.offsetLeft - (HEX_WIDTH*xHexOffset)) + HEX_R + 'px';
        }
      }



     // this.__hexTray.style.top = this.__hexTray.offsetTop - (Math.round(HEX_S+HEX_H) * 10) + 'px';

    }

    anchorToPoint(point){
      this.__hexTray.style.left = point.x + 'px';
      this.__hexTray.style.top = point.y + 'px';
    }

    moveByVector(vector){
      this.__hexTray.style.left = this.__hexTray.offsetLeft + vector.x + 'px';
      this.__hexTray.style.top = this.__hexTray.offsetTop + vector.y + 'px';
    }
  
  }
  
  export {HexTray as HexTray};
