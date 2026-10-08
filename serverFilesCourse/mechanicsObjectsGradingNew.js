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
			
			if (objects[i].y1 < objectsTrue[j].yUp[pos[m]] && objects[i].y1 > objectsTrue[j].yLower[pos[m]]) {

				if ( objects[i].x1 < objectsTrue[j].xUp[pos[m]] && objects[i].x1 > objectsTrue[j].xLower[pos[m]] ) {	
				
					if (objects[i].y2 < objectsTrue[j].yUp[pos[m+1]] && objects[i].y2 > objectsTrue[j].yLower[pos[m+1]]) {

						if ( objects[i].x2 < objectsTrue[j].xUp[pos[m+1]] && objects[i].x2 > objectsTrue[j].xLower[pos[m+1]] ) {	

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
                                    objectsTrue[j].x1 =  objects[i].x1;   
                                    objectsTrue[j].x2 =  objects[i].x2;   
                                    objectsTrue[j].y1 =  objects[i].y1;   
                                    objectsTrue[j].y2 =  objects[i].y2;   
                                }
                                else if (m==1) {
                                    objectsTrue[j].x1 =  objects[i].x2;   
                                    objectsTrue[j].x2 =  objects[i].x1;   
                                    objectsTrue[j].y1 =  objects[i].y2;   
                                    objectsTrue[j].y2 =  objects[i].y1;   
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
        
        var y2max = ((objects[i].y3-objects[i].y1)/(objects[i].x3-objects[i].x1))*(objects[i].x2 - objects[i].x1 ) + objects[i].y1;		
        
		var pos = [0,1,0];
		for(var m=0;m<2;m++) {
			
			if (objects[i].y1 < objectsTrue[j].yUp[pos[m]] && objects[i].y1 > objectsTrue[j].yLower[pos[m]]) {

				if ( objects[i].x1 < objectsTrue[j].xUp[pos[m]] && objects[i].x1 > objectsTrue[j].xLower[pos[m]] ) {	
				
					if (objects[i].y3 < objectsTrue[j].yUp[pos[m+1]] && objects[i].y3 > objectsTrue[j].yLower[pos[m+1]]) {

						if ( objects[i].x3 < objectsTrue[j].xUp[pos[m+1]] && objects[i].x3 > objectsTrue[j].xLower[pos[m+1]] ) {	
                      
							if (objectsTrue[j].slope[0] == 'positive') { // - 90 < slope < 0                                  
								if (objects[i].slope < -angleDegreeTol && objects[i].slope > -90) {
                                    BreakFor = mechanicsObjectsGrading.CheckConcave(objects[i], objectsTrue[j], feedback, y2max)  								
                                }	
								else {
									feedback.slope.push("Found object " + objectsTrue[j].feedbackName + " but slope is incorrect");
								}
							}							
							else if (objectsTrue[j].slope[0] == 'negative') {	// 0 < slope < 90
                                if (objects[i].slope > angleDegreeTol && objects[i].slope < 90) {
                                    BreakFor = mechanicsObjectsGrading.CheckConcave(objects[i], objectsTrue[j], feedback, y2max)
								}	
								else {
									feedback.slope.push("Found object " + objectsTrue[j].feedbackName + " but slope is incorrect");
								}
							}	
                            else if (objectsTrue[j].slope[0] == 'zero') {	
                                if (Math.abs(objects[i].slope) < angleDegreeTol) {
                                    BreakFor = mechanicsObjectsGrading.CheckConcave(objects[i], objectsTrue[j], feedback, y2max)
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
                                    objectsTrue[j].x1 =  objects[i].x1;   
                                    objectsTrue[j].x2 =  objects[i].x2;   
                                    objectsTrue[j].y1 =  objects[i].y1;   
                                    objectsTrue[j].y2 =  objects[i].y2;   
                                    objectsTrue[j].x3 =  objects[i].x3;   
                                    objectsTrue[j].y3 =  objects[i].y3;                                       
                                }
                                else if (m==1) {
                                    objectsTrue[j].x1 =  objects[i].x3;   
                                    objectsTrue[j].x3 =  objects[i].x1;   
                                    objectsTrue[j].y1 =  objects[i].y3;   
                                    objectsTrue[j].y3 =  objects[i].y1;   
                                    objectsTrue[j].x2 =  objects[i].x2;   
                                    objectsTrue[j].y2 =  objects[i].y2;   
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
 	mechanicsObjectsGrading.CheckConcave = function(SubmittedObject, TrueObjects, feedback, y2max) { 
        
        var breakForLoop = false;
        
        if (TrueObjects.slope[1] == 'concaveDown') {
            if (SubmittedObject.y2 < y2max) {                                        
                TrueObjects.found = true;
                SubmittedObject.found = true;			
                BreakFor = true;
            }
            else {
                feedback.slope.push("Found object " + TrueObjects.feedbackName + " but needs to check curvature");
            }
        }
        else if (TrueObjects.slope[1] == 'concaveUp') {
            if (SubmittedObject.y2 > y2max) {                                        
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
        
			objects[i].found = false;        
            breakForLoop = false;
			
			LoopRequiredObjects: // trying to find object among required objects
			for (var j = 0; j < RequiredObjects.length; j++) { 			
				if (RequiredObjects[j].found == false) {		
					for (var k = 0; k < RequiredObjects[j].name.length; k++) { 								   
						if (objects[i].type == RequiredObjects[j].name[k]) {
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
						}
						if (objects[i].name == RequiredObjects[j].name[k]) {							
								// For FBD objects
								// --------------------------------------------------------------
								breakForLoop = mechanicsObjectsGrading.CheckToleranceFBDObjects(feedback, objects,RequiredObjects,i,j,k);
								if (breakForLoop)  break LoopRequiredObjects;
								// --------------------------------------------------------------
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
		
		var score1 = 1;
		for (var j = 0; j < RequiredObjects.length; j++) {  
			if (RequiredObjects[j].found == false) {
				score1 = 0;
                feedback.error.push("Correct " + RequiredObjects[j].feedbackName + " was not found."); 
			}
		}			

		var score2 = 1; // = 1 when no extra objects are found
		if (score1 == 1) { // if found all required objects, check for additional incorrect objects
			for (var i = 0; i < objects.length; i++) {   
				if (!objects[i].found) {
					score2 = 0;
					feedback.error.push("Found extra object.");
					break;
				}	            
			}
		}
		
        var score = 0;
		if (score1 == 1 && score2 == 1 ) {
			score = 1;
		} 
		

		return (score);		
	};	

    // ================================================================================		
 	mechanicsObjectsGrading.ProcessObjectsInsideEllipse = function(objects, RequiredObjects, OptionalObjects, feedback) {  
		// Process grading for objects inside ellipse
		// =============================================================

		var breakForLoop = false;
		
		for (var i = 0; i < RequiredObjects.length; i++) { 
			RequiredObjects[i].found = false;
		}
		for (var i = 0; i < OptionalObjects.length; i++) { 
			OptionalObjects[i].found = false;
		}

		for (var i = 0; i < objects.length; i++) {  

			objects[i].found = false;	
			
			//angle of the arrow
			var beta = objects[i].angle*Math.PI/180;
			//length of the arrow
			var L = objects[i].width;
			//center of the arrow
			var rP = $V([objects[i].left, objects[i].top ]);
			//unit vector in the direction of the inserted object
			var uvec = $V([Math.cos(beta), Math.sin(beta)]);
			//tail of the arrow
			var rt = rP.add(uvec.multiply(L/2));
			//head of the arrow
			var rh = rP.add(uvec.multiply(-L/2));
			
			LoopRequiredObjects: // trying to find object among required objects
			for (var j = 0; j < RequiredObjects.length; j++) { 			
				if (RequiredObjects[j].found == false) {
					
					var nearCenter = mechanicsObjectsGrading.CheckPointInsideEllipse(RequiredObjects[j], rP);
					var nearHead = mechanicsObjectsGrading.CheckPointInsideEllipse(RequiredObjects[j], rt);
					var nearTail = mechanicsObjectsGrading.CheckPointInsideEllipse(RequiredObjects[j], rh);
					
					if(RequiredObjects[j].name !== undefined) {
						for (var k = 0; k < RequiredObjects[j].name.length; k++) { 
							if (objects[i].name == RequiredObjects[j].name[k]) {
								// If a moment, than the object only needs to be inside the ellipse
								if (RequiredObjects[j].name[k] == 'MCC' || RequiredObjects[j].name[k] == 'MC') { 
									if ( nearCenter || nearHead || nearTail) {
										RequiredObjects[j].found = true;
										objects[i].found = true;	
										break LoopRequiredObjects;
									}
								}		
								// If a force, check if orientation of the arrow is correct
								else if (RequiredObjects[j].name[k] == 'F' ) { 
									if ( nearCenter || nearHead || nearTail) {
										breakForLoop = mechanicsObjectsGrading.CheckOrientationInsideEllipse(RequiredObjects[j], uvec, objects[i], feedback);
										if (breakForLoop)  break LoopRequiredObjects;						
									}
								}
							}
						}
					}
										
				}					
            }

			if (!objects[i].found) { //searching among optional objects				
				LoopOptionalObjects: // trying to find object among required objects
				for (var j = 0; j < OptionalObjects.length; j++) { 				
					if (OptionalObjects[j].found == false) {

						var nearCenter = mechanicsObjectsGrading.CheckPointInsideEllipse(OptionalObjects[j], rP);
						var nearHead = mechanicsObjectsGrading.CheckPointInsideEllipse(OptionalObjects[j], rt);
						var nearTail = mechanicsObjectsGrading.CheckPointInsideEllipse(OptionalObjects[j], rh);
					
						if(OptionalObjects[j].name !== undefined) {
							for (var k = 0; k < OptionalObjects[j].name.length; k++) { 
								if (objects[i].name == OptionalObjects[j].name[k]) {
									// If a moment, than the object only needs to be inside the ellipse
									if (OptionalObjects[j].name[k] == 'MCC' || OptionalObjects[j].name[k] == 'MC') { 
										if ( nearCenter || nearHead || nearTail) {
											//console.log('found a moment near correct position');
											OptionalObjects[j].found = true;
											objects[i].found = true;	
											break LoopOptionalObjects;
										}
									}		
									// If a force, check if orientation of the arrow is correct
									else if (OptionalObjects[j].name[k] == 'F' ) { 
										if ( nearCenter || nearHead || nearTail) {
											//console.log('found a force near correct position');
											breakForLoop = mechanicsObjectsGrading.CheckOrientationInsideEllipse(OptionalObjects[j], uvec, objects[i], feedback);
											if (breakForLoop)  break LoopOptionalObjects;						
										}
									}
								}
							}
						}					
					}					
				}			
			} 
		}
			
		var score1 = 1;
		for (var j = 0; j < RequiredObjects.length; j++) {  
			if (RequiredObjects[j].found == false) {
				score1 = 0;
                feedback.error.push("Correct " + RequiredObjects[j].feedbackName + " was not found."); 
			}
		}
		var score2 = 1; // = 1 when no extra objects are found
		if (score1 == 1) { // if found all required objects, check for additional incorrect objects
			for (var i = 0; i < objects.length; i++) {   
				if (!objects[i].found) {
					score2 = 0;
					feedback.error.push("Found extra object.");
				}				
			}	
		}
		var score = 0;
        if (score1 == 1 && score2 == 1) {
			feedback.error.push(" Drawing is correct."); 
			score = 1;
		}   

		return (score);		
	};	


	// =============================================================	    
    // Check if a point is inside ellipse
    // =============================================================	
    mechanicsObjectsGrading.CheckPointInsideEllipse = function(requiredObj, point) {
		
		var IsInside = false;
		
		var rC = requiredObj.FBDpoint; // center of the ellipse
		var rotDeg = requiredObj.angle;   // angle of rotation of the ellipse
		var major = requiredObj.majorAxis; // major axis length
		var minor = requiredObj.minorAxis; // minor axis length
		
		var rot = rotDeg*Math.PI/180;
		var xc = rC.e(1); var yc = rC.e(2);
		var a = point.e(1); var b = point.e(2);
		
		var diff =  Math.pow( ((a-xc)*Math.cos(rot)) + ((b-yc)*Math.sin(rot)) ,2 )/ ( Math.pow(major,2) )     
				+     Math.pow(      ((a-xc)*Math.sin(rot)) - ((b-yc)*Math.cos(rot)) ,2) / ( Math.pow(minor,2) );
				
		if  ( diff  <= 1 ) IsInside = true;
		
		return (IsInside);
		
	};    		

	// =============================================================	    
    // Check if the vector inside ellipse has correct orientation
    // =============================================================	
    mechanicsObjectsGrading.CheckOrientationInsideEllipse = function(requiredObj, uvec, object, feedback) {
			
		var BreakFor = false;
		//console.log("found object inside ellipse");
		// unit vector in the direction of the required object
		var uvecR = $V([Math.cos(requiredObj.angle*Math.PI/180), 1.0*Math.sin(requiredObj.angle*Math.PI/180)]);	
		// angle between both required and inserted unit vectors
		var angleBetween = Math.acos(uvec.dot(uvecR))*180/Math.PI;
		//console.log(angleBetween);
		if (requiredObj.PrescribedDirection == true) {
			if (angleBetween  < requiredObj.angleTol ) {						
				requiredObj.found = true;
				object.found = true;	
				BreakFor = true;
			}
			else {
				feedback.error.push("Found " + requiredObj.feedbackName + " at correct location, but orientation is not correct");
			}
		}
		else {
			if (angleBetween  < requiredObj.angleTol || Math.abs(180-angleBetween)  < requiredObj.angleTol) {					
				requiredObj.found = true;
				object.found = true;						
				BreakFor = true;
			}
			else {
				feedback.error.push("Found " + requiredObj.feedbackName + " at correct location, but orientation is not correct");
			}
		}
		
		return (BreakFor);
		
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

		for (var i = 0; i < objects.length; i++) {  

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
