// ==UserScript==
// @name        LadMonkey
// @namespace   moreCowbell
// @description Import grades like a chimp
// @include     https://www.start.ladok.se/gui/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @version     1
// @grant       none
// ==/UserScript==

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

/* 
Input Data Format:

Delkurs
Betygssystem
Betygsdatum
Kolumn-rubriker (All column headings apart from Personnummer,Namn,Betyg must be manually added within LADOK)
CSV formated results

Test Data csv compatible with our systems!
---- 8< -----
Individuell uppgift 2,0 hp 1001
U-G-VG
2018-11-03
Personnummer,Namn,Betyg,Deluppgift 1 - Ikon,Deluppgift 2 - Logotyp,Deluppgift 3 - Tracing,Deluppgift 4 - Seamless border,Deluppgift 5 - Sammanslagning
19212112-4421,Greger Gregovic,G,J,G,G,VG,G
19560603-3434,Sven Lundqvist,G,N,VG,G,VG,G
19503022-4566,Conny Hill,VG,N,VG,G,U,G
19125874-4567,Benny Dill,U,N,G,G,G,G
19865324-3567,Lorf Gregovic,U,J,U,G,G,G
20124567-3567,Ken Klum,G,J,U,-,-,G
19235795-3585,Tommy Digman,VG,N,-,U,G,G
---- 8< -----
*/

$( document ).ready(function() {
  $("body").append("<div id='ladmonkeycontainer' style='width:440px;height:330px;top:255px;right:20px;background-color:#fef;box-shadow:4px 4px 4px #000;position:fixed;z-index:1000;'><div style='background-color:#614875;margin:0;height:30px;display:flex;justify-content:flex-end;'><div id='closebtn2' style='width: 30px;background-color: #f00;color: #fff;font-weight: 900;height: 30px;text-align: center;line-height: 30px;'>X</div></div><div style='padding:8px;'><textarea id='thearea' placeholder='Paste your CSV formated results here...' style='width:390px;height:200px;'></textarea><input type='button' id='importbtn' value='Import'><input type='button' id='stylebtn' value='Style'><br><br>If you use <a href='https://github.com/HGustavs/LadImport'>LadImport</a> please spread the word and star on gitHub</a><br>Check gitHub regularly for updates.</div>");  
  $("#importbtn").click(importcsv);
  $("#closebtn2").click(function(){document.getElementById("ladmonkeycontainer").style.display="none"});  
  $("#stylebtn").click(styleResult);  
  
  // Wait for resultatrapportering and then style accordingly
  var targetNode = document.body;

  // Options for the observer (which mutations to observe)
  var config = { attributes: false, childList: true, subtree: true };

  // Callback function to execute when mutations are observed
  var callback = function(mutationsList, observer) {
    for(var mutation of mutationsList) {
      if (mutation.type == 'childList') {
        //console.log('A child node has been added or removed. ',mutation.target.nodeName);
        if(mutation.target.nodeName=="TBODY"){
          var elt = mutation.target.closest("table"); 
          if (elt.className.indexOf("resultatrapportering")!==-1){
          		styleResult();
          		//observer.disconnect();
          }
        }
      }
    }
  };

  // Create an observer instance linked to the callback function
  var observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);

});

function explodecsv(instr,delimiter)
{
  var csvarr=[];
  var str="";
  var quotemode=false;
  for(var i=0;i<instr.length;i++){
      if(quotemode){
          if(instr[i]=='"'){
              quotemode=false;
          }else{
              str+=instr[i];
          }
      }else{
          if(instr[i]=='"'){
              quotemode=true;
          }else if(instr[i]==delimiter){
              csvarr.push(str);
              str="";	
          }else{
              str+=instr[i];
          }
      }
  }
  if(str!=""){
      csvarr.push(str);
  }
  return csvarr;
}

function ganderdelimiter(instr)
{
  var nocoma=0;
  var nosemi=0;
  var notab=0;
  for(var i=0;i<instr.length;i++){
      if(instr[i]==",") nocoma++;
      if(instr[i]==";") nosemi++;			
    	if(instr[i]=="\t") notab++;			
  }
  if(nosemi>nocoma&&nosemi>notab) return ";"
  else if(notab>nosemi&&notab>nocoma) return "\t"
  else return ","
}

function styleResult(){
 	$(".kolumn-notering input").each(function(){      
    let colval=this.value;
    if(colval=="G"){
      this.style.backgroundColor="#B2DFDB";
      this.style.color="#000";
    }else if(colval=="VG"){
      this.style.backgroundColor="#009688";
      this.style.color="#fff";
    }else if(colval=="U"){
      this.style.backgroundColor="#E91E63";
      this.style.color="#fff";
    }
  })
}

