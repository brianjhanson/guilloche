function Guilloche() {
  this.steps = 1800; // Divide a circle this many times
  this.majorRipple = 50; // The major ripple
  this.minorRipple = 0.25; // The minor ripple
  this.radiusEffect = 25; // Radius type effect
  this.angleMultiplier = 1; // Angle multiplier
  this.amplitude = 6; // Scale of final drawing
  this.sectionLength = 1; // Number of sections for each line

	this.plot = function(ctx) {
		var l;
		var x, y, ox, oy;
		var sl = 0;
		var theta = 0;
		var thetaStep = 2 * Math.PI / this.steps;
		var s = (this.majorRipple + this.minorRipple) / this.minorRipple;
		var rR = this.minorRipple + this.majorRipple;
		var rp = this.minorRipple + this.radiusEffect;

		for(var t = 0; t <= this.steps; t++) {
			x = rR * Math.cos(this.angleMultiplier * theta) + rp * Math.cos(s * this.angleMultiplier * theta);
			y = rR * Math.sin(this.angleMultiplier * theta) + rp * Math.sin(s * this.angleMultiplier * theta);

			x *= this.amplitude;
			y *= this.amplitude;

			if(sl == 0) {

				ctx.beginPath();

				if(t == 0) {
					ctx.moveTo(x, y);
				} else {
					ctx.moveTo(ox, oy);
					ctx.lineTo(x, y);
				}
				ctx.stroke();
			} else {
				// Append to line section
				ctx.lineTo(x, y);
        ctx.stroke();
			}

			ox = x;
			oy = y;
			sl++;
			theta += thetaStep;

			if(sl == this.sectionLength) sl = 0;
		}
	}
	return this;
}

function getContext() {
  var canvas = document.getElementById('c');
  var ctx = canvas.getContext('2d');
  ctx.canvas.width  = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  ctx.translate((ctx.canvas.width/2)+0.5, (ctx.canvas.height/2)+0.5);

  var grad = ctx.createLinearGradient(0, 0, 300, 0);
  grad.addColorStop(0, "#ce7630");
  grad.addColorStop(1, "#eba758");

  ctx.strokeStyle = grad;
  ctx.lineWidth = 0.5;
  ctx.lineJoin = "round";

  return ctx;
}

function initGui(item) {
  var gui = new dat.GUI();
  gui.add(item, 'steps', 300, 4800);
  gui.add(item, 'majorRipple', 0, 150);
  gui.add(item, 'minorRipple', 0, 1.5).step(0.05);
  // gui.add(item, 'angleMultiplier', 1, 6).step(0.25);
  gui.add(item, 'amplitude', 1, 10);
  gui.add(item, 'radiusEffect', 1, 100);
  // gui.add(item, 'sectionLength', 1, 2);

  return gui;
}

function clearContext(ctx) {
  ctx.save();
  ctx.setTransform(1,0,0,1,0,0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.restore();
}

document.addEventListener("DOMContentLoaded", function(event) {
  var ctx = getContext();
  var g = Guilloche();
  var gui = initGui(g);

  gui.__controllers.forEach(function(controller) {
    controller.onChange(function(value) {
      clearContext(ctx);
      g.plot(ctx);
    });
  });

  g.plot(ctx);
  ctx.createPattern(ctx);
});
