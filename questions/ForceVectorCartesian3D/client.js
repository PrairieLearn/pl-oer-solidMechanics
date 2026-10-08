define(["sylvester", "text!./question.html", "text!./answer.html", "text!./submission.html", "SimpleClient", "SimpleFigure", "PrairieGeom"], function(Sylvester, questionTemplate, answerTemplate, submissionTemplate, SimpleClient, SimpleFigure, PrairieGeom) {
    var $V = Sylvester.Vector.create;

    var drawFcn = function() {
		
        this.pd.setUnits(13, 13);
		

		
		var max = this.params.get("max");
		var a1 = this.params.get("a1");
		var b1 = this.params.get("b1");
		var a2 = this.params.get("a2");
		var b2 = this.params.get("b2");
		
        var O = $V([0, 0, 0]);
        var rX = $V([2*max, 0, 0]);
        var rY = $V([0, max, 0]);
        var rZ = $V([0, 0, max]);
        var rXminus = $V([-2*max, 0, 0]);
        var rYminus = $V([0, -max, 0]);
        var rZminus = $V([0, 0, -max]);
        this.pd.arrow(rXminus, rX);
        this.pd.arrow(O, rY);
        this.pd.arrow(O, rZ);
        this.pd.labelLine(O, rX, $V([1, -1]), "TEX:$x$");
        this.pd.labelLine(O, rY, $V([1.1, 1]), "TEX:$y$");
        this.pd.labelLine(O, rZ, $V([1, 1]), "TEX:$z$");
		
		
		
		var rA = $V([a2, 0, a1]);
		var rB = $V([b2, b1, 0]);
		var rC = $V([0, 0, a1]);
		var rD = $V([a2, 0, 0]);
		var rE = $V([b2, 0, 0]);
		var rF = $V([0, b1, 0]);	

        this.pd.point(rA);
        this.pd.point(rB);     
        this.pd.text(rA, $V([0, -1,0]), "TEX:$A$");
        this.pd.text(rB, $V([0, 1,0]), "TEX:$B$");	
						
		this.pd.save();
		this.pd.setProp("shapeOutlineColor", "rgb(0,0,200)");
		this.pd.arrow(rA, rB);
		this.pd.setProp("shapeOutlineColor", "rgb(128,128,128)");

		
		this.pd.line(rA,rC);
		this.pd.line(rA,rD);
		if (a2 > 0) {
			this.pd.labelLine(rA,rC, $V([0, 1]), "TEX:$a$");
			this.pd.labelLine(rA,rD, $V([0.5, -1]), "TEX:$b$");
		}
		else {
			this.pd.labelLine(rA,rC, $V([0, -1]), "TEX:$a$");
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


		
    };

    var client = new SimpleClient.SimpleClient({questionTemplate: questionTemplate, answerTemplate: answerTemplate,  submissionTemplate: submissionTemplate});

    client.on("renderQuestionFinished", function() {
        SimpleFigure.addFigure(client, "#figure1", drawFcn);
    });

    return client;
});