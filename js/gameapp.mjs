import {GameMapViewport} from './viewport.mjs';

console.log(`start of gameapp: ${this}`);

const gameViewport = new GameMapViewport({x:10,y:90});


/**
 * Here's what we have to do for the game enginge.  
 * 1. create the viewport object
 *      a. attach mouse events to the viewport.
 *      b. attach touch events to the viewport.
 * 2. instantiate the map object
 *      a. setup the initial view of the map(?)
 */

