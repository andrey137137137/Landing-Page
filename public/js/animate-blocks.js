var AnimateBlocks = function()
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

	Construct.prototype.constructor = Construct;
	Construct.prototype.pluginName = 'AnimateBlocks';

	Construct.prototype.init = function(params)
	{
		params = this.extend(
			{
				parentID: false,
				childElem: '.block',
				interval: 250,
				transform: 'scale(0)',
				outPosition: -500,
				timingPosition: '1s',
				timingTransform: '1s'
			},
			params
		);

		if (!params.parentID)
		{
			// self.setErrorMessage(self.pluginName);
			this.setErrorMessage(this.pluginName);
			return false;
		}

		for (var prop in params)
		{
			this[prop] = params[prop];
		};

		// self.parentID = params.parentID;

		// self.childElem = params.childElem;
		// self.interval = params.interval;

		// self.transform = params.transform;
		// self.outPosition = params.outPosition;

		// self.timingPosition = params.timingPosition;
		// self.timingTransform = params.timingTransform;

		params = null;

		var self = this;

		self.elems = document.querySelectorAll('#' + self.parentID + ' ' + self.childElem);
		self.countElems = self.elems.length;
		self.started = false;

		if (!self.countElems)
		{
			self.setErrorMessage(self.pluginName, 'Not children');
			return false;
		}

		self.intervalID = 0;
		self.shiftFromCenter = 0;
		self.direction = 1;
		self.rowNumber = 0;
		self.evenRowElems = true;
		self.evenLastRowElems = true;

		self.changedStyles = new Array(self.countElems);
		self.forLeftPos;
		self.forRightPos;

		self.index;
		self.countRows;
		self.countInRow;
		self.centerRowIndex;
		self.centerLastRowIndex;
		self.rest;
		self.rightBorder;
		self.firstRestIndex;

		self.eventFuncs = [
			{
				e: 'resize',
				f: function(){
						// self.setPositions();
					self.resizeWindowWidth(self.setPositions);
				}
			},
			{
				e: 'resize',
				f: function(){
					self.show();
				}
			},
			{
				e: 'scroll',
				f: function(){
					self.show();
				}
			}
		];

		for (var i = 0; i < self.eventFuncs.length; i++)
		{
			window.addEventListener(self.eventFuncs[i].e, self.eventFuncs[i].f);
		};

		self.setPositions();
		self.show();
	};

	Construct.prototype.setPositions = function()
	{
		var self = this;

		if (self.started)
		{
			window.removeEventListener('resize', self.eventFuncs[0].f);
			return;
		}

		var tempArray;
		var parentWidth = self.getContainerWidth(self.elems[0]);
		var elemWidth = self.getWidth(self.elems[0], true);

		self.countInRow = parseInt(parentWidth/elemWidth);

		if (self.countElems < self.countInRow)
		{
			self.countInRow = self.countElems;
		}
		else if (!self.countInRow)
		{
			self.countInRow = 1;
		}

		self.countRows = Math.ceil(self.countElems/self.countInRow);
		self.centerRowIndex = parseInt(self.countInRow/2);
		self.rightBorder = self.countInRow;
		self.rest = self.countElems % self.countInRow;
		self.firstRestIndex = self.countElems - self.rest;

		tempArray = self.correctCenterIndex(self.countInRow, self.centerRowIndex);
		self.centerRowIndex = tempArray[0];
		self.evenRowElems = tempArray[1];

		if (self.rest > 0)
		{
			self.centerLastRowIndex = parseInt(self.rest/2) + (self.countRows - 1)*self.countInRow;
			tempArray = self.correctCenterIndex(self.rest, self.centerLastRowIndex);
			self.centerLastRowIndex = tempArray[0];
			self.evenLastRowElems = tempArray[1];
		}

		self.forLeftPos = [];
		self.forRightPos = [];

		for (var i = 0, j = 0; i < self.countInRow; i++)
		{
			if (i <= self.centerRowIndex)
			{
				if (i == self.centerRowIndex && !self.evenRowElems)
				{
					continue;
				}

				self.forLeftPos[i] = i;
			}
			else
			{
				self.forRightPos[j] = i;
				j++;
			}
		}

		for (var i = 0; i < self.countElems; i++)
		{
			self.changedStyles[i] = self.getPosition(i);

			self.elems[i].removeAttribute('style');
			self.elems[i].style.position = 'relative';

			self.elems[i].style[self.changedStyles[i]] = self.outPosition + 'px';
			self.elems[i].style.transition = self.changedStyles[i] + ' ' + self.timingPosition;

			if (self.transform)
			{
				// console.log(self.getStyle(self.elems[i], 'transform'));
				self.elems[i].style.transform = 'scale(0)';
				self.elems[i].style.transition += ', transform ' + self.timingTransform;
			}
		}

		self.index = self.centerRowIndex;
	};

	Construct.prototype.show = function()
	{
		var self = this;

		// var scrollY = self.getScrollY();
		// var elemParentTop = self.getElemCenterTop(self.parentID);

		// if (!self.started && scrollY >= elemParentTop)
		if (!self.started && self.isVisibleElem(self.parentID))
		{
			self.showBlock();
			self.started = true;

			for (var i = 0, len = self.eventFuncs.length; i < len; i++)
			{
				window.removeEventListener(self.eventFuncs[i].e, self.eventFuncs[i].f);
			}
		}
	};

	Construct.prototype.correctCenterIndex = function(rowLen, centerIndex)
	{
		var self = this;
		var checkEvenRowElems = true;

		if (rowLen % 2 == 0)
		{
			centerIndex--;
		}
		else
		{
			checkEvenRowElems = false;
		}

		return [centerIndex, checkEvenRowElems];
	};

	Construct.prototype.getPosition = function(indx)
	{
		var self = this;
		var len = self.forLeftPos.length;
		var i;

		if (indx >= self.firstRestIndex && indx == self.centerLastRowIndex && !self.evenLastRowElems)
		{
			return 'bottom';
		}

		if (indx >= self.firstRestIndex && indx <= self.centerLastRowIndex)
		{
			return 'left';
		}

		if (indx > self.centerLastRowIndex && indx < self.countElems)
		{
			return 'right';
		}

		if (indx % self.countInRow == self.centerRowIndex && !self.evenRowElems)
		{
			return 'bottom';
		}

		for (i = 0; i < len; i++)
		{
			if (indx % self.countInRow == self.forLeftPos[i])
			{
				break;
			}
		}

		if (i < len)
		{
			return 'left';
		}

		len = self.forRightPos.length;

		for (i = 0; i < len; i++)
		{
			if (indx % self.countInRow == self.forRightPos[i])
			{
				break;
			}
		}

		if (i < len)
		{
			return 'right';
		}
	};

	Construct.prototype.showBlock = function()
	{
		var self = this;

		if (self.transform)
		{
			self.elems[self.index].style.transform = 'scale(1)';
		}

		self.elems[self.index].style[self.changedStyles[self.index]] = 0;

		if (self.direction > 0)
		{
			self.shiftFromCenter++;
			self.index = self.centerRowIndex + self.shiftFromCenter;
			self.direction = -1;
		}
		else
		{
			self.index = self.centerRowIndex - self.shiftFromCenter;
			self.direction = 1;
		}

		if (self.index < self.rowNumber*self.countInRow || self.index >= self.rightBorder)
		{
			self.rowNumber++;
			self.shiftFromCenter = 0;
			self.direction = 1;

			if (self.rowNumber == self.countRows - 1 && self.rest > 0)
			{
				self.centerRowIndex = self.centerLastRowIndex;
				self.rightBorder = self.countElems;
			}
			else
			{
				self.centerRowIndex += self.countInRow;
				self.rightBorder = (self.rowNumber + 1)*self.countInRow;
			}

			self.index = self.centerRowIndex;
		}

		if (self.rowNumber < self.countRows)
		{
			setTimeout(
				function(){
					requestAnimationFrame(function(){
						self.showBlock();
					});
				},
				self.interval
			);
		}
	};

	return Construct(arguments);
};