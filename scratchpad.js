function fibHelper(n) {
  var value;
  var div = document.createElement('div');
  div.setAttribute("class", "fib");
  if (n < 2) {
    if (n === 0) {
      value = 0;
    } 
    else if (n === 1) {
      value = 1;
    }
    var p = document.createElement('p');
    p.textContent = 'Fib(' + n + ') = ' + value;
    div.appendChild(p);
  } 
  else {
    var left = fibHelper(n - 1);
    left.html.setAttribute("class", "fib-left");
    left.html.style.float = "left";
    left.html.style.display = "inline-block";
    left.html.style.marginLeft = "4px";
    left.html.style.backgroundColor = "rgba(0,0,255,0.1)";
    
    var right = fibHelper(n - 2);
    right.html.setAttribute("class", "fib-right");
    right.html.style.float = "right";
    right.html.style.display = "inline-block";
    right.html.style.marginRight = "4px";
    right.html.style.backgroundColor = "rgba(0,0,255,0.1)";

    value = left.value + right.value;
    p = document.createElement('p');
    p.textContent = 'Fib(' + n + ') = ' + value;
    div.appendChild(p);
    
    div.appendChild(left.html);
    div.appendChild(right.html);
  }
  return { 'value': value, 'html': div };
}



var fib = function (n, node) {
  var tree = fibHelper(n);
  node.appendChild(tree.html);
  node.style.float = "center";
  node.style.display = "inline-block";
  node.setAttribute("id", "fib");
};


function triHelper(n) {
  var value;
  var div = document.createElement('div');
  div.setAttribute("class", "tri");
  if (n < 3) {
    if (n === 0) {
      value = 0;
    } 
    else if (n === 1) {
      value = 0;
    }
    else if (n ===2){
        value = 1;
    }
    var p = document.createElement('p');
    p.textContent = 'Tri(' + n + ') = ' + value;
    div.appendChild(p);
  } 
  else {
    var left = triHelper(n - 1);
    left.html.setAttribute("class", "tri-left");
    left.html.style.float = "left";
    left.html.style.display = "inline-block";
    left.html.style.marginRight = "4px";
    left.html.style.backgroundColor = "rgba(0,255, 0,0.1)";

    var center = triHelper(n - 2);
    center.html.setAttribute("class", "tri-center");
    center.html.style.float = "left";
    center.html.style.display = "inline-block";
    center.html.style.marginRight = "4px";
    center.html.style.backgroundColor = "rgba(0,255, 0,0.1)";

    var right = triHelper(n - 3);
    right.html.setAttribute("class", "tri-right");
    right.html.style.float = "right";
    right.html.style.display = "inline-block";
    right.html.style.marginRight = "4px";
    right.html.style.backgroundColor = "rgba(0,255,0,0.1)";

    value = left.value + center.value + right.value;
    p = document.createElement('p');
    p.textContent = 'Tri(' + n + ') = ' + value;
    div.appendChild(p);
    
    div.appendChild(left.html);
    div.appendChild(center.html);
    div.appendChild(right.html);
  }
  return { 'value': value, 'html': div };
}

var tri = function (n, node) {
    var tree = triHelper(n);
    node.appendChild(tree.html);
    node.setAttribute("id", "tri");
    node.style.float = "center";
    node.style.display = "inline-block";
};


function pellHelper(n) {
  var value;
  var div = document.createElement('div');
  div.setAttribute("class", "pell");
  if (n < 2) {
    if (n === 0) {
      value = 0;
    } 
    else if (n === 1) {
      value = 1;
    }
    var p = document.createElement('p');
    p.textContent = 'Pell(' + n + ') = ' + value;
    div.appendChild(p);
  } 
  else {
    var left = pellHelper(n - 1);
    left.html.setAttribute("class", "pell-left");
    left.html.style.float = "left";
    left.html.style.display = "inline-block";
    left.html.style.marginLeft = "4px";
    left.html.style.backgroundColor = "rgba(0,0,255,.1)";

    var right = pellHelper(n - 2);
    right.html.setAttribute("class", "pell-right");
    right.html.style.float = "right";
    right.html.style.display = "inline-block";
    right.html.style.marginRight = "4px";
    right.html.style.backgroundColor = "rgba(0,0,255,0.1)";

    value = 2 *(left.value) + right.value;
    p = document.createElement('p');
    p.textContent = 'Pell(' + n + ') = ' + value;
    div.appendChild(p);
    
    div.appendChild(left.html);
    div.appendChild(right.html);
  }
  return { 'value': value, 'html': div };
}

