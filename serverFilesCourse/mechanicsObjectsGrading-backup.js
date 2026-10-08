define(["sylvester", "PrairieGeom", ], function(Sylvester, PrairieGeom) {
	
    var $V = Sylvester.Vector.create;
	var $M = Sylvester.Matrix.create;
	
	var mechanicsObjectsGrading = {};	
       
	// ================================================================================	
    // Grading functions
	// ================================================================================	
	mechanicsObjectsGrading.CheckToleranceFBDObjects = function(feedback, objects, objectsTrue, i, j, k) {
		
		var BreakFor = false;
		
		if (objects[i].left < objectsTrue[j].LeftUp && 
			objects[i].left > objectsTrue[j].LeftLower) {									
				
			if (objects[i].top < objectsTrue[j].TopUp && 
				objects[i].top > objectsTrue[j].TopLower) {
					objectsTrue[j].found = true;
					objectsTrue[j].left = objects[i].left,
					objectsTrue[j].top = objects[i].top,
					objects[i].found = true;
					BreakFor = true;
			}
		}
		return (BreakFor);
	};
	// ================================================================================			
	mechanicsObjectsGrading.CheckToleranceControlledLineObjects = function(feedback, objects, objectsTrue, i, j, k) {
		
		var BreakFor = false;
		var angleDegreeTol = 3;	
		
		var pos = [0,1,0];
		
		for(var m=0;m<2;m++) {
			
			if (objects[i].y1Global < objectsTrue[j].yUp[pos[m]] && objects[i].y1Global > objectsTrue[j].yLower[pos[m]]) {

				if ( objects[i].x1Global < objectsTrue[j].xUp[pos[m]] && objects[i].x1Global > objectsTrue[j].xLower[pos[m]] ) {	
				
					if (objects[i].y2Global < objectsTrue[j].yUp[pos[m+1]] && objects[i].y2Global > objectsTrue[j].yLower[pos[m+1]]) {

						if ( objects[i].x2Global < objectsTrue[j].xUp[pos[m+1]] && objects[i].x2Global > objectsTrue[j].xLower[pos[m+1]] ) {	

							if (objectsTrue[j].slope == 'zero') {	
                                if (Math.abs(objects[i].slope) < angleDegreeTol) {
									objectsTrue[j].found = true;                                
									objects[i].found = true;	
									BreakFor = true;
								}	
								else {
									feedback.slope.push("Found object " + objectsTrue[j].feedbackName + " but slope is incorrect");
								}
							}							
							else if (objectsTrue[j].slope == 'positive') {	                        
								if (objects[i].slope < -angleDegreeTol && objects[i].slope > -90) {
									objectsTrue[j].found = true;
									objects[i].found = true;			
									BreakFor = true;
								}	
								else {
									feedback.slope.push("Found object " + objectsTrue[j].feedbackName + " but slope is incorrect");
								}
							}							
							else if (objectsTrue[j].slope == 'negative') {	
								if (objects[i].slope > angleDegreeTol && objects[i].slope < 90) {
									objectsTrue[j].found = true;
									objects[i].found = true;			
									BreakFor = true;
								}	
								else {
									feedback.slope.push("Found object " + objectsTrue[j].feedbackName + " but slope is incorrect");
								}
							}							
							else {
								console.log('error: need to set slope property');
							}
                            
                            if (objectsTrue[j].found) {
                                    objectsTrue[j].x1 =  objects[i].x1Global;   
                                    objectsTrue[j].x2 =  objects[i].x2Global;   
                                    objectsTrue[j].y1 =  objects[i].y1Global;   
                                    objectsTrue[j].y2 =  objects[i].y2Global;   
                            }                                    
						}
					}
				}
			}
			if (BreakFor) break;
		}
		return (BreakFor);
	};	
    // ================================================================================			
	mechanicsObjectsGrading.CheckToleranceControlledCurvedLineObjects = function(feedback, objects, objectsTrue, i, j, k) {
		
		var BreakFor = false;
		var angleDegreeTol = 3;	
        
        var y3max = ((objects[i].y2Global-objects[i].y1Global)/(objects[i].x2Global-objects[i].x1Global))*(objects[i].x3Global - objects[i].x1Global ) + objects[i].y1Global;		
        
		var pos = [0,1,0];
		for(var m=0;m<2;m++) {
			
			if (objects[i].y1Global < objectsTrue[j].yUp[pos[m]] && objects[i].y1Global > objectsTrue[j].yLower[pos[m]]) {

				if ( objects[i].x1Global < objectsTrue[j].xUp[pos[m]] && objects[i].x1Global > objectsTrue[j].xLower[pos[m]] ) {	
				
					if (objects[i].y2Global < objectsTrue[j].yUp[pos[m+1]] && objects[i].y2Global > objectsTrue[j].yLower[pos[m+1]]) {

						if ( objects[i].x2Global < objectsTrue[j].xUp[pos[m+1]] && objects[i].x2Global > objectsTrue[j].xLower[pos[m+1]] ) {	
                      
							if (objectsTrue[j].slope[0] == 'positive') { // - 90 < slope < 0                       
								if (objects[i].slope < -angleDegreeTol && objects[i].slope > -90) {
                                    if (objectsTrue[j].slope[1] == 'decreasing') {
                                        if (objects[i].y3Global < y3max) {                                        
                                            objectsTrue[j].found = true;
                                            objects[i].found = true;			
                                            BreakFor = true;
                                        }
                                        else {
                                            feedback.slope.push("Found object " + objectsTrue[j].feedbackName + " but needs to check curvature");
                                        }
                                    }
                                    else if (objectsTrue[j].slope[1] == 'increasing') {
                                        if (objects[i].y3Global > y3max) {                                        
                                            objectsTrue[j].found = true;
                                            objects[i].found = true;			
                                            BreakFor = true;
                                        }
                                        else {
                                            feedback.slope.push("Found object " + objectsTrue[j].feedbackName + " but needs to check curvature");
                                        }
                                    }
								}	
								else {
									feedback.slope.push("Found object " + objectsTrue[j].feedbackName + " but slope is incorrect");
								}
							}							
							else if (objectsTrue[j].slope[0] == 'negative') {	// 0 < slope < 90
								if (objects[i].slope > angleDegreeTol && objects[i].slope < 90) {
                                    if (objectsTrue[j].slope[1] == 'decreasing') {
                                        if (objects[i].y3Global > y3max) {                                        
                                            objectsTrue[j].found = true;
                                            objects[i].found = true;			
                                            BreakFor = true;
                                        }
                                        else {
                                            feedback.slope.push("Found object " + objectsTrue[j].feedbackName + " but needs to check curvature");
                                        }
                                    }
                                    else if (objectsTrue[j].slope[1] == 'increasing') {
                                        if (objects[i].y3Global < y3max) {                                        
                                            objectsTrue[j].found = true;
                                            objects[i].found = true;			
                                            BreakFor = true;
                                        }
                                        else {
                                            feedback.slope.push("Found object " + objectsTrue[j].feedbackName + " but needs to check curvature");
                                        }
                                    }
								}	
								else {
									feedback.slope.push("Found object " + objectsTrue[j].feedbackName + " but slope is incorrect");
								}
							}	

                            
							else {
								console.log('error: need to set slope property');
							}
                            
                            if (objectsTrue[j].found) {
                                    objectsTrue[j].x1 =  objects[i].x1Global;   
                                    objectsTrue[j].x2 =  objects[i].x2Global;   
                                    objectsTrue[j].y1 =  objects[i].y1Global;   
                                    objectsTrue[j].y2 =  objects[i].y2Global;   
                            }                                    
						}
					}
				}
			}
			if (BreakFor) break;
		}
		return (BreakFor);
	};	

    // ================================================================================		
 	mechanicsObjectsGrading.ProcessObjects = function(objects, RequiredObjects, OptionalObjects, feedback) {
		
        var breakForLoop = false;
		
		for (var i = 0; i < RequiredObjects.length; i++) { 
			RequiredObjects[i].found = false;
		}
		for (var i = 0; i < OptionalObjects.length; i++) { 
			OptionalObjects[i].found = false;
		}
		
		// Loops over all objects on canvas and disregards "undefined" objects (given objects)
		for (var i = 0; i < objects.length; i++) {  

			if (objects[i].name	=== undefined) {
				objects[i].found = true;
				continue;	
			}	
            
            breakForLoop = false;
			objects[i].found = false;
			
			LoopRequiredObjects: // trying to find object among required objects
			for (var j = 0; j < RequiredObjects.length; j++) { 			
				if (RequiredObjects[j].found == false) {		
					for (var k = 0; k < RequiredObjects[j].name.length; k++) { 								   
						if (objects[i].name == RequiredObjects[j].name[k]) {
							// For straight lines in the V-M diagrams
							// --------------------------------------------------------------
							if (RequiredObjects[j].name[k] == 'controlledLine') {
								breakForLoop = mechanicsObjectsGrading.CheckToleranceControlledLineObjects (feedback, objects, RequiredObjects, i, j, k);
								if (breakForLoop)  break LoopRequiredObjects;
							}
							// For straight lines in the V-M diagrams
							// --------------------------------------------------------------
							else if (RequiredObjects[j].name[k] == 'controlledCurvedLine') {
								breakForLoop = mechanicsObjectsGrading.CheckToleranceControlledCurvedLineObjects (feedback, objects, RequiredObjects, i, j, k);
								if (breakForLoop)  break LoopRequiredObjects;								
							}
							else {
								// For FBD objects
								// --------------------------------------------------------------
								breakForLoop = mechanicsObjectsGrading.CheckToleranceFBDObjects(feedback, objects,RequiredObjects,i,j,k);
								if (breakForLoop)  break LoopRequiredObjects;
								// --------------------------------------------------------------
							}
						}
					}
				}					
            }
            if (!objects[i].found) { //searching among optional objects				
				LoopOptionalObjects: // trying to find object among required objects
				for (var j = 0; j < OptionalObjects.length; j++) { 				
					if (OptionalObjects[j].found == false) {			
						for (var k = 0; k < OptionalObjects[j].name.length; k++) {						   
							if (objects[i].name == OptionalObjects[j].name[k]) {
								breakForLoop = mechanicsObjectsGrading.CheckToleranceFBDObjects(feedback, objects,OptionalObjects,i,j,k);
								if (breakForLoop)  break LoopOptionalObjects;
							}
						}
					}					
				}			
			}
		}

		var score2 = 1;
		for (var i = 0; i < objects.length; i++) {   
			if (!objects[i].found) {
				score2 = 0;
				feedback.error.push("Found extra object.");
                break;
			}				
		}
		
		var score1 = 1;
		for (var j = 0; j < RequiredObjects.length; j++) {  
			if (RequiredObjects[j].found == false) {
				score1 = 0;
                feedback.error.push(RequiredObjects[j].feedbackName + " was not found."); 
			}
		}
        
        var score = 0;
		if (score1 == 1 && score2 == 1 ) {
			score = 1;
		} 
		

		return (score);		
	};	
    
    // ================================================================================		

 	
    return mechanicsObjectsGrading;
});
