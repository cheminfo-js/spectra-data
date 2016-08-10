'use strict';

module.exports.fullClusterGenerator = function fullClusterGenerator(conMat) {
		if(typeof conMat[0] === "number"){
			return fullClusterGeneratorVector(conMat);
		}
		else{
			if(typeof conMat[0] === "array"){
				var nRows = conMat.length;
				var conn = new Array(nRows*(nRows-1)/2);
				var index = 0;
				for(var i=0;i<nRows-1;i++){
					for(var j=i+1;j<nRows;j++){
						conn[index++]= conMat[i][j];
					}
				}
				return fullClusterGeneratorVector(conn);
			}
		}

	}

function fullClusterGeneratorVector(conn){
	var nRows = Math.sqrt(conn.length*2+0.25)-0.5;
	//console.log("nRows: "+nRows+" - "+conn.length);
	var clusterList = [];
	var available = new Array(nRows);
	var remaining = nRows, i=0;
	var cluster = [];
	//Mark all the elements as available
	for(i=nRows-1;i>=0;i--){
		available[i]=1;
	}
	var nextAv=-1;
	var toInclude = [];
	while(remaining>0){
		if(toInclude.length===0){
			//If there is no more elements to include. Start a new cluster
			cluster = new Array(nRows);
			for(i=nRows-1;i>=0;i--)
				cluster[i]=0;
			clusterList.push(cluster);
			for(nextAv = nRows-1;available[nextAv]==0;nextAv--){};
		}
		else{
			nextAv=toInclude.splice(0,1);
		}
		cluster[nextAv]=1;
		available[nextAv]=0;
		remaining--;
		//Copy the next available row
		var row = new Array(nRows);
		for(i=nRows-1;i>=0;i--){
			var c=Math.max(nextAv,i);
			var r=Math.min(nextAv,i);
			//The element in the conn matrix
			//console.log("index: "+r*(2*nRows-r-1)/2+c)
			row[i]=conn[r*(2*nRows-r-1)/2+c];
			//There is new elements to include in this row?
			//Then, include it to the current cluster
			if(row[i]==1&&available[i]==1&&cluster[i]==0){
				toInclude.push(i);
				cluster[i]=1;
			}
		}
	}
	return clusterList;
}