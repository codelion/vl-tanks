String.prototype.replaceAt=function(index, char){
	return this.substr(0, index) + char + this.substr(index+char.length);
	}
//get url param
function get_url_param(name){
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");  
	var regexS = "[\\?&]"+name+"=([^&#]*)";  
	var regex = new RegExp( regexS );  
	var results = regex.exec( window.location.href ); 
	if( results == null )    
		return "";  
	else    
		return results[1];
	}
function getCookie(NameOfCookie){
	if (document.cookie.length > 0)
	{ begin = document.cookie.indexOf(NameOfCookie+"=");
	if (begin != -1)
	{ begin += NameOfCookie.length+1;
	end = document.cookie.indexOf(";", begin);
	if (end == -1) end = document.cookie.length;
	return unescape(document.cookie.substring(begin, end)); }
	}
	return '';
	}
function setCookie(NameOfCookie, value, expiredays){ 
	var ExpireDate = new Date ();
	ExpireDate.setTime(ExpireDate.getTime() + (expiredays * 24 * 3600 * 1000));
	document.cookie = NameOfCookie + "=" + escape(value) +
	((expiredays == null) ? "" : "; expires=" + ExpireDate.toGMTString());
	}
function delCookie(NameOfCookie){
	if (getCookie(NameOfCookie)) {
		document.cookie = NameOfCookie + "=" +
		"; expires=Thu, 01-Jan-70 00:00:01 GMT";
		}
	}
/*
ctx.strokeStyle = "#2d6";
ctx.fillStyle = "#abc";
roundRect(ctx, 100, 200, 200, 100, 50, true);
*/
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
	if (typeof stroke == "undefined" ){
		stroke = true;
		}
	if (typeof radius === "undefined"){
		radius = 5;
		}
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.lineTo(x + width - radius, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
	ctx.lineTo(x + width, y + height - radius);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	ctx.lineTo(x + radius, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
	ctx.lineTo(x, y + radius);
	ctx.quadraticCurveTo(x, y, x + radius, y);
	ctx.closePath();
	if (stroke)	
		ctx.stroke();	//borders
	if (fill)	
		ctx.fill();	//background
	}
//sort	- array.sort(sort_by('price', true, parseInt));
var sort_by = function(field, reverse, primer){
	var key = function (x) {return primer ? primer(x[field]) : x[field]};
	return function (a,b){
		var A = key(a), B = key(b);
		return ((A < B) ? -1 : (A > B) ? +1 : 0) * [-1,1][+!!reverse];                  
		}
	}	
//function to get random number from 1 to n
function randomToN(maxVal,floatVal){
	var randVal = Math.random()*maxVal;
	return typeof floatVal=='undefined'?Math.round(randVal):randVal.toFixed(floatVal);
	}
function round(number){
	return Math.round(number);
	}
function font_pixel_to_height(px){
	return Math.round(px*0.75);
	}
function ucfirst(string){
	return string.charAt(0).toUpperCase() + string.slice(1);
	}
function get_fimensions(){
	var theWidth, theHeight;
	if (window.innerWidth) {
		theWidth=window.innerWidth;
		}
	else if (document.documentElement && document.documentElement.clientWidth) {
		theWidth=document.documentElement.clientWidth;
		}
	else if (document.body) {
		theWidth=document.body.clientWidth;
		}
	if (window.innerHeight) {
		theHeight=window.innerHeight;
		}
	else if (document.documentElement && document.documentElement.clientHeight) {
		theHeight=document.documentElement.clientHeight;
		}
	else if (document.body) {
		theHeight=document.body.clientHeight;
		}
	return [theWidth, theHeight];
	}
function log(text){
	console.log(text);
	}
