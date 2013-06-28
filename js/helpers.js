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
	ctx.lineWidth = 1;
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
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
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
function get_dimensions(){
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
	console.log(text+" - "+arguments.callee.caller.name+"()");
	}
function drawImage_rotated(canvas, file, x, y, width, height, angle){
	var TO_RADIANS = Math.PI/180;
	var img = new Image();	
	img.src = file;
	
	canvas.save();
	canvas.translate(x, y);
	canvas.rotate(angle * TO_RADIANS);
	canvas.drawImage(img, -(width/2), -(height/2));
	canvas.restore();
	}
function convertToSlug(Text){
	return Text.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');
	}
function isIE () {
	return !!navigator.userAgent.match(/MSIE 10/);
	}
function generatePassword(limit){
	array1 = "zsdcrfvtgbhnjmkp";
	array2 = "aeou"; //yes, no i
	n1 = array1.length;
	n2 = array2.length;
	
	string = "";
	for(var i=0; i<limit; i=i+2){
		string = string + array1[getRandomInt(0, n1-1)];
		string = string + array2[getRandomInt(0, n2-1)];
		}
	
	return string;
	}
//IntegraXor Web SCADA - JavaScript Number Formatter, author: KPL, KHL
window.format=function(b,a){
	if(!b||isNaN(+a))return a;
	var a=b.charAt(0)=="-"?-a:+a,j=a<0?a=-a:0,e=b.match(/[^\d\-\+#]/g),h=e&&e[e.length-1]||".",e=e&&e[1]&&e[0]||",",b=b.split(h),a=a.toFixed(b[1]&&b[1].length),a=+a+"",d=b[1]&&b[1].lastIndexOf("0"),c=a.split(".");
	if(!c[1]||c[1]&&c[1].length<=d)
		a=(+a).toFixed(d+1);
	d=b[0].split(e);
	b[0]=d.join("");
	var f=b[0]&&b[0].indexOf("0");
	if(f>-1)	for(;c[0].length<b[0].length-f;)c[0]="0"+c[0];
	else		+c[0]==0&&(c[0]="");
	a=a.split(".");a[0]=c[0];
	if(c=d[1]&&d[d.length-1].length)
		{for(var d=a[0],f="",k=d.length%c,g=0,i=d.length;g<i;g++)f+=d.charAt(g),!((g-k+1)%c)&&g<i-c&&(f+=e);a[0]=f}
	a[1]=b[1]&&a[1]?h+a[1]:"";
	return(j?"-":"")+a[0]+a[1];
	};
function strpos(haystack, needle, offset) {
	var i = (haystack+'').indexOf(needle, (offset || 0));
	return i === -1 ? false : i;
	}
//dashed objects
CanvasRenderingContext2D.prototype.dashedRect = function(x1, y1, x2, y2, dashLen, color) {
	this.dashedLine(x1, y1, x2, y1, dashLen, color);
	this.dashedLine(x2, y1, x2, y2, dashLen, color);
	this.dashedLine(x2, y2, x1, y2, dashLen, color);
	this.dashedLine(x1, y2, x1, y1, dashLen, color);
	};
CanvasRenderingContext2D.prototype.dashedLine = function(x1, y1, x2, y2, dashLen, color) {
	x1 = x1 + 0.5;
	y1 = y1 + 0.5;
	x2 = x2 + 0.5;
	y2 = y2 + 0.5;
	this.strokeStyle = color;
	if (dashLen == undefined) dashLen = 4;
	this.beginPath();
	this.moveTo(x1, y1);
	var dX = x2 - x1;
	var dY = y2 - y1;
	var dashes = Math.floor(Math.sqrt(dX * dX + dY * dY) / dashLen);
	var dashX = dX / dashes;
	var dashY = dY / dashes;
	var q = 0;
	while (q++ < dashes) {
	x1 += dashX;
	y1 += dashY;
	this[q % 2 == 0 ? 'moveTo' : 'lineTo'](x1, y1);
	}
	this[q % 2 == 0 ? 'moveTo' : 'lineTo'](x2, y2);
	this.stroke();
	this.closePath();
	};
