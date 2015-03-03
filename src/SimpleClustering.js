var SimpleClustering={

	/*This function returns the cluster list for a given connectivity matrix.
	*To improve the performance, the connectivity(square and symmetric) matrix 
	*is given as a single vector containing  the upper diagonal of the matrix
	*Note: This algorithm is O(n*n) complexity. I wonder if there is something better. 
	*acastillo
	*/
	fullClusterGenerator:function(conn){
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
		    //console.log("row: "+nextAv);
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
				//console.log("col: "+i+":"+row[i]);
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
}