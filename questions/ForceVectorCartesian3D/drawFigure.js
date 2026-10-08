    var $V = Sylvester.Vector.create;

        this.pd.setUnits(24,24/ this.pd.goldenRatio);

        
        /*
        var avec = $V([3,6,-3]);
        var bvec = $V([-5,5,5]);
        var cvec = $V([1,-5,1]);
        */

        

        //var isHorizontal = this.params.get("isHorizontal");

        //var O = $V([-8,0]);
        //var r1 = 10;
		    //var r2 = 10;
	    	//var P = $V([8,0]);
        


        // To create the boundary box
        //var bbox = PrairieGeom.boundingBox2D([O.add($V([r1,0])), O.add($V([-r1,0])), O.add($V([0,r1])), O.add($V([0,-r1])), P.add($V([r2,0])), P.add($V([-r2,0])), P.add($V([0,r2])), P.add($V([0,-r2]))]);


    var max = this.params.get("maxim");
    var a1 = this.params.get("a1");
    var b1 = this.params.get("b1");
    var a2 = this.params.get("a2");
    var b2 = this.params.get("b2");
    
        var O1 = $V([0, 0, 0]);
        var rX = $V([2*max, 0, 0]);
        var rY = $V([0, max, 0]);
        var rZ = $V([0, 0, max]);
        var rXminus = $V([-2*max, 0, 0]);
        var rYminus = $V([0, -max, 0]);
        var rZminus = $V([0, 0, -max]);
        this.pd.arrow(rXminus, rX);
        this.pd.arrow(O1, rY);
        this.pd.arrow(O1, rZ);
        this.pd.labelLine(O1, rX, $V([1, -1]), "TEX:$x$");
        this.pd.labelLine(O1, rY, $V([1.1, 1]), "TEX:$y$");
        this.pd.labelLine(O1, rZ, $V([1, 1]), "TEX:$z$");
    
    
    
    var rA = $V([a2, 0, a1]);
    var rB = $V([b2, b1, 0]);
    var rC = $V([0, 0, a1]);
    var rD = $V([a2, 0, 0]);
    var rE = $V([b2, 0, 0]);
    var rF = $V([0, b1, 0]);  

        this.pd.point(rA);
        this.pd.point(rB);     
        this.pd.text(rA, $V([0, -1,0]), "TEX:$A$");
        this.pd.text(rB, $V([0, -1,0]), "TEX:$B$");  
            
    this.pd.save();
    this.pd.setProp("shapeOutlineColor", "rgb(0,0,200)");
    this.pd.arrow(rA, rB);
    this.pd.setProp("shapeOutlineColor", "rgb(128,128,128)");

    
    this.pd.line(rA,rC);
    this.pd.line(rA,rD);
    if (a2 > 0) {
      this.pd.labelLine(rA,rC, $V([0, 1.5]), "TEX:$a$");
      this.pd.labelLine(rA,rD, $V([0.5, -1]), "TEX:$b$");
    }
    else {
      this.pd.labelLine(rA,rC, $V([0, -1.5]), "TEX:$a$");
      this.pd.labelLine(rA,rD, $V([0.5, -1]), "TEX:$b$");
    }
    


    this.pd.line(rB,rE);
    this.pd.line(rB,rF);
    if (b2 > 0) {
      this.pd.labelLine(rB,rE, $V([0, 1]), "TEX:$d$");
      this.pd.labelLine(rB,rF, $V([0, -1]), "TEX:$c$");
    }
    else {
      this.pd.labelLine(rB,rE, $V([0, -1]), "TEX:$d$");
      this.pd.labelLine(rB,rF, $V([0, 1]), "TEX:$c$");
    }
    
    this.pd.restore();

       





    
       






            
                             
