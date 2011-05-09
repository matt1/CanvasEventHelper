/*

Copyright (c) 2011 CanvasEventHelper
https://github.com/matt1/CanvasEventHelper

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.


*/

/**
 * Helper for handling canvas mouse events
 */
function canvasEventHelper() {
	
	/** Array to hold variable shapes that are to be handled by this helper */
	this.eventAwareShapes;
	
	/** Canvas context to be used for helper */
	this.context;
	
	/** Cordinates of last mouse click */
	this.lastX, this.lastY;
	
	/** Draws all of the shapes that this helper is handling */
	this.drawShapes = function() {
		for (var shape in this.eventAwareShapes) {
			if (this.eventAwareShapes[shape].preDraw(this.context)) {
				this.eventAwareShapes[shape].draw(this.context);
				this.eventAwareShapes[shape].postDraw(this.context, this.lastX, this.lastY);		
			}
		}
	}
	
	/** Handles onClick events for all of the shapes */
	this.onClick = function(pX, pY) {
		this.lastX = pX;
		this.lastY = pY;
		this.drawShapes();
		
		// Clear event details
		this.lastX = undefined;
		this.lastY = undefined;
	}
}

/**
 *	Shape that can be clicked
 */
function clickableShape(properties) {

	/** Function used to draw the shape */
	this.drawFunction = properties["drawFunction"];
	
	/** Option to use to close the path - e.g. closePath(), fillRect(), stroke() etc */
	this.closeFunction = properties["closeFunction"];
	
	/** Method caled when this shape has been clicked */
	this.clickFunction = properties["clickFunction"];
	
	/** Called before the draw() function is called. */
	this.preDraw = function(pContext) {
		if (this.paramDefined(pContext) && (this.drawFunctionDefined() || this.closeFunctionDefined() )) {
			pContext.beginPath();
			return true;
		} else {			
			console.debug("drawfunction or context was not fined on call to preDraw()");
			return false;
		}
	}
	
	/** Called to draw the object after preDraw() has been called.  Returns false if there isn't a context or there isn't a draw or close function */
	this.draw = function(pContext) {
		if (this.paramDefined(pContext) && this.drawFunctionDefined()) {
			this.drawFunction(pContext);
		} else {
			console.debug("drawfunction or context was not fined on call to draw()");
		}
	}
	
	/** Called after the draw() function is called - pX and pY are locations of mouse click */
	this.postDraw = function(pContext, pX, pY) {
		if (this.paramDefined(pContext)) {
			
			// Check for path clicks
			if (this.clickFunctionDefined() && this.paramDefined(pX) && this.paramDefined(pY)) {
				if (pContext.isPointInPath(pX, pY)) {
					this.clickFunction();
				}
			}
			
			if (this.closeFunctionDefined()) {
				this.closeFunction();
			} else {
				pContext.closePath();
			}
			
		} else {
			console.debug("context was not fined on call to postDraw()");
		}
	}
	
	/** Checks that a draw function has been provided or not */
	this.drawFunctionDefined = function() {
		return this.isDefined(this.drawFunction);
	}
	
	/** Checks that a click event handler function has been provided or not */
	this.clickFunctionDefined = function() {
		return this.isDefined(this.clickFunction);
	}
	
	
	/** Checks that a path closing function has been provided or not */
	this.closeFunctionDefined = function() {
		return this.isDefined(this.closeFunction);
	}
	
	/** Checks that a parameter is defined */
	this.paramDefined = function(pParam) {
		return this.isDefined(pParam);
	}
	
	/** Checks that a function has been provided or not */
	this.isDefined = function(pFunction) {
		if (typeof pFunction === 'undefined') {
			return false;
		}
		return true;
	}
	
}


