define(["sylvester", "PrairieGeom"], function(Sylvester, PrairieGeom) {
	
    var $V = Sylvester.Vector.create;
	var $M = Sylvester.Matrix.create;
	
	var solMec = {};
	
	solMec.principalStresses = function(Tvec){		
	
		var pStress = {};

		var sigma_average = (Tvec.e(1)+Tvec.e(2))/2;
		var sigma_diff = (Tvec.e(1)-Tvec.e(2))/2;
		var R = Math.sqrt(Math.pow(sigma_diff,2) + Math.pow(Tvec.e(3),2));		
		pStress.sigma1 = sigma_average + R;
		pStress.sigma2 = sigma_average - R;
		var thetap1Rad = 0.5*Math.atan2(Tvec.e(3),sigma_diff);
		pStress.thetap1 = PrairieGeom.radToDeg(thetap1Rad);	
		pStress.taumax = R;
		
		return pStress;
	};
	//-----------------------------------------------------------------------	
	solMec.stressTransformation = function(Tvec,angle){		
		
		var sigma_average = (Tvec.e(1)+Tvec.e(2))/2;
		var sigma_diff = (Tvec.e(1)-Tvec.e(2))/2;
		var sigmaxp = sigma_average + sigma_diff*Math.cos(2*angle) + Tvec.e(3)*Math.sin(2*angle);
		var sigmayp = sigma_average - sigma_diff*Math.cos(2*angle) - Tvec.e(3)*Math.sin(2*angle);	
		var tauxyp = - sigma_diff*Math.sin(2*angle) + Tvec.e(3)*Math.cos(2*angle);		
		
		var rotTvec = $V([sigmaxp, sigmayp, tauxyp]);		
		return rotTvec;
	};
	
	//-----------------------------------------------------------------------	
	solMec.VonMisesStress = function(pStress){		
	
		var sigmaVonMises = Math.sqrt( Math.pow(pStress.sigma1,2) + Math.pow(pStress.sigma2,2) - pStress.sigma1*pStress.sigma2);		
		
		return sigmaVonMises;
	};	
	//-----------------------------------------------------------------------	
	solMec.TrescaStress = function(pStress){		
	
		var sigmatresca = 0;
		if ( PrairieGeom.sign(pStress.sigma1) == PrairieGeom.sign(pStress.sigma2)  ) {
			sigmatresca = Math.abs(pStress.sigma1);
			if (Math.abs(pStress.sigma2) > sigmatresca ) sigmatresca = Math.abs(pStress.sigma2);
		}
		else sigmatresca = Math.abs(pStress.sigma1-pStress.sigma2);		
		
		return sigmatresca;
	};	
	
    return solMec;
});