function importcsv()
{
  var thecontent=document.getElementById("thearea").value;
  var controw=thecontent.split("\n");
  var tabrows=[];
  var tabheadings;
  var students=[];
  var results=[];
  var examdate= new Date();
  var importcoursemodule="UNK"
  var ladokcoursemodule="UNK";
  var gradeScale="UNK";
  var contheadings=[];
  var delimiter=",";

  /*
  importcoursemodule=controw[0];
  $("underlag-rubrik span").each(function(){ladokcoursemodule=this.innerHTML});  	  	
  if(ladokcoursemodule.indexOf(importcoursemodule)===-1||importcoursemodule===""){
      alert("You are trying to import grades for: "+importcoursemodule+" but this is the result area for: "+ladokcoursemodule);
  }else{       

    examdate=controw[2];  	
*/
    if(controw.length>3){
        delimiter=ganderdelimiter(controw[3])
      	// Get the import setup (delkurs, exam date, grade scale)
      	importcoursemodule=explodecsv(controw[0],delimiter)[0];
      	gradeScale=explodecsv(controw[1],delimiter)[0];
      	examdate=explodecsv(controw[2],delimiter)[0];
        $("underlag-rubrik span").each(function(){ladokcoursemodule=this.innerHTML});  	  	
        if(ladokcoursemodule.indexOf(importcoursemodule)===-1||importcoursemodule===""){
            alert("You are trying to import grades for: "+importcoursemodule+" but this is the result area for: "+ladokcoursemodule);
        }      
        contheadings=explodecsv(controw[3],delimiter);

        // Swizzle data into an easily workable qualified array / object structure
        for(var i=3;i<controw.length;i++){
            var tmprow=explodecsv(controw[i],delimiter);
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
                        let t=heading.innerText.trim();

                        // Only push first-calls visible columns
                        if(t!="Anonymiseringskod"&&t!="Titel / Alternativ titel"&&t.indexOf("till beslutshandling")==-1){
                            headings.push(t);
                        }
                    }

                }

                // Iterate over all columns to check compatibility
                var compatibility=true;
                var reason="";
              	console.log(headings);
              	console.log(contheadings)
                for(let i=0;i<contheadings.length;i++){
                  	let importheading=contheadings[i];
                  	if(headings.indexOf(importheading)===-1){
                      	if(importheading!==importcoursemodule){
                            compatibility=false;
                            reason+="Column '"+importheading+"' not found!\n";                           
                        }
                    }
                }                
              	if(!compatibility){
                 		alert("Import not possible due to compatibility!\n\n"); 
                }
                /*
                for(var i=0;i<headings.length;i++){
                    if(headings[i].length<2||headings[i]=="Titel / Alternativ titel"||headings[i]=="Ex.datum"||headings[i]=="Status"||headings[i].indexOf("beslutshandling")!=-1||headings[i].indexOf("Skrivningspo")!=-1){
                        // console.log("Discarded: "+headings[i]);
                    }else if(contheadings.indexOf(headings[i])==-1){
                        compatibility=false;
                        reason+="#"+headings[i]+"# ";
                    }
                }                
                */
              	
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
                            //var pnr=tabrow.cells[1].innerText.trim();
                            var pnr=tabrow.cells[1].innerText.trim().substring(0,13);                                                      	
                            students.push(pnr);

                            if(typeof tabrows[pnr] === "undefined"){
                                notappear+=pnr+"\n";
                            }else{
                                // Process each cell accordingly, knowing that student does exist
                                var cnt=1;
                                var colcnt=0;
                                var cell;
                                var isHere=false;
                                for(var j=0;j<headings.length;j++){
                                    cell=tabrow.cells[j];
                                    if(j==0) {
                                        let checkboxes=cell.getElementsByTagName("input");
                                        for(let k=0;k<checkboxes.length;k++){
                                            checkbox=checkboxes[k];
                                        }
                                    }
                                    colname=headings[j];
                                    if(colname=="Betyg"){
                                      colval=tabrows[pnr][importcoursemodule];
                                      colname="Betyg";
                                    }else{
                                      colval=tabrows[pnr][colname];
                                    }                                    

                                    if(typeof colval !== "undefined"){		
                                        var inputs=cell.getElementsByTagName("input");
                                        var selects=cell.getElementsByTagName("select");

                                        if(inputs.length>0){
                                            for(var k=0;k<inputs.length;k++){
                                                if(colname=="Ex.datum"){
                                                    if(isHere){
                                                        inputs[k].value=examdate;
                                                        inputs[k].dispatchEvent(new Event('change', { 'bubbles': true }));
                                                        checkbox.checked=true;
                                                        checkbox.style.backgroundColor="#009688";
                                                        checkbox.style.color="#fff";
                                                    }                                                    
                                                }else{
                                                    if(colval!=="-"){
                                                        inputs[k].value=colval;
                                                        inputs[k].dispatchEvent(new Event('change', { 'bubbles': true }));

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
                                            if(colname=="Betyg"){
                                                if(gradeScale==="U-G-VG"){
                                                    if(colval=="VG") colval="number:101313";
                                                    if(colval=="G") colval="number:101314";
                                                    if(colval=="U") colval="number:101315";  
                                                }else if(gradeScale==="U-G"){
                                                    if(colval=="G") colval="number:2302";
                                                    if(colval=="U") colval="number:2303";      
                                                }else{
                                                    alert("Grade scale "+gradeScale+" needs to be implemented...")
                                                }
                                            }

                                            for(var k=0;k<selects.length;k++){
                                                selects[k].value=colval;

                                                if(colval.indexOf("-")==-1){
                                                    isHere=true;
                                                    selects[k].dispatchEvent(new Event('change', { 'bubbles': true }));
                                                }

                                                if(colval=="number:101314"||colval=="number:2302"){
                                                    selects[k].style.backgroundColor="#B2DFDB";
                                                    selects[k].style.color="#000";
                                                }else if(colval=="number:101313"){
                                                    selects[k].style.backgroundColor="#009688";
                                                    selects[k].style.color="#fff";
                                                }else if(colval=="number:101315"||colval=="number:2303"){
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
        $("ladok-spara-knapp button").each(function(){
            this.disabled=false;
        });
    }else{
        alert("No applicable csv content yet!");
    }

//}
}