define(["QServer", "PrairieRandom", "sylvester", "PrairieGeom", "underscore"], function(QServer, PrairieRandom, Sylvester, PrairieGeom, _) {
    var $V = Sylvester.Vector.create;

    var server = new QServer();

    server.getData = function(vid) {
        
        var rand = new PrairieRandom.RandomGenerator(vid);
        		
		var max = 5;
		var amax = 3;
		var a1 = rand.randInt(2, amax);		
		var b1 = rand.randInt(2, amax);
		var Fab = rand.randInt(200, 600);
		
 		var nTry = 0, done;
        do {
            done = false;
            if (nTry++ > 1000)
                throw Error("number of tries exceeded");		
			var a2 = rand.randInt(-max, max);
			var b2 = rand.randInt(-max, max);
		    if ( Math.abs(a2) >=2  && Math.abs(b2) >=2 && a2 != b2 ) done = true;
        } while (!done); 
		
		var rA = $V([a2, 0, a1]);
		var rB = $V([b2, b1, 0]);
		var rAB = rB.subtract(rA);
		var mag = rAB.modulus();
		
		Fabvec = rAB.multiply(Fab/mag);
		
		var fabx = Fabvec.e(1);
		var faby = Fabvec.e(2);
		var fabz = Fabvec.e(3);
		
		var az = Math.abs(a1);
		var ax = Math.abs(a2);
		var bx = Math.abs(b2);
		var by = Math.abs(b1);

        var params = {
			a1:a1,
			a2:a2,
			b1:b1,
			b2:b2,
			az:az,
			ax:ax,
			bx:bx,
			by:by,
			max:max,
			Fab:Fab
        };

        var trueAnswer = {
			fabx:fabx,
			faby:faby,
			fabz:fabz
        };
        var questionData = {
            params: params,
            trueAnswer: trueAnswer,
        };
        return questionData;
    };

    return server;
});