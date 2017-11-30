
var position = {
    x : 0,
    y : 0,
    getElement : function(x, y) {
        return $('[data-x=' + x + '][data-y=' + y + ']');
    },
    getCurrentElement : function() {
        return $('[data-x=' + position.x + '][data-y=' + position.y + ']');
    }
}
var prevElement;

position.upperX = 0;
while ($('[data-x=' + position.upperX + ']').length) {
    position.upperX++;
}

position.upperY = 0;
while ($('[data-y=' + position.upperY + ']').length) {
    position.upperY++;
}

position.lowerX = 0;
while ($('[data-x=' + position.lowerX + ']').length) {
    position.lowerX--;
}

position.lowerY = 0;
while ($('[data-y=' + position.lowerY + ']').length) {
    position.lowerY--;
}

position.lowerX++;
position.lowerY++;
position.upperX--;
position.upperY--;


console.log('(' + position.lowerX + ',' + position.upperX + '),(' + position.lowerY + ',' + position.upperY + ')');

$( document ).ready(function() {
    prevElement = position.getCurrentElement();
    prevElement.addClass('selected');
});

$(document).on('keydown', function(e) {
    e.preventDefault();
    //up: 38
    //down: 40
    //left: 37
    //right: 39
    //enter: 13
    switch (e.keyCode) {
        case 38:
            navigate('up');
            break;
        case 40:
            navigate('down');
            break;
        case 37:
            navigate('left');
            break;
        case 39:
            navigate('right');
            break;
        case 13:
            var ele = position.getCurrentElement();
            console.log(ele.length);
            console.log('click!');
            $(ele)[0].click();
    }
});

var navigate = function(direction) {
    var x = position.x;
    var y = position.y;
    switch (direction) {
        case 'up':
            y--;
            break;
        case 'down':
            y++;
            break;
        case 'left':
            x--;
            break;
        case 'right':
            x++;
            break;
    }
    console.log('navigating ' + direction);
    console.log('selecting (' + x + ',' + y +')');
    var element = position.getElement(x,y);
    if (element.length && prevElement) {
        position.x = x;
        position.y = y;
        prevElement.removeClass('selected');
        prevElement = element;
        element.addClass('selected');
    }
}