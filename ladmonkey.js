// ==UserScript==
// @name        LadMonkey
// @namespace   moreCowbell
// @description Import grades like a chimp
// @include     https://www.start.ladok.se/gui/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @version     1
// @grant       none
// ==/UserScript==

// Add the importcvs() function here ...

$( document ).ready(function() {
		$("body").append("<div style='width:440px;padding:8px;height:300px;top:255px;right:20px;background-color:#fef;box-shadow:4x 4px 4px #000;border:1px solid red;position:fixed;'><textarea id='thearea' style='width:390px;height:200px;'></textarea><input type='button' id='importbtn' value='Import'><br><br>If you use <a href='https://github.com/HGustavs/LadImport'>LadImport</a> please spread the word and star on gitHub</a><br>Check gitHub regularly for updates.</div>");  
  	$("#importbtn").click(importcsv);
});