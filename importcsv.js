// ------------------------------------------------------------------------------------------------------------
// -----------------=============######## Import/Export of csv for ladok ########=============-----------------
// ------------------------------------------------------------------------------------------------------------
//  Copyright a97marbr / HGustavs
//
//        (\ /)
//        (. .)           
//       c(")(")  ∴ 
//-------------------------------------------------------------------------------------------------------------

// Note: In order to comply with the GPL3 License you must publish any code based on this code using the GPL3 license. No exceptions.

function importcsv()
{
		var thecontent=document.getElementById("thearea").innerHTML;
		var controw=thecontent.split("\n");
		var tabrows=[];
		var tabheadings;
		var students=[];
		var results=[];
	
		if(controw.length>0){
				contheadings=controw[0].split(",");
				
				// Swizzle data into an easily workable qualified array / object structure
				for(var i=1;i<controw.length;i++){
						var tmprow=controw[i].split(",");
						var tmpobj=[];
						for(var j=0;j<tmprow.length;j++){
							tmpobj[contheadings[j]]=tmprow[j];
						}
						if(tmpobj['PNR']!=""){
								tabrows[tmpobj['PNR']]=tmpobj;
								results.push(tmpobj['PNR']);
						}
				}
			
				// Retrieve on-screen table
				var table = document.getElementById("contenttable");
				var headings=[];
				if(table.rows.length>0){
						// Iterate over cells and collect headings by number
						for(var i=0;i<table.rows[0].cells.length;i++){
								headings[i]=table.rows[0].cells[i].innerText;
						}
						
						// Iterate over all columns to check compatibility
						var compatibility=true;
						var reason="";
						for(var i=0;i<headings.length;i++){
								if(contheadings.indexOf(headings[i])==-1){
										compatibility=false;
										reason+=" "+headings[i];
								}
						}
						
						// If table is compatible then carry on
						if(compatibility==true){
								// List of students that do not appear in imported data
								var notappear="";
								var studappear="";
							
								// Perform update for each table row			
								for (var i = 1; i<table.rows.length; i++) {
										var tabrow=table.rows[i];
										// Check that number of columns corresponds to number of headings
										if(headings.length==tabrow.cells.length){
												// Now we process each row
												var pnr=tabrow.cells[0].innerText;
												students.push(pnr);
											
												if(typeof tabrows[pnr] === "undefined"){
														notappear+=pnr+"\n";
												}else{
														
														// Process each cell accordingly, knowing that student does exist
														for(var j=1;j<tabrow.cells.length;j++){
																var cell=tabrow.cells[j];
																colname=headings[j];
																colval=tabrows[pnr][colname];
																
																var inputs=cell.getElementsByTagName("input");
																var selects=cell.getElementsByTagName("select");
																if(inputs.length>0){
																		for(var k=0;k<inputs.length;k++){
																				inputs[k].value=colval;
																		}
																}else if(selects.length>0){
																		for(var k=0;k<selects.length;k++){
																				selects[k].value=colval;
																		}																
																}
																tabrow.style.backgroundColor="#def";
														}
														
												}
											
										}else{
												alert("On-screen table is broken since it has "+tabrow.cells.length+" columns but "+headings.length+" headings");
												break;
										}
								}
								
								// Do any students in result list not appear in students?
								for(var i=0;i<results.length;i++){
										if(students.indexOf(results[i])==-1) studappear+=results[i]+"\n"
								}
									
								// We check if any students in student list do not appear in result list
								if(notappear!=""||studappear!=""){
										alert("The following students did not appear in imported data:\n"+notappear+"\nThe following students did not appear in the results table:\n"+studappear);
								}
						}else{
								alert("Table is not compatible since following columns are missing:\n"+reason);
						}
				}else{
						alert("No applicable result rows to import data into!");
				}
				
		}else{
				alert("No applicable csv content yet!");
		}
		
}