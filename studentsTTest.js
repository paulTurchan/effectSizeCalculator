////CODED BY PAUL TURCHAN (2013)
//SOURCES
//BAGULEY'S (2012) "SERIOUS STATS: A GUIDE TO ADVANCED STATISTICS FOR THE BEHAVIORAL SCIENCES"
//ELLIS (2010) "THE ESSENTIAL GUIDE TO EFFECT SIZES: STATISTICAL POWER, META-ANALYSIS, AND THE INTERPRETATION OF RESEARCH RESULTS"
//FURR (2008) "EFFECT SIZES AND SIGNIFICANCE TESTS" (ACCESSIBLE HERE: http://psych.wfu.edu/furr/EffectSizeFormulas.pdf; ACCESSED ON 25AUG2013)
//GRISSOM AND KIM (2012) "EFFECT SIZES FOR RESEARCH: UNIVARIATE AND MULTIVARIATE APPLICATIONS"
//"NOMINAL MEASURES OF CORRELATION: PHI, THE CONTINGENCY COEFFICIENT, AND CRAMER'S V" (ACCESSED HERE: http://www.harding.edu/sbreezeel/460%20Files/Statbook/chapter15.pdf; ACCESSED ON 11OCT2013)
//PRIVITERA (2011) "STUDENT STUDY GUIDE WITH SPSS WORKBOOK FOR THE BEHAVIORAL SCIENCES"
//WILSON (2000) "PRACTICAL META-ANALYSIS"

