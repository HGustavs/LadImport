/* 

Test Data csv compatible with our systems!

Laborationsrapport 5,0 hp
Personnummer,Namn,Betyg,Moment3,Moment4,Moment5
19212112-4421,J,G,G,VG,G
19560603-3434,N,VG,G,VG,G
19503022-4566,N,VG,G,U,G
19125874-4567,N,G,G,G,G
19865324-3567,J,U,G,G,G
20124567-3567,J,U,-,-,G
19235795-3585,N,-,U,G,G

*/

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
		var thecontent=document.getElementById("thearea").value;
		var controw=thecontent.split("\n");
		var tabrows=[];
		var tabheadings;
		var students=[];
		var results=[];
	
		if(controw.length>1){
				contheadings=controw[1].split(",");
				
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
				var alltables=document.getElementsByClassName("resultatrapportering");
				if(alltables.length>0){
						var table = alltables[0];
						console.log(table);
						var headings=[];
						if(table.rows.length>0){
								
								// Iterate over cells and collect headings by number
								for(var i=0;i<table.rows[0].cells.length;i++){
										headings[i]=table.rows[0].cells[i].innerText.trim();
								}

								// Iterate over all columns to check compatibility
								// For now, we skip over hidden columns e.g. "Anonymiseringskod" and "Titel"
								var compatibility=true;
								var reason="";
								for(var i=0;i<headings.length;i++){
										if(headings[i].length<2||headings[i]=="Anonymiseringskod"||headings[i]=="Titel / Alternativ titel"||headings[i]=="Ex.datum"||headings[i]=="Status"||headings[i].indexOf("beslutshandling")!=-1||headings[i].indexOf("Skrivningspo")!=-1){
												alert("Discarded: "+headings[i]);
										}else if(contheadings.indexOf(headings[i])==-1){
												compatibility=false;
												reason+="#"+headings[i]+"# ";
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
												// For now we assume 3 unused columns?
												if(headings.length==tabrow.cells.length+3){
														// Now we process each row / after trimming the excess characters
														var pnr=tabrow.cells[1].innerText.trim();
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

					
				}
				
		}else{
				alert("No applicable csv content yet!");
		}
		
}
	
function getup()
{
		document.body.innerHTML+="<div style='width:440px;padding:8px;height:300px;top:255px;right:20px;background-color:#fef;box-shadow:4x 4px 4px #000;border:1px solid red;position:fixed;'><textarea id='thearea' style='width:390px;height:200px;'></textarea><input type='button' value='Import' onclick='importcsv();'><br><br>If you use <a href='https://github.com/HGustavs/LadImport'>LadImport</a> please spread the word and star on gitHub</a><br>Check gitHub regularly for updates.</div>";
}