var pell = function (n, node) {
  var tree = pellHelper(n);
  node.appendChild(tree.html);
  node.style.float = "center";
  node.style.display = "inline-block";
  node.setAttribute("id", "pell");
};


document.title = "JavaScript Recursive Sequences";

var style = document.createElement('style');
style.textContent = 
	"#fib {" +
	"	display: inline-block;" +
	"	width: 20000px;" +
	"}" +
	"" +
	".fib {" +
	"	background-color: rgba(0,0,255,0.1);" +
	"}" +
	"#tri {" +
	"	display: inline-block;" +
	"	width: 40000px;" +
	"}" +
	"" +
	".tri {" +
	"	background-color: rgba(0,255,0,0.1);" +
	"}" +
	"#pell {" +
	"	display: inline-block;" +
	"	width: 20000px;" +
	"}" +
	"" +
	".pell {" +
	"	background-color: rgba(0,255,0,0.1);" +
	"}" +
	".shadowed {" +
	"	text-shadow: 1px 1px 2px black;" +
	"	color:       white;" +
	"}" +
	".stuff-box {" +
	"	font-family: 'helvetica neue', helvetica, sans-serif;" +
	"	letter-spacing: 1px;" +
	"	text-transform: capitalize;" +
	"	text-align: center;" +
	"	padding: 3px 10px;" +
	"	margin: 10px;" +
	"	cursor: pointer;" +
	"	border-radius: 10px;" +
	"	border-width: 2px;" +
	"	border-style: solid;" +
	"}" +
	"" +
	".red {" +
	"	border-color: rgb(255,0,0);" +
	"	background:   rgb(180,60,60);" +
	"	box-shadow: 1px 1px 2px rgba(200,0,0,0.4);" +
	"}" +
	"" +
	".yellow {" +
	"	border-color: rgb(255,255,0);" +
	"	background:   rgb(180,180,60);" +
	"	box-shadow: 1px 1px 2px rgba(200,200,0,0.4);" +
	"}" +
	"" +
	".blue {" +
	"	border-color: rgb(0,0,255);" +
	"	background:   rgb(60,60,180);" +
	"	box-shadow: 1px 1px 2px rgba(0,0,200,0.4);" +
	"}" +
	"" +
	".green {" +
	"	border-color: rgb(0,255,0);" +
	"	background:   rgb(60,180,60);" +
	"	box-shadow: 1px 1px 2px rgba(0,200,0,0.4);" +
	"}";
document.querySelector('body').appendChild(style);



var createDiv = function(cls, id){
var div = document.createElement('div');
div.id = id;
div.className = cls;
div.style.textAlign = "center";
div.style.float = "center";
div.style.width = "28700px";
document.querySelector('body').appendChild(div);
};

var createLink = function(type, URL){
  var a = document.createElement('a');
  var linkText = document.createTextNode("Click here for more information on "+ type +".");
  a.appendChild(linkText);
  a.title = "Click here for more information on "+ type +".";
  a.href = URL;
  document.body.appendChild(a);
};

createDiv('stuff-box red shadowed', 'red');
createLink('Fibonacci', 'https://oeis.org/A000045');
createDiv('stuff-box blue shadowed', 'blue');
createLink('Tribonacci', 'https://oeis.org/A000073');
createDiv('stuff-box green shadowed', 'green');
createLink('Pell', 'https://oeis.org/A000129');

fib(11, document.querySelector('.red'));
tri(11, document.querySelector('.blue'));
pell(11, document.querySelector('.green'));

