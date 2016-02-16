var PeakOptimizer={
	diagonalError:0.05,
	tolerance:0.05,
	DEBUG:false,
    toleranceX : 0.025,
    toleranceY : 0.5,

    clean: function(peaks, threshold){
        var max = Number.NEGATIVE_INFINITY;
        var i,peak;
        //double min = Double.MAX_VALUE;
        for(i=peaks.length-1;i>=0;i--){
            if(Math.abs(peaks[i].z)>max)
                max=Math.abs(peaks[i].z);
        }
        max*=threshold;
        for(i=peaks.length-1;i>=0;i--){
            if(Math.abs(peaks[i].z)<max)
                peaks.splice(i,1);
        }
        return peaks;
    },
	
	enhanceSymmetry: function(signals){
		
		var properties = this.initializeProperties(signals);
		var output = signals;

		if(this.DEBUG)
			console.log("Before optimization size: "+output.size());
		
		//First step of the optimization: Symmetry validation
		var i,hits,index;
		var signal;
		for(i=output.length-1;i>=0;i--){
			signal = output[i];
			if(signal.peaks.length>1)
				properties[i][1]++;
			if(properties[i][0]==1){
				index = this.exist(output, properties, signal,-1,true);
				if(index>=0){
					properties[i][1]+=2;
					properties[index][1]+=2;
				}
			}
		}
		//Second step of the optimization: Diagonal image existence
		for(i=output.length-1;i>=0;i--){
			signal = output[i];
			if(properties[i][0]==0){
				hits = this.checkCrossPeaks(output, properties, signal, true);
				properties[i][1]+=hits;
				//checkCrossPeaks(output, properties, signal, false);
			}
		}
		
		//Now, each peak have a score between 0 and 4, we can complete the patterns which
		//contains peaks with high scores, and finally, we can remove peaks with scores 0 and 1
		var count = 0;
		for(i=output.length-1;i>=0;i--){
			if(properties[i][0]!==0&&properties[i][1]>2){
				count++;
				count+=this.completeMissingIfNeeded(output,properties,output[i],properties[i]);
			}
			if(properties[i][1]>=2&&properties[i][0]===0)
				count++;
		}
		
		if(this.DEBUG)
			console.log("After optimization size: "+count);
		var  toReturn = new Array(count);
		count--;
		for(i=output.length-1;i>=0;i--){
			if(properties[i][0]!==0&&properties[i][1]>2
					||properties[i][0]===0&&properties[i][1]>1){
				toReturn[count--]=output[i];
			}
			else{
				console.log("Removed "+i+" "+output[i].peaks.length);
			}
			//if(properties.get(i)[1]>=2)
			//	toReturn[count--]=output.get(i);
		}
		return toReturn;
	},
	
	completeMissingIfNeeded: function(output, properties, thisSignal, thisProp) {
		//Check for symmetry
		var index = this.exist(output, properties, thisSignal,-thisProp[0],true);
		var addedPeaks=0;
		var newSignal = null, tmpProp=null;
		if(index<0){//If this signal have no a symmetry image, we have to include it
			newSignal = {nucleusX:thisSignal.nucleusX,nucleusY:thisSignal.nucleusY};
			newSignal.resolutionX=thisSignal.resolutionX;
			newSignal.resolutionY=thisSignal.resolutionY;
			newSignal.shiftX=thisSignal.shiftY;
			newSignal.shiftY=thisSignal.shiftX;
			newSignal.peaks = [{x:thisSignal.shiftY,y:thisSignal.shiftX,z:1}];
			output.push(newSignal);
			tmpProp = [-thisProp[0],thisProp[1]];
			properties.push(tmpProp);
			addedPeaks++;
		}
		//Check for diagonal peaks
		var j=0;
		var diagX=false, diagY=false;
		var signal;
		for(j=output.length-1;j>=0;j--){
			signal = output[j];
			if(properties[j][0]===0){
				if(Math.abs(signal.shiftX-thisSignal.shiftX)<this.diagonalError)
					diagX=true;
				if(Math.abs(signal.shiftY-thisSignal.shiftY)<this.diagonalError)
					diagY=true;
			}
		}
		if(diagX===false){
			newSignal = {nucleusX:thisSignal.nucleusX,nucleusY:thisSignal.nucleusY};
			newSignal.resolutionX=thisSignal.resolutionX;
			newSignal.resolutionY=thisSignal.resolutionY;
			newSignal.shiftX=thisSignal.shiftX;
			newSignal.shiftY=thisSignal.shiftX;
			newSignal.peaks = [{x:thisSignal.shiftX,y:thisSignal.shiftX,z:1}];
			output.push(newSignal);
			tmpProp = [0,thisProp[1]];
			properties.push(tmpProp);
			addedPeaks++;
		}
		if(diagY===false){
			newSignal = {nucleusX:thisSignal.nucleusX,nucleusY:thisSignal.nucleusY};
			newSignal.resolutionX=thisSignal.resolutionX;
			newSignal.resolutionY=thisSignal.resolutionY;
			newSignal.shiftX=thisSignal.shiftY;
			newSignal.shiftY=thisSignal.shiftY;
			newSignal.peaks = [{x:thisSignal.shiftY,y:thisSignal.shiftY,z:1}];
			output.push(newSignal);
			tmpProp = [0,thisProp[1]];
			properties.push(tmpProp);
			addedPeaks++;
		}
		return addedPeaks;
		
	},
	
	//Check for any diagonal peak that match this cross peak
	checkCrossPeaks: function(output, properties, signal, updateProperties) {
		var hits = 0, i=0, shift=signal.shiftX*4;
		var crossPeaksX = [],crossPeaksY = [];
		var cross;
		for(i=output.length-1;i>=0;i--){
			cross = output[i];
			if(properties[i][0]!==0){
				if(Math.abs(cross.shiftX-signal.shiftX)<this.diagonalError){
					hits++;
					if(updateProperties)
						properties[i][1]++;
					crossPeaksX.push(i);
					shift+=cross.shiftX;
				}
				else{
					if(Math.abs(cross.shiftY-signal.shiftY)<this.diagonalError){
						hits++;
						if(updateProperties)
							properties[i][1]++;
						crossPeaksY.push(i);
						shift+=cross.shiftY;
					}
				}
			}
		}
		//Update found crossPeaks and diagonal peak
		shift/=(crossPeaksX.length+crossPeaksY.length+4);
		if(crossPeaksX.length>0){
			for( i=crossPeaksX.length-1;i>=0;i--){
				output[crossPeaksX[i]].shiftX=shift;
			}
		}
		if(crossPeaksY.length>0){
			for( i=crossPeaksY.length-1;i>=0;i--){
				output[crossPeaksY[i]].shiftY=shift;
			}
		}
		signal.shiftX=shift;
		signal.shiftY=shift;
		return hits;
	},

	exist: function(output, properties, signal, type, symmetricSearch) {
		for(var i=output.length-1;i>=0;i--){
			if(properties[i][0]==type){
				if(this.distanceTo(signal, output[i], symmetricSearch)<this.tolerance){
					if(!symmetricSearch){
						var shiftX=(output[i].shiftX+signal.shiftX)/2.0;
						var shiftY=(output[i].shiftY+signal.shiftY)/2.0;
						output[i].shiftX=shiftX;
						output[i].shiftY=shiftY;
						signal.shiftX=shiftX;
						signal.shiftY=shiftY;
					}
					else{
						var shiftX=signal.shiftX;
						var shiftY=output[i].shiftX;
						output[i].shiftY=shiftX;
						signal.shiftY=shiftY;
					}
					return i;
				}
			}
		}
		return -1;
	},
	/**
	 * We try to determine the position of each signal within the spectrum matrix.
	 * Peaks could be of 3 types: upper diagonal, diagonal or under diagonal 1,0,-1
	 * respectively.
	 * @param Signals
	 * @return A matrix containing the properties of each signal
	 */
	initializeProperties: function(signals){
		var signalsProperties = new Array(signals.length);
		for(var i=signals.length-1;i>=0;i--){
			signalsProperties[i]=[0,0];
			//We check if it is a diagonal peak
			if(Math.abs(signals[i].shiftX-signals[i].shiftY)<=this.diagonalError){
				signalsProperties[i][1]=1;
				//We adjust the x and y value to be symmetric.
				//In general chemical shift in the direct dimension is better than in the other one,
				//so, we believe more to the shiftX than to the shiftY.
				var shift = (signals[i].shiftX*2+signals[i].shiftY)/3.0;
				signals[i].shiftX=shift;
				signals[i].shiftY=shift;
			}
			else{
				if(signals[i].shiftX-signals[i].shiftY>0)
					signalsProperties[i][0]=1;
				else
					signalsProperties[i][0]=-1;
			}
		}
		return signalsProperties;
	},
	
	/**
	 * This function calculates the distance between 2 nmr signals . If toImage is true, 
	 * it will interchange x by y in the distance calculation for the second signal.
	 */
	distanceTo: function(a, b, toImage){
		if(!toImage){
			return Math.sqrt(Math.pow(a.shiftX-b.shiftX, 2)
					+Math.pow(a.shiftY-b.shiftY, 2));
		}
		else{
			return Math.sqrt(Math.pow(a.shiftX-b.shiftY, 2)
					+Math.pow(a.shiftY-b.shiftX, 2));
		}
	},

	/**
	 * This function maps the corresponding 2D signals to the given set of 1D signals
	 */
	alignDimensions:function(signals2D,references){
		//For each reference dimension
		for(var i=0;i<references.length;i++){
			var ref = references[i];
			if(ref)
				this._alignSingleDimension(signals2D,ref);
		}
	},

	_alignSingleDimension: function(signals2D, references){
		//For each 2D signal
		var center = 0, width = 0, i, j;
		for(i=0;i<signals2D.length;i++){
			var signal2D = signals2D[i];
			//For each reference 1D signal
			for(j=0;j<references.length;j++){
				center = (references[j].startX+references[j].stopX)/2;
				width = Math.abs(references[j].startX-references[j].stopX)/2;
				if(signal2D.nucleusX==references[j].nucleus){
					//The 2D peak overlaps with the 1D signal
					if(Math.abs(signal2D.shiftX-center)<=width){
						signal2D._highlight.push(references[j]._highlight[0]);
					}

				}
				if(signal2D.nucleusY==references[j].nucleus){
					if(Math.abs(signal2D.shiftY-center)<=width){
						signal2D._highlight.push(references[j]._highlight[0]);
					}
				}
			}

		}
	}

};

module.exports = PeakOptimizer;