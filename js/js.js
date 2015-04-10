var locked=trypattern=false,patternDots=[],patterns=[],linex=liney=0,storedpatterns=[];
//canvas for dots
var c = document.getElementById("pattern-lock");
c.setAttribute('height',315);
c.setAttribute('width',315);
var ctx=c.getContext("2d");
//canvas for lines
var cline = document.getElementById("pattern-lock-line");
cline.setAttribute('height',315);
cline.setAttribute('width',315);
var ctxline=cline.getContext("2d");

//Draw the pattern
$(document).ready(function(){
	setTime("time");
	setTime("main-time");
	setDate("main-date");
	(function(){
		var w=315;
		var h=315;
		var cw=Math.floor(w/2);
		var ch=Math.floor(h/2);
		var colw=Math.floor(w/3);
		var rowh=Math.floor(h/3);
		var points=[
			{x:cw-colw, y:ch-rowh},
			{x:cw, y:ch-rowh},
			{x:cw+colw, y:ch-rowh},

			{x:cw-colw, y:ch},
			{x:cw, y:ch},
			{x:cw+colw, y:ch},

			{x:cw-colw, y:ch+rowh},
			{x:cw, y:ch+rowh},
			{x:cw+colw, y:ch+rowh},
		];
		var options={};
		for (var i = 0; i < points.length; i++) {
			patternDots[i]=new Dot(i,points[i]);
		};
	})();
});


//touch start
$("#pattern-lock").on('touchstart mousedown',function(e){
	var check=checkInsideDots(e);
	if(check!==false){
		trypattern=true;
		patternDots[check]._startDrawing();
	}
	
});
//on touch move
$("#pattern-lock").on('touchmove mousemove',function(e){
	var check=checkInsideDots(e);
	if(check!==false&&trypattern){
		patternDots[check]._moveDrawing();
	}
});
//on touch end
$("#pattern-lock").on('touchend mouseup',function(e){
	if(locked){
		if(patterns.join()===storedpatterns.join()){
			trypattern=false;
			alert('Success, the pattern matches');
			for (var i = 0; i < patternDots.length; i++) {
				if(patternDots[i]._selected){
					patternDots[i]._resetOuterCircle("#ffffff");
				}
			};
			ctxline.clearRect(0,0,315,315);
		}else{
			for (var i = 0; i < patternDots.length; i++) {
				if(patternDots[i]._selected){
					patternDots[i]._resetOuterCircle("#ff4346");
				}
			};
			trypattern=false;
			alert('Sorry, Wrong Pattern');
			for (var i = 0; i < patternDots.length; i++) {
				patternDots[i]._resetOuterCircle("#ffffff");
			};
			ctxline.clearRect(0,0,315,315);		
		}
	}else{
		storedpatterns=patterns.slice();
		locked=true;
		alert('Pattern stored Successfully, try it to unlock the app');
		$("#pattern-lock-container aside").html('');
		trypattern=false;
		for (var i = 0; i < patternDots.length; i++) {
			if(patternDots[i]._selected){
				patternDots[i]._resetOuterCircle("#ffffff");
			}
		};
		ctxline.clearRect(0,0,315,315);
	}
	
});

//check whether mouse is inside the pattern dot
function checkInsideDots(e){
	var X,Y,ret=false;
	if(e.offsetX) {
        X = e.offsetX;
        Y = e.offsetY;
    }
    else if(e.layerX) {
        X = e.layerX;
        Y = e.layerY;
    }
    for (var i = 0; i < patternDots.length; i++) {
    	if(patternDots[i]._checkInside(X,Y)){
    		ret=i;
    		break;
    	}
    };
    return ret;
}

//Pattern Dot object constructor

function Dot(id,options){
	var self=this;
	this._id=id;
	this._x=options.x;
	this._y=options.y;
	this._selected=false;
	this._innerCircle=new Circle(self._x,self._y,7,true);
	this._outerCircle=new Circle(self._x,self._y,35,false,'#ffffff');
	this._checkInside=function(x,y){
		var dx = x - this._x;
        var dy = y - this._y;
        return dx * dx + dy * dy <= 35*35;
	};
	this._startDrawing=function(){
		patterns=[this._id];
		new Circle(this._x,this._y,35,false,'#7ed500');
		this._selected=true;
		linex=this._x;
		liney=this._y;
		ctxline.beginPath();
	};
	this._moveDrawing=function(){
		if(!this._selected){
			patterns.push(this._id);
			ctxline.moveTo(linex,liney);
		    ctxline.lineTo(this._x,this._y);
		    ctxline.lineWidth = 5;
		    ctxline.strokeStyle = "#ccc"; 
		    ctxline.stroke();
		    linex=this._x;
			liney=this._y;
			this._selected=true;
			new Circle(this._x,this._y,35,false,'#7ed500');
		}
	};
	this._resetOuterCircle=function(color){
		new Circle(this._x,this._y,35,false,color);
		this._selected=false;
	};
}
//Circle helper constructor function
function Circle(x,y,r,fill,color){
	ctx.beginPath();
	ctx.arc(x,y,r,0,2*Math.PI);
	if(fill){
		ctx.fillStyle="#ffffff";
		ctx.fill();	
	}else{
		ctx.lineWidth=3;
		ctx.strokeStyle = color;
		ctx.stroke();	
	}
	return ctx;
}
//Time
function setTime(container){
	var today=new Date(),h=today.getHours(),m=today.getMinutes();
	$("#"+container).html(h+':'+m);
	setTimeout(function(){
		setTime(container);
	},3000)
}
//Date
function setDate(container){
	var today=new Date();
	var days=new Array('SUN', 'MON', 'Tue', 'WED', 'THU','FRI','SAT');
	var months=new Array('JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER');
	var day=days[today.getDay()];
	var month=months[today.getMonth()];
	$("#"+container).html(day+', '+month+' '+today.getDate());
}
