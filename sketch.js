var serial; // variable to hold an instance of the serialport library
var fromSerial = 0; //variable to hold the data
var fromSerial2=0;




let DT = 0.1;
let nsteps = 400;
// 每个路径上粒子的数目
let nppp = 20;

// 路径数量
let NPath = 400;
let slowdown = 0.5;

let array2 = [];
let hue=115;

var steps =4;
var allParticles = [];
var t=648;
var t1=648;
var hue2 = 115;
let xoff=0;
var p=648;

let sample;
//let notes=[1,1.125,1.2,1.334,1.5,1.6,1.875,2];
let scale=[0.895,1,1.125,1.2,1.334,1.5,1.6,1.875,2];
let melody=[5,5,4,5,6,4,5,3,1,2,2,3,2,2,0,0,1,1];
// let melody=[5,5,4,5,6,4,5,3,1,2,2,3,2,4,5,5,5,5,5,4,5,6,4,5,3,1,2,2,3,2,2,0,0,1,1];
//let notes=[1318.5,1318.5,1174.7,1318.5,1396.9,1318.5,1318.5,1046.5,880,987.77,987.77,1046.5,987.77,1046.5,1174.7,1318.5,1318.5,1318.5,1318.5,1318.5,1174.7,1318.5,1396.9,1318.5,1318.5,1046.5,880,987.77,987.77,1046.5,987.77,987.77,783.99,783.99,880,880];
let BASE=0.4;
let samples=[];
let index=[];
let pindex=[];

function preload(){
  sample=loadSound('piano.mp3'); 
  mySound1 = loadSound('water.mp3');
}

function Particle(x, y) {

  this.pos = new p5.Vector(x, y);
  xoff+=0.1;                        
  this.vel = new p5.Vector(0, 0);
  this.acc = new p5.Vector(0, 0);
  
  this.change = new p5.Vector(x, y);
  this.h = hue2;
  
  hue2++;
  if(hue2>160){
    hue2=115;
  }
  
  this.move = function() {
    this.pos.x +=2;
    this.change.x +=2;


    var d = dist(location1,mouseY,this.pos.x, this.pos.y);

    //设置鼠标的运行边界
    
    if(location1<0||location1>windowWidth||mouseY<0||mouseY>windowHeight){

      d=200;
      
    }
    //当mouseX的距离和边产生的粒子距离小于150时，产生波动

    if (d < 150) {
      var mousePos = new p5.Vector(location1,mouseY);
      
      var vec = new p5.Vector(this.pos.x, this.pos.y);
      vec.sub(mousePos);
      vec.normalize();
      vec.mult(-0.6);//控制粒子的方向向内部聚集

      this.acc.add(vec);
    }
    

    var findP= new p5.Vector(this.change.x, this.change.y);
    findP.sub(this.pos);
    findP.normalize();
    
    var changeDist = dist(this.pos.x, this.pos.y, this.change.x, this.change.y);
    if (changeDist < 5) {

      findP.mult(0.5*map(changeDist, 5, 0, 1, 0));
    } else {
      findP.mult(0.5);
    }
    
    this.acc.add(findP);
    this.vel.mult(0.95);
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  
  serial = new p5.SerialPort();
	serial.on('list', printList); // callback function for serialport list event
	serial.on('data', serialEvent); // callback for new data coming in	
	serial.list(); // list the serial ports
	serial.open("/dev/tty.usbmodem144101"); // open a port
  colorMode(HSB, 255); 
  
  mySound1.play();
  mySound1.loop();
  
  for (var x = 0; x < width; x += steps) {
    for(var i=240;i<windowHeight-280;i+=20){
      let a= i+noise((p++)*0.005)*100;
      allParticles.push(new Particle(x, a));}
    }

    for (let i = 0; i < NPath; i++) {
      array2[i] = new Path();
    }

    for (let i = 0; i < nsteps; i++) {
      path_step();
    }

  } 


  function draw() {
    sensorValue=map(fromSerial-8,0,80,0,1920);
    //sensorValue=map(fromSerial,0,150,0,width*4);
    location1=sensorValue;
    //console.log(location1);

    let w = width / melody.length;

    for(let i = 0; i < melody.length; i++){

      index[i]=false;

      if(location1>i*w&&location1<(i+1)*w){
        index[i]=true;
      }


      if(index[i]==true&&index[i]!=pindex[i]){
       //playNote(scale[melody[i]]);
       //console.log(i);
       //fill(40,100);
       //rect(i*w, 0, w, height);
     }

     pindex[i]=index[i];

     if(location1<0||location1>windowWidth||mouseY<0||mouseY>windowHeight){
       sample.stop();
     }

   }

   for(let i=0;i<samples.length;i++){
    let sample=samples[i];
    let volume=sample.amp().value;
    if(volume>=0.8){
      sample.amp(0,5);
    }
    else if(volume<=0){
      sample.stop();
      samples.splice(i,1);
    }
  }

  background(0);
  
  colorMode(HSB, 255); 

  
  noFill();


  //上下叠加透明度不同的大小圆
  
  for (var i =0; i < allParticles.length-1; i++) {
    allParticles[i].move();
    
    if (i > 1) {
      var d = dist(allParticles[i].pos.x, allParticles[i].pos.y, 
       allParticles[i].change.x, allParticles[i].change.y);

      strokeWeight(constrain(d*0.1, 1, 3));
      beginShape();
      noStroke();
      fill(allParticles[i].h,255,110);
      ellipse(allParticles[i].pos.x, allParticles[i+1].pos.y,3,3);
      endShape();
      
      beginShape();
      fill(allParticles[i].h,255, 255);
      ellipse(allParticles[i].pos.x, allParticles[i].pos.y,1,1);
      endShape();       
      
      
    }
    if (allParticles[i].pos.x >windowWidth+10) {
     allParticles.splice(i, 1);
   }
 }

 //利用参数t和参数t1,不断从网页左侧不断补充新的粒子

  if (t++%(steps-2)== 0) {
   for(let i=240;i<height-280;i+=20){
    var y = i+noise(t1++*0.005)*100;
    allParticles.push(new Particle(0, y));}
  }
  
  for (let i = 0; i < NPath; i++) {
    array2[i].show();
    array2[i].update();
  }
  
}

function playNote(note){
  //let osc=new p5.Oscillator();
  
  let f=note;
  sample.rate(BASE*f);
  //console.log(BASE*f);
  //sample.play();
  sample.amp(0);
  sample.amp(1,0.5);
  samples.push(sample);
  //console.log(samples.length);
  reverb = new p5.Reverb();
  sample.disconnect(); // so we'll only hear reverb...

  // connect soundFile to reverb, process w/
  // 3 second reverbTime, decayRate of 2%
  reverb.process(sample, 3, 2);
  sample.play();
}

function printList(portList) {
	for (var i = 0; i < portList.length; i++) {
		print(i + " " + portList[i]);
	}
}

function serialEvent(){
 var stringFromSerial = serial.readLine();
 if (stringFromSerial.length>0){
  var trimmedString = trim(stringFromSerial);
  var myArray = split(trimmedString, ",")
  fromSerial = Number(myArray[0]);
  fromSerial2 = Number(myArray[1]); 
}

if(fromSerial2>0){
  mySound=mySound1;
  var Volume=map(fromSerial2,0,250,0,3);
}
else{
  mySound=mySound1;
  var Volume=map(-1*fromSerial,0,250,0,3);
}

mySound.setVolume(Volume);
console.log(fromSerial,fromSerial2,Volume);
}


function mousePressed(){
  let fs=fullscreen();
  fullscreen(!fs);
}

