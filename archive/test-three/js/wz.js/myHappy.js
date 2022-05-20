// https://www.codementor.io/javascript/tutorial/how-to-make-a-write-on-effect-using-html5-canvas-and-javascript-only

// get 2D context
window.addEventListener("load", function () {

	var W = document.body.clientWidth;
	var H = document.body.clientHeight;
	var canvasNode = document.querySelector("#happy-bd");
	canvasNode.width = W;
	canvasNode.height = H;

	var ctx = canvasNode.getContext("2d"),
		// dash-length for off-range
		dashLen = 200,
		// we'll update this, initialize
		dashOffset = dashLen,
		// some arbitrary speed
		speed = 12,
		// the text we will draw
		txt = "Wing, Happy B'Day ^_^",
		// start position for x and iterator
		i = 0;

	// Comic Sans?? Let's make it useful for something ;) w/ fallbacks
	ctx.font = "60px Comic Sans MS, cursive, TSCu_Comic, sans-serif"; 

	var xPosition = W/2 - (txt.split('').reduce(function(p, c) {
		return p + ctx.measureText(c).width;
	}, 120) / 2);
	var yPosition = H/2;

	// thickness of the line
	ctx.lineWidth = 7;

	// to avoid spikes we can join each line with a round joint
	ctx.lineJoin = "round";

	// increase realism letting background (f.ex. paper) show through
	ctx.globalAlpha = 2/3;

	// some color, lets use a black pencil
	ctx.strokeStyle = ctx.fillStyle = "#FE5A27";

	var shouldEndLoop = false;

	(function loop() {
		// clear canvas for each frame
		ctx.clearRect(xPosition, 0, 60, 150);

		// calculate and set current line-dash for this char
		ctx.setLineDash([dashLen - dashOffset, dashOffset - speed]);

		// reduce length of off-dash
		dashOffset -= speed;

		// draw char to canvas with current dash-length
		ctx.strokeText(txt[i], xPosition, yPosition);

		// char done? no, the loop
		if (dashOffset > 0) requestAnimationFrame(loop);
		else {
			// ok, outline done, lets fill its interior before next
			// ctx.fillText(txt[i], x, yPosition);

			// reset line-dash length
			dashOffset = dashLen;

			// get x position to next char by measuring what we have drawn
			// notice we offset it a little by random to increase realism
			xPosition += ctx.measureText(txt[i++]).width + ctx.lineWidth * Math.random();

			// lets use an absolute transform to randomize y-position a little
			ctx.setTransform(1, 0, 0, 1, 0, 3 * Math.random());

			// and just cause we can, rotate it a little too to make it even
			// more realistic
			ctx.rotate(Math.random() * 0.005);

			// if we still have chars left, loop animation again for this char
			if (i < txt.length) requestAnimationFrame(loop);
			else {
				if (!shouldEndLoop) {
					setTimeout(function () {
						ctx.clearRect(0, 0, W, H);
						txt = "Hope u can enjoy this scene";
						i = 0;
						xPosition = W/2 - (txt.split('').reduce(function(p, c) {
							return p + ctx.measureText(c).width;
						}, 120) / 2)
						requestAnimationFrame(loop);
						shouldEndLoop = true;
					}, 2000);
				} else {
					setTimeout(function () {ctx.clearRect(0, 0, W, H);}, 2000);
				}
			}
		}
	})();  // just to self-invoke the loop
});
