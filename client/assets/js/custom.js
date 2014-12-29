//==========================================//
//  IA Logo Drag and Drop                   //
//                                          //
//  Author: John Sandoval                   //
//==========================================//

var App;
App = (function () {
    'use strict';

    //================================================
    //== Create an application state object factory ==
    //================================================
    var newState = function () {
            return {
                //== Number of complete drops
                numComplete: 0,
                //== Container element info
                container: {
                    offsetX: 0,
                    offsetY: 0
                },
                //== Drag click location 
                click: {
                    offsetX: 0,
                    offsetY: 0
                },
                //== Draggable element info
                draggables: [],
                draggable: null,
                draggableInitialX: 0,
                draggableInitialY: 0,
                //== Droppables element info
                droppables: [],
                droppable: null,
                //== Drag states
                dragging: false,
                dropTarget: false,
                //== UI text
                startText: 'Place the dots in their correct locations',
                endText: 'CONGRATULATIONS!!!'
            };
        },
    //============================================
    //== Create an application interface object ==
    //============================================
        AppModule = {
            initApp: function () {
                //== Create an application state object
                this.dragInfo = newState();
                //== Find the x/y offset of the drag container
                this.dragInfo.containerOffsetX = document.querySelector('.drag-container').offsetLeft;
                this.dragInfo.containerOffsetY = document.querySelector('.drag-container').offsetTop;
                //== Initialize text content
                document.getElementById('alert-text').innerHTML = this.dragInfo.startText;
                //== Attach an event listener to the reset button
                document.getElementById('start-over').addEventListener('click', AppModule.resetDraggables, false);
                //== Set a shortcut to the state object
                dnd = this.dragInfo;
            },
            initDraggable: function (dragClass) {
                var dragElements = document.querySelectorAll(dragClass),
                    numElements = 0,
                    i = 0;
                //== Clear the state value
                dnd.draggables = [];
                //== Store the number of draggable elements
                numElements = dragElements.length;    
                //== Store each draggable element
                for (i = 0; i < dragElements.length; i += 1) {
                    dnd.draggables.push({
                        element: dragElements[i],
                        initialLeft: dragElements[i].offsetLeft,
                        initialTop: dragElements[i].offsetTop
                    });
                    //== Add/adjust initial event listeners
                    dragElements[i].ondragstart = function () { return false; };
                    dragElements[i].addEventListener('mousedown', AppModule.beginDrag, false);
                }
            },
            initDroppable: function (dropClass) {
                var dropElements = document.querySelectorAll(dropClass),
                    numElements = 0,
                    i = 0;
                //== Clear the state value
                dnd.droppables = [];
                //== Store the number of droppable elements
                numElements = dropElements.length;
                //== Store the coordinates of each dropppable element
                for (i = 0; i < numElements; i += 1) {
                    dnd.droppables.push({
                        element: dropElements[i],
                        top:     dropElements[i].offsetTop,
                        right:   dropElements[i].offsetLeft + dropElements[i].offsetWidth,
                        bottom:  dropElements[i].offsetTop + dropElements[i].offsetHeight,
                        left:    dropElements[i].offsetLeft
                    });
                }
            },
            beginDrag: function (e) {
                dnd.dragging = true;
                //== Store the draggable element and initial position (for easy reset)
                dnd.draggable = e.target;
                dnd.draggableInitialX = e.target.offsetLeft;
                dnd.draggableInitialY = e.target.offsetTop;
                //== Store the click location
                dnd.clickOffsetX = e.offsetX;
                dnd.clickOffsetY = e.offsetY;
                //== Add remaining event listeners
                dnd.draggable.addEventListener('mousemove', AppModule.continueDrag, false);
                dnd.draggable.addEventListener('mouseup', AppModule.endDrag, false);
                e.preventDefault();
            },
            continueDrag: function (e) {
                var dragPosition = {};
                if (dnd.dragging) {
                    //== Style draggable element
                    AppModule.toggleDragStyles('on');
                    //== Calculate position of draggable element
                    dragPosition.left = e.pageX - dnd.containerOffsetX - dnd.clickOffsetX;
                    dragPosition.top = e.pageY - dnd.containerOffsetY - dnd.clickOffsetY;
                    dragPosition.right = dragPosition.left + dnd.draggable.offsetWidth;
                    dragPosition.bottom = dragPosition.top + dnd.draggable.offsetHeight;
                    //== Set position of draggable element
                    dnd.draggable.style.left = dragPosition.left + 'px';
                    dnd.draggable.style.top = dragPosition.top + 'px';
                    //== Check for intersect of droppable element
                    dnd.droppable = AppModule.isDropArea(dragPosition);
                    //== If droppable intersect then check for drag/drop match
                    if (dnd.droppable && dnd.droppable !== null) {
                        dnd.dropTarget = AppModule.isDropTarget();
                        if (dnd.dropTarget) {
                            dnd.droppable.classList.add('hover-target-good');
                        } else {
                            dnd.droppable.classList.add('hover-target-bad');
                        }
                    } else {
                        dnd.dropTarget = false;
                    }
                    //== Add event listener in case mouse leaves element before mouseup
                    dnd.draggable.addEventListener('mouseleave', AppModule.endDrag, false);
                }
            },
            isDropArea: function (dragPosition) {
                var numElements = 0,
                    i = 0;
                numElements = dnd.droppables.length;
                //== Loop all droppable elements with the draggable element
                for (i = 0; i < numElements; i += 1) {
                    if (
                            (   //== Top and Bottom
                                (dragPosition.top >= dnd.droppables[i].top && dragPosition.top <= dnd.droppables[i].bottom) ||
                                (dragPosition.bottom >= dnd.droppables[i].top && dragPosition.bottom <= dnd.droppables[i].bottom)
                            ) && (
                                //== Left and Right
                                (dragPosition.left >= dnd.droppables[i].left && dragPosition.left <= dnd.droppables[i].right) ||
                                (dragPosition.right >= dnd.droppables[i].left && dragPosition.right <= dnd.droppables[i].right)
                            )
                        ) {
                        //== If a match is found, return the droppable element
                        return dnd.droppables[i].element;
                    }
                    //== If no match then remove any hover helpers
                    dnd.droppables[i].element.classList.remove('hover-target-good');
                    dnd.droppables[i].element.classList.remove('hover-target-bad');
                }
                //== If no match found, return null
                return null;
            },
            isDropTarget: function () {
                if (dnd.draggable.dataset.dotColor === dnd.droppable.dataset.dotColor) {
                    return true;
                } else {
                    return false;
                }
            },
            toggleDragStyles: function (dragging) {
                if (dragging === 'on') {
                    dnd.draggable.style.opacity = 0.5;
                    dnd.draggable.style.zIndex = 1000;
                } else {
                    dnd.draggable.style.opacity = 1;
                    dnd.draggable.style.zIndex = 10;
                }
            },
            endDrag: function () {
                if (dnd.dropTarget) {
                    AppModule.snapDot();
                    AppModule.incrementCount();
                    AppModule.updateMessage();
                    dnd.draggable.removeEventListener('mousedown', AppModule.beginDrag, false);
                } else {
                    AppModule.resetDot();
                }
                //== Style the draggable element
                AppModule.toggleDragStyles('off');
                //== Reset droppable style
                AppModule.resetDroppables();
                //== Remove event listeners
                dnd.draggable.removeEventListener('mousemove', AppModule.continueDrag, false);
                dnd.draggable.removeEventListener('mouseup', AppModule.endDrag, false);
                dnd.draggable.removeEventListener('mouseleave', AppModule.endDrag, false);
                //== Update the state object
                dnd.dragging = false;
                dnd.draggable = null;
            },
            snapDot: function () {
                dnd.draggable.style.left = dnd.droppable.offsetLeft + 'px';
                dnd.draggable.style.top = dnd.droppable.offsetTop + 'px';
            },
            resetDot: function () {
                dnd.draggable.style.left = dnd.draggableInitialX + 'px';
                dnd.draggable.style.top = dnd.draggableInitialY + 'px';
            },
            incrementCount: function () {
                dnd.numComplete += 1;
                dnd.dropTarget = false;
            },
            updateMessage: function () {
                var completeCount,
                    alertBox,
                    alertText;
                completeCount = document.getElementById('complete-count');
                alertBox = document.getElementById('alert-box');
                alertText = document.getElementById('alert-text');
                //== Update the completed count                    
                completeCount.textContent = dnd.numComplete.toString();
                //== If drag/drop not complete make sure alert bar is updated
                if (dnd.numComplete < 5) {
                    alertText.textContent = dnd.startText;
                    alertBox.classList.remove('alert-success');
                    alertBox.classList.add('alert-info');
                //== Otherwise update the alert bar to complete
                } else {
                    alertText.textContent = dnd.endText;
                    alertBox.classList.remove('alert-info');
                    alertBox.classList.add('alert-success');
                }
            },
            resetDraggables: function () {
                var numElements,
                    i;
                numElements = dnd.draggables.length;
                for (i = 0; i < numElements; i += 1) {
                    dnd.draggables[i].element.style.left = dnd.draggables[i].initialLeft + 'px';
                    dnd.draggables[i].element.style.top = dnd.draggables[i].initialTop + 'px';
                    dnd.draggables[i].element.addEventListener('mousedown', AppModule.beginDrag, false);
                }
                dnd.numComplete = 0;
                AppModule.updateMessage();
            },
            resetDroppables: function () {
                var numElements,
                    i;
                numElements = dnd.droppables.length;
                for (i = 0; i < numElements; i += 1) {
                    dnd.droppables[i].element.classList.remove('hover-target-good');
                    dnd.droppables[i].element.classList.remove('hover-target-bad');
                }
            }
        },
        dnd;

    //================================
    //== Initialize the application ==
    //================================
    AppModule.initApp();
    AppModule.initDraggable('.logo-dot');
    AppModule.initDroppable('.dest-dot');

    return AppModule;

}());