var RestructRhombuses = function()
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

		Construct.prototype.pluginName = 'RestructRhombuses';

		Construct.prototype.init = function(params)
		{
			var self = this;

			params = this.extend(
				{
					selector: false,
					childElem: false,
					wait: false,
					maxCols: 0,
					spaceBetweenBlocks: 20,
					colClassPrefix: 'col',
					firstInOddRowClass: 'first-in-odd-row',
					firstInEvenRowClass: 'first-in-even-row',
					lastInEvenRowClass: 'last-in-even-row'
				},
				params
			);

			if (!params.selector || !params.childElem)
			{
				this.setErrorMessage(this.pluginName);
				return false;
			}

			this.selector = params.selector;
			this.childElem = params.childElem;

			this.colClassPrefix = params.colClassPrefix;
			this.firstInOddRowClass = params.firstInOddRowClass;
			this.firstInEvenRowClass = params.firstInEvenRowClass;
			this.lastInEvenRowClass = params.lastInEvenRowClass;
			this.maxCols = params.maxCols;
			this.spaceBetweenBlocks = params.spaceBetweenBlocks;

			var wait = params.wait;

	    params = null;

			this.countInRow = 0;

			this.elemWidth;
			// this.marginLeft;
			// this.marginEvenRow;
			this.oldColClass;
			// this.evenRowsExist;

			this.oldElemWidth = 0;
			this.oldCountInRow = 0;
			this.oldElemsCount = 0;

			if (!wait)
			{
				self.run();
			}

			window.addEventListener('resize', function(){
					// self.run();
				self.resizeWindowWidth(self.run);
			});
		};

		Construct.prototype.run = function(restruct)
		{
			restruct = restruct || false;

			var elems = document.querySelectorAll(this.selector + ' ' + this.childElem);
			var parent = document.querySelector(this.selector);

			if (!elems.length)
			{
				parent.classList.remove(this.oldColClass);
				return;
			}

			var parentWidth = parent.parentNode.offsetWidth;
			// var parentWidthWithMargins;
			var countElems = elems.length;
			// var tempCountInRow;
			var firstOddElemIndex;
			var firstEvenElemIndex;
			// var lastEvenElemIndex;
			var step;
			var newColClass = this.colClassPrefix;

			// this.elemWidth = this.getWidth(elems[0], true);
			this.elemWidth = this.getWidth(elems[0]);
			var rightMargin = this.getStyle(elems[0], 'marginRight', 'px');
			this.elemWidth = this.elemWidth + rightMargin*2;
			console.log(parentWidth);
			console.log(this.elemWidth);
			this.countInRow = parseInt(parentWidth/this.elemWidth);
			// tempCountInRow = parseInt(parentWidth/this.elemWidth);

			// parentWidthWithMargins = parentWidth + this.spaceBetweenBlocks*(tempCountInRow - 1);

			// this.countInRow = parseInt(parentWidthWithMargins/this.elemWidth);

			if (countElems <= this.countInRow)
			{
				this.countInRow = countElems;
			}

			console.log('---------------');
			console.log(this.oldElemWidth);
			console.log(this.oldCountInRow);
			console.log(this.oldElemsCount);
			console.log(restruct);

			if (this.oldElemWidth === this.elemWidth &&
					this.oldCountInRow === this.countInRow &&
					this.oldElemsCount === countElems && !restruct)
			{
				return;
			}

			console.log(this.elemWidth);
			console.log(this.countInRow);
			console.log(countElems);

			if (this.maxCols > 0 && this.countInRow > this.maxCols)
			{
				this.countInRow = this.maxCols;
			}

			this.oldElemWidth = this.elemWidth;
			this.oldCountInRow = this.countInRow;
			this.oldElemsCount = countElems;

			firstOddElemIndex = 0;
			firstEvenElemIndex = this.countInRow;

			if (this.countInRow > 1)
			{
				step = this.countInRow*2 - 1;
			}
			else
			{
				step = 2;
			}

			for (var i = 0; i < countElems; i++)
			{
				elems[i].classList.remove(this.firstInOddRowClass);
				elems[i].classList.remove(this.firstInEvenRowClass);
				// elems[i].classList.remove(this.lastInEvenRowClass);

				if (firstOddElemIndex == i)
				{
					elems[i].classList.add(this.firstInOddRowClass);
				}

				if (firstEvenElemIndex == i)
				{
					elems[i].classList.add(this.firstInEvenRowClass);

					// lastEvenElemIndex = firstEvenElemIndex + this.countInRow - 2;
					// firstOddElemIndex = lastEvenElemIndex + 1;
					if (this.countInRow > 1)
					{
						firstOddElemIndex = firstEvenElemIndex + this.countInRow - 1;
					}
					else
					{
						firstOddElemIndex += step;
					}

					firstEvenElemIndex += step;
				}

				// if (lastEvenElemIndex == i)
				// {
				// 	elems[i].classList.add(this.lastInEvenRowClass);
				// }
			}

			if (this.countInRow > 1)
			{
				newColClass += this.countInRow;
			}

			if (this.oldColClass)
			{
				parent.classList.remove(this.oldColClass);
			}

			parent.classList.add(newColClass);
			this.oldColClass = newColClass;
		};
	// };

	return Construct(arguments);
};