//CALCULATE STUDENT'S t EFFECT SIZES
function calculateStudentsTESs(){
	var rawArrays = [[],[]];
	var resultsHolder = [];
	//DECLARE VARIABLES
	var cohensD = "";
	var cohensDMOE = "";
	var cohensDCI = "";
	var hedgesG  = "";
	var deltaHat = "";
	var glassDeltaGroupOne = "";
	var glassDeltaUnbiasedGroupOne = "";
	var glassDeltaGroupTwo = "";
	var glassDeltaUnbiasedGroupTwo = "";
	var pearsonsR = "";
	var etaSquared = "";
	var omegaSquared = "";
	var cohensFSquared = "";
	var probabilityOfSuperiority = "";
	//CHECK IF DATA SOURCE IS RAW
	if(document.getElementById("dataSourceRaw").checked){
		//CALCULATE SAMPLE SIZES, MEANS, AND STANDARD DEVIATION
		for(var i = 0; i < 2; i++){
			rawArrays[i] = prompt("Please enter group " + (i + 1).toString() + "'s raw scores separated by commas.").replace(/[,]$/,'').split(",");
			//CALCULATE SAMPLE SIZE
			resultsHolder.push(rawArrays[i].length);
			//CALCULATE MEAN
			resultsHolder.push(eval(rawArrays[i].join('+')) / rawArrays[i].length);
			var tempSum = 0;
			//CALCULATE STANDARD DEVIATION
			for(var ii = 0; ii < resultsHolder[i * 3]; ii++){
				tempSum += Math.pow(rawArrays[i][ii] - resultsHolder[(3 * i) + 1], 2);
			}
			resultsHolder.push(Math.sqrt(tempSum/(rawArrays[i].length - 1)));
			var tempSum = 0;
		}
		//CALCULATE PROBABILITY OF SUPERIORITY
		var tempSum = 0;
		if(document.getElementById("pairedTTest").checked){
			for(var i = 0; i < rawArrays[0].length; i++){
				for(var ii = 0; ii < rawArrays[1].length; ii++){
					if(rawArrays[0][i] > rawArrays[1][ii]){
						tempSum += 1;
					}
					else if(rawArrays[0][i] == rawArrays[1][ii]){
						tempSum += .5;
					}
				}
			}
			probabilityOfSuperiority = (tempSum / (rawArrays[0].length * rawArrays[1].length)).toFixed(2);
		}

		//CALCULATE PAIRED MEAN DIFF SD
		tempSum = 0
		for(var iii = 0; iii < rawArrays[0].length; iii++){
			tempSum += rawArrays[0][iii] - rawArrays[1][iii];
		}
		var tempMean = tempSum / rawArrays[0].length;
		tempSum = 0;
		//X1 - X2 - MEAN(X1 - X2)
		for(var iii = 0; iii < rawArrays[0].length; iii++){
			tempSum += Math.pow(rawArrays[0][iii] - rawArrays[1][iii] - tempMean, 2);
		}
		pairedMdiffSD = Math.sqrt(tempSum / (rawArrays[0].length - 1));
	}
	//DECLARE VARIABLES AND RETRIEVE VALUES FROM FORMS OR RAW DATA
	//NON-GROUP SPECIFIC
	var t = parseFloat(document.getElementById("studentsT").value);
	var degreesOfFreedom = parseFloat(document.getElementById("degreesOfFreedom").value);
	//GROUP ONE
	var nOne = document.getElementById("dataSourceDescriptives").checked ? parseFloat(document.getElementById("nOne").value) : resultsHolder[0];
	var mOne = document.getElementById("dataSourceDescriptives").checked ? parseFloat(document.getElementById("meanOne").value) : resultsHolder[1];
	var sdOne = document.getElementById("dataSourceDescriptives").checked ? parseFloat(document.getElementById("stDevOne").value) : resultsHolder[2];
	//GROUP TWO
	var nTwo = document.getElementById("dataSourceDescriptives").checked ? parseFloat(document.getElementById("nTwo").value) : resultsHolder[3];
	var mTwo = document.getElementById("dataSourceDescriptives").checked ? parseFloat(document.getElementById("meanTwo").value) : resultsHolder[4];
	var sdTwo = document.getElementById("dataSourceDescriptives").checked ? parseFloat(document.getElementById("stDevTwo").value) : resultsHolder[5];
	//CHECK IF SUFFICIENT INFORMATION WAS SPECIFIED TO CALCULATE EFFECT SIZES
	//EVALUATE IF POSSIBLE CONFIGURATIONS FOR INDEPENDENT T-TEST ARE SATISFIED
	//IF N1; M1; SD1; N2; M2; SD2 ARE NUMBERS, OR
	//IF STUDENT'S T; (N1 & N2) OR DF ARE NUMBERS, OR
	//IF M1; SD1; M2; SD2 ARE NUMBERS, &
	//INDEPENDENT T-TEST CHECKED
	//OTHERWISE, EVALUATE IF POSSIBLE CONFIGURATIONS FOR PAIRED T-TEST ARE SATISFIED
	//IF M1; M2; SD1; N1 ARE NUMBERS, OR
	//IF STUDENT'S T; (N1 & N2) OR DF ARE NUMBERS, &
	//PAIRED T-TEST CHECKED
	if(
		((!isNaN(nOne) && !isNaN(mOne) && !isNaN(sdOne) && !isNaN(nTwo) && !isNaN(mTwo) && !isNaN(sdTwo))
		|| (!isNaN(t) && ((!isNaN(nOne) && !isNaN(nTwo)) || !isNaN(degreesOfFreedom)))
		|| (!isNaN(mOne) && !isNaN(sdOne) && !isNaN(mTwo) && !isNaN(sdTwo))
		&& document.getElementById("independentTTest").checked)
		|| ((!isNaN(mOne) && !isNaN(mTwo) && !isNaN(sdOne) && !isNaN(nOne))
		|| (!isNaN(t) && (!isNaN(nOne) || !isNaN(degreesOfFreedom)))
		&& document.getElementById("pairedTTest").checked)
		|| document.getElementById("dataSourceRaw").checked
	){
		//CHECK FOR TWO CONDITIONS FOR INDEPENDENT T-TEST
		//IF M1; SD1; M2; SD2 ARE NUMBERS; (N1 & N2) OR DF ARE NUMBERS, OR
		//IF M1; SD1; M2; SD2 ARE NOT NUMBERS AND T; (N1 & N2) OR DF ARE NUMBERS, &
		//INDEPENDENT T-TEST CHECKED
		if(((!isNaN(mOne) && !isNaN(sdOne) && !isNaN(mTwo) && !isNaN(sdTwo) && ((!isNaN(nOne) && !isNaN(nTwo)) || !isNaN(degreesOfFreedom)))
			|| (isNaN(mOne) && isNaN(sdOne) && isNaN(mTwo) && isNaN(sdTwo) &&!isNaN(t) && ((!isNaN(nOne) && !isNaN(nTwo)) || !isNaN(degreesOfFreedom)))
			|| (document.getElementById("dataSourceRaw").checked))
			&& document.getElementById("independentTTest").checked
		){
			//SET VARIANCE ASSUMPTION TO TRUE IF M1; SD1; M2; SD2 AREN'T SPECIFIED
			if(isNaN(mOne) && isNaN(mTwo) && isNaN(sdOne) && isNaN(sdTwo)){
				document.getElementById("equalVariance").checked;
			}
			//SET N1; N2 IF THEY AREN'T SPECIFIED, BUT DF IS
			if(isNaN(nOne) && isNaN(nTwo) && !isNaN(degreesOfFreedom)){
				nOne = (degreesOfFreedom + 2) / 2;
				nTwo = (degreesOfFreedom + 2) / 2;
			}
			//OTHERWISE, DETERMINE IF VARIANCE ASSUMPTION WAS MET OR VIOLATED AND CALCULATE STUDENT'S T ACCORDINGLY
			degreesOfFreedom = document.getElementById("equalVariance").checked || (isNaN(mOne) && isNaN(mTwo) && isNaN(sdOne) && isNaN(sdTwo)) ? (nOne + nTwo - 2).toFixed(2) : (Math.pow(Math.pow(sdOne, 2) / nOne + Math.pow(sdTwo, 2) / nTwo, 2) / (Math.pow(sdOne, 4) / (Math.pow(nOne, 2) * (nOne - 1)) + Math.pow(sdTwo, 4) / (Math.pow(nTwo, 2) * (nTwo - 1)))).toFixed(2); //BAGULEY (2012)
			//CALCULATE STUDENT'S T USING N1; M1; SD1; N2; M2; SD2 IF THEY ARE SPECIFIED
			if(!isNaN(mOne) && !isNaN(mTwo) && !isNaN(sdOne) && !isNaN(sdTwo) && !isNaN(nOne) && !isNaN(nTwo)){
				//DETERMINE IF VARIANCE ASSUMPTION WAS MET OR VIOLATED AND CALCULATE STUDENT'S T ACCORDINGLY
				studentsT = document.getElementById("equalVariance").checked ? (mOne - mTwo) / (Math.sqrt(((nOne - 1) * Math.pow(sdOne, 2) + (nTwo - 1) * Math.pow(sdTwo, 2)) / (nOne + nTwo - 2)) * Math.sqrt((1 / nOne) + (1 / nTwo))) : (mOne - mTwo) / Math.sqrt((Math.pow(sdOne, 2) / nOne) + (Math.pow(sdTwo, 2) / nTwo)); //BAGULEY (2012)
				studentsT = studentsT.toFixed(2);
			}
			t = (isNaN(mOne) && isNaN(mTwo) && isNaN(sdOne) && isNaN(sdTwo)) ? t : (mOne - mTwo) / (Math.sqrt(((nOne - 1) * Math.pow(sdOne, 2) + (nTwo - 1) * Math.pow(sdTwo, 2)) / (nOne + nTwo - 2)) * Math.sqrt((1 / nOne) + (1 / nTwo)))
			//SUM SAMPLE SIZES
			var nTotal = nOne + nTwo;
			//BEGIN CALCULATING EFFECT SIZES
			//CALCULATE COHEN'S D
			cohensD = t / Math.sqrt((nOne / nTotal) * (nTwo / nTotal) * (nTotal - 2)); //FURR (2008)
			//CALCULATE HEDGE'S G
			hedgesG = cohensD * Math.sqrt((nTotal - 2) / nTotal)
			//CALCULATE MARGIN OF ERROR (MOE) FOR COHEN'S D
			cohensDMOE = Math.sqrt((((nOne + nTwo) / (nOne * nTwo)) + (Math.pow(cohensD,2) / (2 * (nOne + nTwo - 2)))) * ((nOne + nTwo) / (nOne + nTwo - 2)));
			//THE FOLLOWING WILL EVENTUALLY CHANGE, BUT FOR NOW, CALCULATE 95% CONFIDENT INTERVAL (CI) FOR COHEN'S D
			cohensDCI = (Math.sqrt(nTotal / (nTotal - 2)) * cohensD - 1.96 * cohensDMOE).toFixed(2) + ", " + (Math.sqrt(nTotal / (nTotal - 2)) * cohensD + 1.96 * cohensDMOE).toFixed(2);
			//CALCULATE DELTA HAT, WHICH IS HEDGE'S G UNBIASED
			deltaHat = (hedgesG * (nTotal - 3) / (nTotal - 2.25)).toFixed(2); //BAGULEY (2012)
			//CHECK IF M1; SD1; M2; SD2 ARE NUMBERS
			if(!isNaN(mOne) && !isNaN(sdOne) && !isNaN(mTwo) && !isNaN(sdTwo)){
				//CALCULATE GLASS' DELTA USING GROUP ONE'S AND GROUP TWO'S STANDARD DEVIATIONS
				//GROUP ONE AS CONTROL
				glassDeltaGroupOne = ((mOne - mTwo) / sdOne).toFixed(2); //BAGULEY (2012)
				glassDeltaUnbiasedGroupOne = ((glassDeltaGroupOne * (1 - (3 / (4 * (nOne - 1) - 1))))).toFixed(2); //GRISSOM AND KIM (2012)
				//GROUP TWO AS CONTROL
				glassDeltaGroupTwo = ((mOne - mTwo) / sdTwo).toFixed(2);  //BAGULEY (2012)
				glassDeltaUnbiasedGroupTwo = (glassDeltaGroupTwo * (1 - (3 / (4 * (nTwo - 1) - 1)))).toFixed(2); //GRISSOM AND KIM (2012)
			}
			//DETERMINE IF N1 IS EQUAL TO N2 AND CALCULATE APPROPRIATELY
			pearsonsR = nOne == nTwo ? cohensD / Math.sqrt(Math.pow(cohensD, 2) + 4) : cohensD / Math.sqrt(Math.pow(cohensD, 2) + (Math.pow(nTotal, 2) - 2 * nTotal) / (nOne * nTwo)); //FURR (2008) AND ELLIS (2010)
			//CALCULATE OMEGA SQUARED
			omegaSquared = ((Math.pow(t, 2) - 1) / (Math.pow(t, 2) + nTotal - 1)).toFixed(2); //PRIVITERA (2011)
			//FIX DECIMAL PLACES FOR REMAINING VARIABLES
			t = t.toFixed(2);
			degreesOfFreedom = parseFloat(degreesOfFreedom).toFixed(2);
			cohensD = cohensD.toFixed(2);
			hedgesG = hedgesG.toFixed(2);
		}
		//GIVEN M1; SD1; M2; SD2 & INDEPENDENT T-TEST
		else if(document.getElementById("independentTTest").checked){
			//SET VARIANCE ASSUMPTION TO EQUAL
			document.getElementById("equalVariance").checked = true
			//SET STUDENT'S T AND DEGREES OF FREEDOM (DF) TO NIL
			t = "";
			degreesOfFreedom = "";
			//CALCULATE COHEN'S D
			cohensD = (mOne - mTwo) / Math.sqrt((Math.pow(sdOne, 2) + Math.pow(sdTwo, 2)) / 2); //ELLIS (2010)
			//CALCULATE GLASS' DELTA USING GROUP ONE'S AND GROUP TWO'S STANDARD DEVIATIONS
			glassDeltaGroupOne = (glassDelta = (mOne - mTwo) / sdOne).toFixed(2); //BAGULEY (2012)
			glassDeltaGroupTwo = (glassDelta = (mOne - mTwo) / sdTwo).toFixed(2); //BAGULEY (2012)
			//CALCULATE PEARSON'S R
			pearsonsR = cohensD / Math.sqrt(Math.pow(cohensD, 2) + 4); //FURR (2008)
			//FIX DECIMAL PLACES FOR REMAINING VARIABLES
			cohensD = cohensD.toFixed(2);
		}
		//OTHERWISE CALCULATE EFFECT SIZES FOR PAIRED T-TEST
		else{
			document.getElementById("equalVariance").checked = true;
			//DETERMINE IF M1; M2; SD1 (SD DIFFERENCE); N1 SPECIFIED TO CALCULATE T, OTHERWISE USE T
			sdOne = document.getElementById("dataSourceDescriptives").checked ? sdOne : pairedMdiffSD;
			t = !isNaN(mOne) && !isNaN(mTwo) && !isNaN(sdOne) && !isNaN(nOne) ? (mOne - mTwo) / (sdOne / Math.sqrt(nOne)) : t; //BAGULEY (2012)
			studentsT = t.toFixed(2);
			//DETERMINE IF N1 SPECIFIED AND CALCULATE DEGREES OF FREEDOM (DF) ACCORDINGLY
			degreesOfFreedom = !isNaN(nOne) ? nOne - 1 : degreesOfFreedom; //BAGULEY (2012)
			//CALCULATE COHEN'S D
			cohensD = t / Math.sqrt(degreesOfFreedom); //FURR (2008)
			//CALCULATE HEDGE'S G
			hedgesG = (t / Math.sqrt(degreesOfFreedom + 1)).toFixed(2); //FURR (2008)
			//CALCULATE PEARON'S R
			pearsonsR = cohensD / Math.sqrt(Math.pow(cohensD, 2) + 1) //FURR (2008)
			//FIX DECIMAL PLACES FOR REMAINING VARIABLES
			degreesOfFreedom = degreesOfFreedom.toFixed(2);
			cohensD = cohensD.toFixed(2);
		}
		//CALCULATE ETA/R AND COHEN'S F SQUARED
		etaSquared = Math.pow(pearsonsR, 2);
		cohensFSquared = document.getElementById("pairedTTest").checked ? "" : (etaSquared / (1 - etaSquared)).toFixed(2);
		//FIX DECIMAL PLACES FOR REMAINING VARIABLES
		etaSquared = etaSquared.toFixed(2);
		pearsonsR = pearsonsR.toFixed(2);
		//OUTPUT RESULTS
		document.getElementById("studentsT").value = studentsT;
		document.getElementById("degreesOfFreedom").value = degreesOfFreedom;
		document.getElementById("nOne").value = nOne.toFixed(2);
		document.getElementById("meanOne").value = mOne.toFixed(2);
		document.getElementById("stDevOne").value = sdOne.toFixed(2);
		document.getElementById("nTwo").value = nTwo.toFixed(2);
		document.getElementById("meanTwo").value = mTwo.toFixed(2);
		document.getElementById("stDevTwo").value = sdTwo.toFixed(2);
		document.getElementById("cohensD").value = cohensD;
		document.getElementById("cohensDCI").value = cohensDCI;
		document.getElementById("hedgesG").value = hedgesG;
		document.getElementById("deltaHat").value =  deltaHat;
		document.getElementById("glassDeltaGroupOne").value = glassDeltaGroupOne;
		document.getElementById("glassDeltaUnbiasedGroupOne").value = glassDeltaUnbiasedGroupOne;
		document.getElementById("glassDeltaGroupTwo").value = glassDeltaGroupTwo;
		document.getElementById("glassDeltaUnbiasedGroupTwo").value = glassDeltaUnbiasedGroupTwo;
		document.getElementById("pearsonsR").value = pearsonsR;
		document.getElementById("etaAndRSquared").value = etaSquared;
		document.getElementById("omegaSquared").value = omegaSquared;
		document.getElementById("cohensFSquared").value = cohensFSquared;
		document.getElementById("probabilityOfSuperiority").value = probabilityOfSuperiority;
	}
	//IF INSUFFICIENT DATA WAS GIVEN, ALERT USER
	else{
		alert("Please enter some values to compute.");
	}
}
//READJUST STUDENT'S T AREA BASED ON SELECTED DATA SOURCE AND VARIANCE ASSUMPTION
function studentsTUpdate(){
	if(document.getElementById("dataSourceDescriptives").checked){
		document.getElementById("calculateTEffectSizes").value = "Calculate Effect Sizes";
	}
	else{
		document.getElementById("calculateTEffectSizes").value = "Enter Raw Data and Calculate Effect Sizes";
	}
	if(document.getElementById("pairedTTest").checked){
		document.getElementById("varianceOptions").style.visibility = "hidden";
		document.getElementById("stDevOneLabel").innerHTML = "Standard Deviation (Dif.) : ";
		document.getElementById("nOneLabel").innerHTML = "Sample Size : ";
		document.getElementById("nTwo").style.visibility = "hidden";
		document.getElementById("nTwoLabel").style.visibility = "hidden";
		document.getElementById("stDevTwo").style.visibility = "hidden";
		document.getElementById("stDevTwoLabel").style.visibility = "hidden";
	}
	else{
		document.getElementById("varianceOptions").style.visibility = "visible";
		document.getElementById("stDevOneLabel").innerHTML = "Standard Deviation 1 : ";
		document.getElementById("nOneLabel").innerHTML = "Sample Size 1 : ";
		document.getElementById("nTwo").style.visibility = "visible";
		document.getElementById("nTwoLabel").style.visibility = "visible";
		document.getElementById("stDevTwo").style.visibility = "visible";
		document.getElementById("stDevTwoLabel").style.visibility = "visible";
	}
}