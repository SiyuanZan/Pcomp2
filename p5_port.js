



class Path {

  constructor() {
    this.x = random(width);

    this.y = random(300, windowHeight-220);

    this.positions = []; 

    this.sz = random(1);

    this.npart = 20;
    this.t_off = random(1);
    this.vx = 0;
    this.vy = 0;

    this.positions.push(createVector(this.x, this.y));
  }

  update() {
    let res = field(this.x, this.y);
    let len = this.positions.length;
    this.vx += DT * res.x; 
    this.vy += DT * res.y;
    this.vx *= slowdown;
    this.vy *= slowdown;
    this.x += DT * this.vx;
    this.y += DT * this.vy;
    this.positions.push(createVector(this.x, this.y));


    if (this.x > width) {

      this.x = 0;

    }



  }

  show() {

    strokeWeight(this.sz);

    let tt = this.t_off;

    let len = this.positions.length;



    for (let i = 0; i <this.npart; i++) {


      let loc = constrain(map(i + tt, 0,this.npart, 0, len - 1), 0, len - 1 - 0.001);
      let i1 = floor(loc);
      let i2 = i1 + 1;
      let interp = loc - floor(loc);
      let xx = lerp(this.positions[i1].x, this.positions[i2].x, interp*4);
      let yy = lerp(this.positions[i1].y, this.positions[i2].y, interp*4);
      
      hue++;
      if(hue>160){
        hue=115;
      }


      
      let alpha = 255 * pow(sin(PI * loc / (len - 1)), 0.25);

      stroke(hue,200,alpha);

      point(xx, yy);
    }

  }
}



function path_step() {
  for (let i = 0; i < NPath; i++) {
    array2[i].update();
  }
}



function field(x, y) {
  let amount = 50;
  let scale = 0.03;
  let offset = random(0, 0.6);

  return createVector(amount * (noise(scale *x + offset, scale *y + offset) - 0.5) + 20, amount * (noise(100 + scale *x + offset, scale *y + offset) - 0.5));

}
