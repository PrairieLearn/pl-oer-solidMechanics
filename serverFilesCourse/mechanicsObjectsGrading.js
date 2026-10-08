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
                                if (m==0) {
                                    objectsTrue[j].x1 =  objects[i].x1Global;   
                                    objectsTrue[j].x2 =  objects[i].x2Global;   
                                    objectsTrue[j].y1 =  objects[i].y1Global;   
                                    objectsTrue[j].y2 =  objects[i].y2Global;   
                                }
                                else if (m==1) {
                                    objectsTrue[j].x1 =  objects[i].x2Global;   
                                    objectsTrue[j].x2 =  objects[i].x1Global;   
                                    objectsTrue[j].y1 =  objects[i].y2Global;   
                                    objectsTrue[j].y2 =  objects[i].y1Global;   
                                }
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
                                    BreakFor = mechanicsObjectsGrading.CheckConcave(objects[i], objectsTrue[j], feedback, y3max)  								
                                }	
								else {
									feedback.slope.push("Found object " + objectsTrue[j].feedbackName + " but slope is incorrect");
								}
							}							
							else if (objectsTrue[j].slope[0] == 'negative') {	// 0 < slope < 90
                                if (objects[i].slope > angleDegreeTol && objects[i].slope < 90) {
                                    BreakFor = mechanicsObjectsGrading.CheckConcave(objects[i], objectsTrue[j], feedback, y3max)
								}	
								else {
									feedback.slope.push("Found object " + objectsTrue[j].feedbackName + " but slope is incorrect");
								}
							}	
                            else if (objectsTrue[j].slope[0] == 'zero') {	
                                if (Math.abs(objects[i].slope) < angleDegreeTol) {
                                    BreakFor = mechanicsObjectsGrading.CheckConcave(objects[i], objectsTrue[j], feedback, y3max)
								}	
								else {
									feedback.slope.push("Found object " + objectsTrue[j].feedbackName + " but slope is incorrect");
								}
							}	                           
  							else {
								console.log('error: need to set slope property');
							}
                            
                            if (objectsTrue[j].found) {
                                if (m==0) {
                                    objectsTrue[j].x1 =  objects[i].x1Global;   
                                    objectsTrue[j].x2 =  objects[i].x2Global;   
                                    objectsTrue[j].y1 =  objects[i].y1Global;   
                                    objectsTrue[j].y2 =  objects[i].y2Global;   
                                    objectsTrue[j].x3 =  objects[i].x3Global;   
                                    objectsTrue[j].y3 =  objects[i].y3Global;                                       
                                }
                                else if (m==1) {
                                    objectsTrue[j].x1 =  objects[i].x2Global;   
                                    objectsTrue[j].x2 =  objects[i].x1Global;   
                                    objectsTrue[j].y1 =  objects[i].y2Global;   
                                    objectsTrue[j].y2 =  objects[i].y1Global;   
                                    objectsTrue[j].x3 =  objects[i].x3Global;   
                                    objectsTrue[j].y3 =  objects[i].y3Global;   
                                }
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
 	mechanicsObjectsGrading.CheckConcave = function(SubmittedObject, TrueObjects, feedback, y3max) { 
        
        var breakForLoop = false;
        
        if (TrueObjects.slope[1] == 'concaveDown') {
            if (SubmittedObject.y3Global < y3max) {                                        
                TrueObjects.found = true;
                SubmittedObject.found = true;			
                BreakFor = true;
            }
            else {
                feedback.slope.push("Found object " + TrueObjects.feedbackName + " but needs to check curvature");
            }
        }
        else if (TrueObjects.slope[1] == 'concaveUp') {
            if (SubmittedObject.y3Global > y3max) {                                        
                TrueObjects.found = true;
                SubmittedObject.found = true;			
                BreakFor = true;
            }
            else {
                feedback.slope.push("Found object " + TrueObjects.feedbackName + " but needs to check curvature");
            }
        }
        
        return(breakForLoop);
    }

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

 	mechanicsObjectsGrading.CreateRequiredObjectListStressElement = function(thetaRad, RequiredObjects, params, trueAnswer) { 
				
		var d = params.gridsize;
		var rA = $V([params.a,params.b]);
		var rAB = $V([3*d*Math.cos(thetaRad),-3*d*Math.sin(thetaRad)]);
		var rAC = $V([-3*d*Math.sin(thetaRad),-3*d*Math.cos(thetaRad)]);
		var rAD = $V([-3*d*Math.cos(thetaRad),3*d*Math.sin(thetaRad)]);
		var rAE = $V([3*d*Math.sin(thetaRad),3*d*Math.cos(thetaRad)]);
		var XPos = rA.add(rAB);
		var XNeg = rA.add(rAD);
		var YPos = rA.add(rAC);
		var YNeg = rA.add(rAE);
		
		var alpha0 = thetaRad;
		var alpha1 = thetaRad + Math.PI/2;
		var alpha2 = thetaRad + Math.PI;
		var alpha3 = thetaRad + 3*Math.PI/2;
		
		if (alpha1 > 2*Math.PI) alpha1 = alpha1 - Math.floor(alpha1/(2*Math.PI))*2*Math.PI; 
		if (alpha2 > 2*Math.PI) alpha2 = alpha2 - Math.floor(alpha2/(2*Math.PI))*2*Math.PI;
		if (alpha3 > 2*Math.PI) alpha3 = alpha3 - Math.floor(alpha3/(2*Math.PI))*2*Math.PI;
		
		if ( trueAnswer.sigmaxp != 0 ) {
			if (trueAnswer.sigmaxp > 0) {
				var sxplus = {
					centerCircle: XPos,
					value: trueAnswer.sigmaxp,
					angle: alpha0,
					id: 'sxplus',					
				}	
				var sxminus = {
					centerCircle: XNeg,
					value: trueAnswer.sigmaxp,
					angle: alpha2,
					id: 'sxminus',				
				}
				
			}
			else if (trueAnswer.sigmaxp < 0) {
				var sxplus = {
					centerCircle: XPos,
					value: trueAnswer.sigmaxp,
					angle: alpha2,
					id: 'sxplus',			
				}	
				var sxminus = {
					centerCircle: XNeg,
					value: trueAnswer.sigmaxp,
					angle: alpha0,
					id: 'sxminus',			
				}
				
			}
			RequiredObjects.push(sxplus);
			RequiredObjects.push(sxminus);
		}
		

		if ( trueAnswer.sigmayp != 0 ) {
			if (trueAnswer.sigmayp > 0) {
				var syplus = {
					centerCircle: YPos,
					value: trueAnswer.sigmayp,
					angle: alpha1,
					id: 'syplus',			
				}	
				var syminus = {
					centerCircle: YNeg,
					value: trueAnswer.sigmayp,
					angle: alpha3,
					id: 'syminus',			
				}
				
			}
			else if (trueAnswer.sigmayp < 0) {
				var syplus = {
					centerCircle: YPos,
					value: trueAnswer.sigmayp,
					angle: alpha3,
					id: 'syplus',			
				}	
				var syminus = {
					centerCircle: YNeg,
					value: trueAnswer.sigmayp,
					angle: alpha1,
					id: 'syminus',			
				}
				
			}
			RequiredObjects.push(syplus);
			RequiredObjects.push(syminus);
		}
		
		if ( trueAnswer.tauxyp != 0 ) {
			if (trueAnswer.tauxyp > 0) {
				var txyplus = {
					centerCircle: XPos,
					value: trueAnswer.tauxyp,
					angle: alpha1,
					id: 'txyplus',			
				}	
				var txyminus = {
					centerCircle: XNeg,
					value: trueAnswer.tauxyp,
					angle: alpha3,
					id: 'txyminus',			
				}
				var tyxplus = {
					centerCircle: YPos,
					value: trueAnswer.tauxyp,
					angle: alpha0 ,
					id: 'tyxplus',			
				}	
				var tyxminus = {
					centerCircle: YNeg,
					value: trueAnswer.tauxyp,
					angle: alpha2,
					id: 'tyxminus',			
				}				
			}
			else if (trueAnswer.tauxyp < 0) {
				var txyplus = {
					centerCircle: XPos,
					value: trueAnswer.tauxyp,
					angle: alpha3,
					id: 'txyplus',			
				}	
				var txyminus = {
					centerCircle: XNeg,
					value: trueAnswer.tauxyp,
					angle: alpha1,
					id: 'txyminus',			
				}
				var tyxplus = {
					centerCircle: YPos,
					value: trueAnswer.tauxyp,
					angle: alpha2 ,
					id: 'tyxplus',			
				}	
				var tyxminus = {
					centerCircle: YNeg,
					value: trueAnswer.tauxyp,
					angle: alpha0 ,
					id: 'tyxminus',			
				}					
			}
			RequiredObjects.push(txyplus);
			RequiredObjects.push(txyminus);
			RequiredObjects.push(tyxplus);
			RequiredObjects.push(tyxminus);
		}
		
	}
    // ================================================================================		

 	mechanicsObjectsGrading.GradeRequiredObjectsStressElement = function(objects, RequiredObjects, params, angleTol) { 	
	
		for (var i = 0; i < RequiredObjects.length; i++) { 
			RequiredObjects[i].found = false;
		}
	
			// Loops over all objects on canvas and disregards "undefined" objects (given objects)
		for (var i = 0; i < objects.length; i++) {  

			if (objects[i].name	=== undefined) {
				objects[i].found = true;
				continue;	
			}	

			objects[i].found = false;
			
			var objAngle1 = (360 - objects[i].angle)*Math.PI/180;
			var objAngle2 = (-objects[i].angle)*Math.PI/180;
			var rP = $V([objects[i].left, objects[i].top ])			
			
			
			LoopRequiredObjects: // trying to find object among required objects
			for (var j = 0; j < RequiredObjects.length; j++) { 			
				if (RequiredObjects[j].found == false) {		
									
					var distCenters = RequiredObjects[j].centerCircle.subtract(rP);
					var distCentersMod = distCenters.modulus();
					
					if (distCentersMod < 1.5*params.gridsize) { // found possible object
					
						angleError1 = Math.abs((objAngle1 - RequiredObjects[j].angle));
						angleError2 = Math.abs((objAngle2 - RequiredObjects[j].angle));
						
						if (angleError1  < angleTol || angleError2  < angleTol) {
							
							RequiredObjects[j].found = true;
							objects[i].found = true;
							break LoopRequiredObjects;
							
						}					
					}
				}					
            }
		}

	}
	
    return mechanicsObjectsGrading;
});
