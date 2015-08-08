////CODED BY PAUL TURCHAN (2013)
//SOURCES
//BAGULEY'S (2012) "SERIOUS STATS: A GUIDE TO ADVANCED STATISTICS FOR THE BEHAVIORAL SCIENCES"
//ELLIS (2010) "THE ESSENTIAL GUIDE TO EFFECT SIZES: STATISTICAL POWER, META-ANALYSIS, AND THE INTERPRETATION OF RESEARCH RESULTS"
//FURR (2008) "EFFECT SIZES AND SIGNIFICANCE TESTS" (ACCESSIBLE HERE: http://psych.wfu.edu/furr/EffectSizeFormulas.pdf; ACCESSED ON 25AUG2013)
//GRISSOM AND KIM (2012) "EFFECT SIZES FOR RESEARCH: UNIVARIATE AND MULTIVARIATE APPLICATIONS" 
//"NOMINAL MEASURES OF CORRELATION: PHI, THE CONTINGENCY COEFFICIENT, AND CRAMER'S V" (ACCESSED HERE: http://www.harding.edu/sbreezeel/460%20Files/Statbook/chapter15.pdf; ACCESSED ON 11OCT2013)
//PRIVITERA (2011) "STUDENT STUDY GUIDE WITH SPSS WORKBOOK FOR THE BEHAVIORAL SCIENCES"
//WILSON (2000) "PRACTICAL META-ANALYSIS"

//CALCULATE CHI-SQUARED EFFECT SIZES
function calculateChiSquareESs(){
	//DECLARE VARIABLES AND RETRIEVE VALUES FROM FORMS
	var chiSquared = parseFloat(document.getElementById("chiSquared").value);
	var degreesOfFreedom = parseFloat(document.getElementById("chiSquared").value);
	var sampleSize = parseFloat(document.getElementById("sampleSizeChi").value);
	var rows = parseFloat(document.getElementById("rowLevels").value);
	var columns = parseFloat(document.getElementById("columnLevels").value);
	//CHECK IF SUFFICIENT INFORMATION WAS SPECIFIED TO CALCULATE EFFECT SIZES
	//EVALUATE IF POSSIBLE CONFIGURATIONS FOR GOODNESS-OF-FIT TEST ARE SATISFIED
	//IF CHI-SQUARED; N OR DF; ROWS ARE NUMBERS AND (GOODNESS-OF-FIT CHECKED OR (COLUMNS IS A NUMBER AND TEST-OF-INDEPENDENCE CHECKED))
	if(
		(!isNaN(chiSquared) && (!isNaN(sampleSize) || !isNaN(degreesOfFreedom)) && !isNaN(rows) && (document.getElementById("goodnessOfFitTest").checked || (!isNaN(columns) && document.getElementById("testOfIndependence").checked)))
	){
		//DECLARE VARIABLES
		var contingencyCoefficient = "";
		var cohensW = "";
		var phi = "";
		var phiSquared = "";
		var cramersV = "";
		var cohensD = "";
		var kLevels;
		//BEGIN CALCULATING EFFECT SIZES
		//Calculate Cohen's W
		cohensW = Math.sqrt(chiSquared / sampleSize);
		//CALCULATE DEGREES OF FREEDOM (DF)
		degreesOfFreedom = rows - 1;
		//GIVEN TEST OF INDEPENDENCE
		if(document.getElementById("testOfIndependence").checked){
			//CALCULATE K LEVELS, WHICH EQUALS ROW OR COLUMN DEPENDING ON WHICH IS SMALLER
			kLevels = rows < columns ? rows : columns;
			//CALCULATE DEGREES OF FREEDOM
			degreesOfFreedom = ((rows - 1) * (columns - 1)).toFixed(2);
			//DETERMINE IF ROWS AND COLUMNS ARE A 2X2 CONTINGENCY TABLE
			if(rows == 2 && columns == 2){
				//CALCULATE PHI
				phi = cohensW //"NOMINAL MEASURES OF CORRELATION: PHI, THE CONTINGENCY COEFFICIENT, AND CRAMER'S V" (N.D.)
				//CALCULATE PHI SQUARED
				phiSquared = Math.pow(phi, 2).toFixed(2);
				//CALCULATE COHEN'S D
				cohensD = 2 * Math.sqrt(chiSquared / (sampleSize - chiSquared)).toFixed(2); //WILSON (2000)
				//FIX DECIMAL PLACES FOR REMAINING VARIABLES
				phi = phi.toFixed(2);
			}
			//DETERMINE IF ROWS = COLUMNS AND COLUMNS AND ROWS >= 3, CALCULATE CONTINGENCY COEFFICIENT 
			else if(rows == columns && rows >= 3 && columns >= 3){
				//CALCULATE CONTINGENCY COEFFICIENT
				contingencyCoefficient = Math.sqrt(chiSquared / (sampleSize + chiSquared)).toFixed(2); //"NOMINAL MEASURES OF CORRELATION: PHI, THE CONTINGENCY COEFFICIENT, AND CRAMER'S V" (N.D.)
			}
			//OTHERWISE, CALCULATE CRAMER'S V IF ROWS ≠ COLUMNS
			else{
				//CALCULATE CRAMER'S V
				cramersV = (cohensW * Math.sqrt(kLevels - 1)).toFixed(2); //"NOMINAL MEASURES OF CORRELATION: PHI, THE CONTINGENCY COEFFICIENT, AND CRAMER'S V" (N.D.)
			}
		}
		//DETERMINE IF TEST-OF-INDEPENDENCE IS CHECKED; IF TRUE, SET COHEN'S W TO NIL; OTHERWISE USE COHEN'S W
		cohensW = document.getElementById("testOfIndependence").checked ? "" : cohensW.toFixed(2);
		//OUTPUT RESULTS
		document.getElementById("phi").value = phi;
		document.getElementById("phiSquared").value = phiSquared;
		document.getElementById("cramersV").value = cramersV;
		document.getElementById("contingencyCoefficient").value = contingencyCoefficient;
		document.getElementById("cohensW").value = cohensW;
		document.getElementById("cohensDChi").value = cohensD;
		document.getElementById("degreesOfFreedomChi").value = degreesOfFreedom;
	}
	//IF INSUFFICIENT DATA WAS GIVEN, ALERT USER
	else{
		alert("Please enter some values to compute.");
	}	
}
//READJUST CHI-SQUARE AREA BASED ON SELECTED TEST
function chiSquareUpdate(){
	if(document.getElementById("goodnessOfFitTest").checked){
		document.getElementById("columnLevels").style.visibility = "hidden";
		document.getElementById("columnsLabel").innerHTML = "";	
		document.getElementById("rowsLabel").innerHTML = "Levels : ";
	}
	else{
		document.getElementById("columnLevels").style.visibility = "visible";
		document.getElementById("columnsLabel").innerHTML = "Column Levels : ";	
		document.getElementById("rowsLabel").innerHTML = "Row Levels : ";
	}
}