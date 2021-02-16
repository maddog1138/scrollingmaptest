

class MapCoordinateSystem{
    constructor(){
        console.info(`MapCoordinateSystem constructor start.`);

        try {
            this.WORLD_GUID = null;  // global id for the world (this belongs on the map object - TODO: refactor)
            this.X_BOUNDARY = null;  // number of tiles the map extends in positive axis of cartesian coordinate system
            this.Y_BOUNDARY = null;  // number of tiles the map extends in positive axis of cartesian coordinate system
            this.GRID_SIZE = null;   // number of spaces that each map tile holds in x and y axis
            this.ZOOM = 1.0;
    
            this.cartesianCoordinate = {x:0.0,y:0.0};
            this.worldCoordinate = {x:"0.0",y:"0.0"};
    
    
            this.loadCoordinateSystem();
            console.info(`MapCoordinateSystem constructor end.`);
        } catch (err){
            console.error(`MapCoordinateSystem constructor error: ${err}.`);


        } finally {
            if (DEBUG_LEVEL==5){
                console.group('Map coordinate system');
                console.info(`world boundaries: ${this.X_BOUNDARY}, ${this.Y_BOUNDARY} `);
                console.info(`world grid size: ${this.GRID_SIZE} `);
                console.groupEnd();

                

            }

        }


    }

    /* 
    This function translates a world coordinate into a tile coordinate
    input: a cartesian representation of world coordinates, where east is negative and south is negative */
    getMapTileFromWorldCoord ( coord ){
        return ({x:Math.trunc(coord.x),y:Math.trunc(coord.y)});
    }


    /* helper method for getting server side configuration for the world */
    loadCoordinateSystem(){
        this.X_BOUNDARY = 360;
        this.Y_BOUNDARY = 180;
        this.GRID_SIZE = 100;


    }

}