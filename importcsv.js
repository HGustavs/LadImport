/* 

Test Data csv compatible with our systems!

Individuell uppgift 2,0 hp 1001
2018-11-03
Personnummer,Namn,Betyg,Deluppgift 1 - Ikon,Deluppgift 2 - Logotyp,Deluppgift 3 - Tracing,Deluppgift 4 - Seamless border,Deluppgift 5 - Sammanslagning
19212112-4421,Greger Gregovic,G,J,G,G,VG,G
19560603-3434,Sven Lundqvist,G,N,VG,G,VG,G
19503022-4566,Conny Hill,VG,N,VG,G,U,G
19125874-4567,Benny Dill,U,N,G,G,G,G
19865324-3567,Lorf Gregovic,U,J,U,G,G,G
20124567-3567,Ken Klum,G,J,U,-,-,G
19235795-3585,Tommy Digman,VG,N,-,U,G,G

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
// Note: For Now, we strongly advise that you manually confirm that the results have been imported correctly


function importcsv()
{
		var thecontent=document.getElementById("thearea").value;
		var controw=thecontent.split("\n");
		var tabrows=[];
		var tabheadings;
		var students=[];
		var results=[];
		var examdate= new Date();
	
		examdate=new Date(controw[1]);

		if(controw.length>1){
				contheadings=controw[2].split(",");
				
				// Swizzle data into an easily workable qualified array / object structure
				for(var i=3;i<controw.length;i++){
						var tmprow=controw[i].split(",");
						var tmpobj=[];
						for(var j=0;j<tmprow.length;j++){
							tmpobj[contheadings[j]]=tmprow[j];
						}
						tmpobj["Ex.datum"]=examdate;
						if(tmpobj['Personnummer']!=""){
								tabrows[tmpobj['Personnummer']]=tmpobj;
								results.push(tmpobj['Personnummer']);
						}
				}
			
				// Retrieve on-screen table!
				var alltables=document.getElementsByClassName("resultatrapportering");
				if(alltables.length>0){
						var table = alltables[0];
						var headings=[];
						headings.push("UNK");
						if(table.rows.length>0){

								//console.log(headings);
							
								// Iterate over cells and collect headings by number
								for(var i=0;i<table.rows[0].cells.length;i++){
                    var heading=table.rows[0].cells[i]
                    if(heading.innerText.trim()==""){
                        console.log("Discarding: ",heading.innerText.trim());		
                    }else{
                        headings.push(heading.innerText.trim());
                    }

								}

								// Iterate over all columns to check compatibility
                // For now, we skip over hidden columns e.g. "Anonymiseringskod" and "Titel"
                /*
								var compatibility=true;
								var reason="";
								for(var i=0;i<headings.length;i++){
										if(headings[i].length<2||headings[i]=="Titel / Alternativ titel"||headings[i]=="Ex.datum"||headings[i]=="Status"||headings[i].indexOf("beslutshandling")!=-1||headings[i].indexOf("Skrivningspo")!=-1){
												// console.log("Discarded: "+headings[i]);
										}else if(contheadings.indexOf(headings[i])==-1){
												compatibility=false;
												reason+="#"+headings[i]+"# ";
										}
                }                
                */
								compatibility=true;

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
												//if(headings.length+4==tabrow.cells.length){
												if(1){
														// Now we process each row / after trimming the excess characters
														var pnr=tabrow.cells[1].innerText.trim();
														students.push(pnr);
														
														if(typeof tabrows[pnr] === "undefined"){
																notappear+=pnr+"\n";
														}else{
																// Process each cell accordingly, knowing that student does exist
                                var cnt=1;
                                var colcnt=0;
                                var cell;
                                var isHere=false;
                                var checkbox=null;
                                for(var j=0;j<headings.length;j++){
                                    cell=tabrow.cells[colcnt];
                                    if(j==0) {
                                        checkbox=null;
                                        let checkboxes=cell.getElementsByTagName("input");
                                        for(let k=0;k<checkboxes.length;k++){checkbox=checkboxes[k];}
                                    }
                                    isHere=false;
                                    colname=headings[j];                                    
                                    colval=tabrows[pnr][colname];
																		if(typeof colval !== "undefined"){		
                                        colcnt++;														
                                        
                                        // If there are hidden cells in the tabrow we skip until we get a visable cell
                                        while(cell.classList.contains("ng-hide")){colcnt++;cell=tabrow.cells[colcnt];}

                                        if(colname=="Betyg"&&colval=="VG") colval="number:101313";
                                        if(colname=="Betyg"&&colval=="G") colval="number:101314";
                                        if(colname=="Betyg"&&colval=="U") colval="number:101315";
                                        
																				var inputs=cell.getElementsByTagName("input");
                                        var selects=cell.getElementsByTagName("select");
																				if(inputs.length>0){
																						for(var k=0;k<inputs.length;k++){
																								if(colname=="Ex.datum"){
                                                    if(isHere){
                                                        inputs[k].value=examdate;
                                                        checkbox.checked=true;
                                                        checkbox.style.backgroundColor="#009688";
                                                        checkbox.style.color="#fff";
                                                    }                                                    
																								}else{
                                                    if(colval!=="-"){
                                                        inputs[k].value=colval;

                                                        if(colval=="G"){
                                                            inputs[k].style.backgroundColor="#B2DFDB";
                                                            inputs[k].style.color="#000";
                                                        }else if(colval=="VG"){
                                                            inputs[k].style.backgroundColor="#009688";
                                                            inputs[k].style.color="#fff";
                                                        }else if(colval=="U"){
                                                            inputs[k].style.backgroundColor="#E91E63";
                                                            inputs[k].style.color="#fff";
                                                        }
                                                    }
																								}
																						}
																				}else if(selects.length>0){
																						for(var k=0;k<selects.length;k++){
                                                selects[k].value=colval;
                                              
                                                if(colval.indexOf("-")==-1) isHere=true;
                                              
                                                if(colval=="number:101314"){
                                                    selects[k].style.backgroundColor="#B2DFDB";
                                                    selects[k].style.color="#000";
                                                }else if(colval=="number:101313"){
                                                    selects[k].style.backgroundColor="#009688";
                                                    selects[k].style.color="#fff";
                                                }else if(colval=="number:101315"){
                                                    selects[k].style.backgroundColor="#E91E63";
                                                    selects[k].style.color="#fff";
                                                }
																						}																
																				}
																		}else{
																				//console.log("Ignoring: "+colname);
																		}
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
		document.body.innerHTML+="<div style='width:440px;padding:8px;height:300px;top:255px;right:20px;background-color:#fef;box-shadow:4x 4px 4px #000;border:1px solid red;position:fixed;z-index:15000;'><textarea id='thearea' style='width:390px;height:200px;'></textarea><input type='button' value='Import' onclick='importcsv();'><br><br>If you use <a href='https://github.com/HGustavs/LadImport'>LadImport</a> please spread the word and star on gitHub</a><br>Check gitHub regularly for updates.</div>";
}	
