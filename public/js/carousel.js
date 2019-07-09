var Carousel = function()
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

		Construct.prototype.pluginName = 'Carousel';

		Construct.prototype.init = function(params)
    {
      var self = this;

      params = this.extend(
        {
          sliderID: false,
          responsible: false,
          navButtons: false,
          countSlides: 0
        },
        params
      );

      if (!params.sliderID || !params.countSlides || !params.navButtons)
      {
        this.setErrorMessage(this.pluginName);
        return false;
      }

      this.sliderID = params.sliderID;
      this.countSlides = params.countSlides;
      this.slideWidth = params.slideWidth;

      this.responsible = params.responsible;

      this.thumbsList = params.navButtons.thumbs || false;
      this.directionButtons = params.navButtons.direction || false;

      params = null;

      var createDirectionButtons = true;

      this.container = document.querySelector('#' + this.sliderID + ' .carousel-container');
      this.demonstration = document.querySelector('#' + this.sliderID + ' .carousel-demonstration');
      this.row = document.querySelector('#' + this.sliderID + ' .carousel-row');
      var navigation = document.querySelector('#' + this.sliderID + ' .carousel-navigation');
      // var thumbs;

      this.rowLeft = 0;
      this.countInFocus;
      this.rightBorder;

      var tempInnerHTML;
      // var i;
      var tempNavBtnSettings;

      if (this.directionButtons && this.directionButtons.notCreate)
      {
        createDirectionButtons = false;
        // delete params.navButtons.direction.notCreate;
      }

      if (!this.row.children.length)
      {
        return;
      }

      if (this.responsible)
      {
        this.countInFocus = 1;
      }
      else
      {
        this.demonstration.style.height = this.row.firstElementChild.offsetHeight + 'px';
      }

      if (this.responsible)
      {
        // this.slideWidth = this.container.offsetWidth;

        this.setEachSlideWidth(this.container.offsetWidth);

        // console.log(this.row.firstElementChild.offsetHeight);
      }
      else
      {
        // this.slideWidth = this.row.firstElementChild.offsetWidth;
        this.slideWidth = this.getWidth(this.row.firstElementChild, true);
      }

      this.row.style.width = this.slideWidth*this.row.children.length + 'px';

      if (this.thumbsList)
      {
        this.thumbsList = document.createElement('ul');

        this.thumbsList.id = this.sliderID + '-carousel-thumbs';
        this.thumbsList.classList.add('thumbs');
        this.thumbsList.classList.add('hor-menu');

        // for (i = 0, tempInnerHTML = ''; i < this.countSlides; i++)
        // {
        //   tempInnerHTML += '<li><a data-index="' + i + '" href="#"';

        //   if (!i)
        //   {
        //     tempInnerHTML += ' class="active"';
        //   }

        //   tempInnerHTML += '></a></li>';
        // }

        // this.thumbsList.innerHTML = tempInnerHTML;

        navigation.appendChild(this.thumbsList);
        // thumbs = document.querySelectorAll('#' + this.sliderID + '-carousel-thumbs a');

        this.thumbsList.addEventListener('click', function(event){
          var elem = event.target;

          if (elem.tagName == 'LI')
          {
            elem = elem.firstElementChild;
          }

          if (elem.tagName != 'A')
          {
            return;
          }

          event.preventDefault();

          for (var i = 0, len = self.thumbsList.children.length; i < len; i++)
          {
            self.thumbsList.children[i].firstElementChild.classList.remove('active');
          };

          elem.classList.add('active');

          self.changeSlide(0, +elem.getAttribute('data-index'));
        });
      }

      if (this.directionButtons)
      {
        for (var prop in this.directionButtons)
        {
          if (createDirectionButtons)
          {
            tempNavBtnSettings = this.directionButtons[prop];

            this.directionButtons[prop] = document.createElement('div');
            this.directionButtons[prop].id = this.sliderID + '-carousel-' + prop;
            this.directionButtons[prop].classList.add('button');
          }
          else
          {
            this.directionButtons[prop] = document.getElementById(this.sliderID + '-carousel-' + prop);
          }

          if (prop == 'prev')
          {
            this.directionButtons[prop].classList.add('disable');
          }

          if (createDirectionButtons)
          {
            this.directionButtons[prop].innerHTML = tempNavBtnSettings;
            navigation.appendChild(this.directionButtons[prop]);
          }
        }

        this.directionButtons.prev.addEventListener('click', function(){
          self.changeSlide(-1);
        });

        this.directionButtons.next.addEventListener('click', function(){
          self.changeSlide(1);
        });
      }

      window.addEventListener('resize', function(){
          // self.setSliderWidth();
        self.resizeWindowWidth(self.setSliderWidth);
      });

      this.setSliderWidth();
		};

		Construct.prototype.setSliderWidth = function()
    {
      var newWidth;

      if (this.responsible)
      {
        newWidth = this.getTotalWidth();

        this.setEachSlideWidth(newWidth);

        this.row.style.width = newWidth*this.countSlides + 'px';
      }
      else
      {
        this.setRowWidth();
        this.countInFocus = parseInt(this.getTotalWidth()/this.slideWidth);
        console.log(this.sliderID +': ' + this.slideWidth);
        if (this.countSlides < this.countInFocus)
        {
          this.countInFocus = this.countSlides;
        }

        newWidth = this.slideWidth*this.countInFocus;
        this.container.style.width = newWidth + this.getBorderWidth() + 'px';
      }

      this.rightBorder = -(this.row.offsetWidth - newWidth);

      if (this.row.offsetLeft < this.rightBorder)
      {
        this.row.style.left = this.rightBorder + 'px';
      }

      this.setThumbs();
      this.showHideDirButtons();
		};

		Construct.prototype.setEachSlideWidth = function(width)
    {
      this.slideWidth = width;

      for (var i = 0; i < this.countSlides; i++)
      {
        this.row.children[i].style.width = width + 'px';
      }
		};

		Construct.prototype.setRowWidth = function()
    {
      this.slideWidth = this.getWidth(this.row.firstElementChild, true);

      this.row.style.width = this.slideWidth*this.countSlides + 'px';
		};

		Construct.prototype.setThumbs = function()
    {
      if (!this.thumbsList)
      {
        return false;
      }

      var countThumbs = Math.ceil(this.countSlides/this.countInFocus);
      var tempInnerHTML = '';

      if (countThumbs > 1)
      {
        for (var i = 0; i < countThumbs; i++)
        {
          tempInnerHTML += '<li><a data-index="' + i + '" href="#"></a></li>';
        }
      }

      this.thumbsList.innerHTML = tempInnerHTML;
		};

		Construct.prototype.getTotalWidth = function()
    {
      // var totalContainer = this.container.parentNode;
      // var width = totalContainer.offsetWidth;

      // width -= this.getStyle(totalContainer, 'marginLeft', 'px');
      // width -= this.getStyle(totalContainer, 'marginRight', 'px');

      // width -= this.getStyle(totalContainer, 'paddingLeft', 'px');
      // width -= this.getStyle(totalContainer, 'paddingRight', 'px');

      // return width;
      return this.container.parentNode.clientWidth;
		};

		Construct.prototype.getBorderWidth = function()
    {
      var width = this.getStyle(this.demonstration, 'borderLeftWidth', 'px');

      width += this.getStyle(this.demonstration, 'borderRightWidth', 'px');

      return width;
		};

		Construct.prototype.// getStyle = function(elem, styleName, measure)
    // {
    //   var style = getComputedStyle(elem)[styleName];

    //   if (measure)
    //   {
    //     style = parseInt(style.slice(0, style.length - measure.length));
    //   }

    //   return style;
    // },

    showHideDirButtons = function()
    {
      if (this.directionButtons)
      {
        this.directionButtons.prev.classList.remove('disable');
        this.directionButtons.next.classList.remove('disable');
      }

      if (this.rowLeft > 0)
      {
        this.rowLeft = 0;

        if (this.directionButtons)
        {
          this.directionButtons.prev.classList.add('disable');
        }
      }

      if (this.rowLeft < this.rightBorder)
      {
        this.rowLeft = this.rightBorder;

        if (this.directionButtons)
        {
          this.directionButtons.next.classList.add('disable');
        }
      }
		};

		Construct.prototype.changeSlide = function(direction, index)
    {
      var shift = this.slideWidth*this.countInFocus;

      direction = direction || 0;

      if (direction < 0)
      {
        this.rowLeft = this.row.offsetLeft + shift;
      }
      else if (direction > 0)
      {
        this.rowLeft = this.row.offsetLeft - shift;
      }
      else
      {
        index = index || 0;
        this.rowLeft = -shift*index;
      }

      this.showHideDirButtons();

      this.row.style.left = this.rowLeft + 'px';
    };
  // };

  return Construct(arguments);
};