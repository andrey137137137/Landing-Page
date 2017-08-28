var ScrollEffect = function()
{
	'use strict';

	function Construct(params)
	{
		if ( !(this instanceof Construct) )
		{
			return new Construct(params);
		}
		
		this.init.apply(this, params);
	}

	Construct.prototype = Object.create(ReasanikBase());

	// Construct.prototype = {

		Construct.prototype.constructor = Construct;

		Construct.prototype.pluginName = 'ScrollEffect';

		Construct.prototype.init = function(params)
		{
			var self = this;

			params = this.extend(
				{
					buttonID: false,
					direction: 1,
					defaultScrollStep: 50,
					scrollFinalPos: 0,
					finalElemID: false
				},
				params
			);

			this.scrollY = this.getScrollY();

			this.direction = params.direction;
			this.defaultScrollStep = params.defaultScrollStep;
			this.scrollFinalPos = params.scrollFinalPos;

			this.finalElemID = params.finalElemID;
			var buttonID = params.buttonID;

	    params = null;

			this.intervalID = 0;

			this.scrollStep;
			this.counter = 1;

			if (this.finalElemID)
			{
				this.scrollFinalPos = document.getElementById(this.finalElemID).offsetTop;

				// window.addEventListener('resize', function(){
				// 	self.scrollFinalPos = document.getElementById(self.finalElemID).offsetTop;
				// });
			}

			document.getElementById(buttonID).addEventListener('click', function(event){
				event.preventDefault();
				self.start();
			});
		};

		Construct.prototype.start = function()
		{
			var self = this;

			if (this.intervalID > 0)
			{
				this.stop();
			}

			this.scrollY = this.getScrollY();
			this.scrollStep = this.defaultScrollStep;

			if (this.finalElemID)
			{
				this.scrollFinalPos = document.getElementById(this.finalElemID).offsetTop;
			}

			console.log(this.scrollFinalPos);

			this.intervalID = setInterval(
				function(){
					self.run();
				},
				50
			);
		};

		Construct.prototype.run = function()
		{
			if (this.counter % 10 === 0)
			{
				this.scrollStep *= 5;
			}

			console.log(this.scrollY);

			if (this.direction > 0)
			{
				this.scrollY += this.scrollStep;

				if (this.scrollY >= this.scrollFinalPos)
				{
					this.scrollY = this.scrollFinalPos;
				}
			}
			else
			{
				this.scrollY -= this.scrollStep;

				if (this.scrollY <= this.scrollFinalPos)
				{
					this.scrollY = this.scrollFinalPos;
				}
			}

			this.changeScroll();
			this.counter++;

			if (this.scrollY === this.scrollFinalPos)
			{
				this.stop();
			}
		};

		Construct.prototype.stop = function()
		{
			clearInterval(this.intervalID);
			this.intervalID = 0;

			this.counter = 1;
			this.scrollStep = this.defaultScrollStep;
		};

		Construct.prototype.changeScroll = function()
		{
			// if (document.documentElement.scrollTop)
			// {
			// 	document.documentElement.scrollTop = this.scrollY;
			// }
			// else if (document.body.scrollTop)
			// {
			// 	document.body.scrollTop = this.scrollY;
			// }
			this.setScrollY(this.scrollY);
		};
	// };

	return Construct(arguments);
};