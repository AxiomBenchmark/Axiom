
var navAgent = {
    x : 0,
    y : 0,
    getElement : function(x, y) {
        return $('[data-x=' + x + '][data-y=' + y + ']');
    },
    getCurrentElement : function() {
        return $('[data-x=' + navAgent.x + '][data-y=' + navAgent.y + ']');
    },
    navigate : function(direction) {
        var x = navAgent.x;
        var y = navAgent.y;
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
        
    
        //if there was no previous element, get 0,0
        if (!navAgent.prevElement) {
            x = 0;
            y = 0;
        }
    
        var element = navAgent.getElement(x,y);
    
        if (element.length) {
    
            if (navAgent.prevElement) {
                navAgent.prevElement.removeClass('selected');
            }
            
            navAgent.prevElement = element;
            navAgent.x = x;
            navAgent.y = y;
            element.addClass('selected');
        }
    }
}

navAgent.upperX = 0;
navAgent.upperY = 0;
navAgent.lowerX = 0;
navAgent.lowerY = 0;
while ($('[data-x=' + navAgent.upperX + ']').length) { navAgent.upperX++; }
while ($('[data-y=' + navAgent.upperY + ']').length) { navAgent.upperY++; }
while ($('[data-x=' + navAgent.lowerX + ']').length) { navAgent.lowerX--; }
while ($('[data-y=' + navAgent.lowerY + ']').length) { navAgent.lowerY--; }
navAgent.lowerX++;
navAgent.lowerY++;
navAgent.upperX--;
navAgent.upperY--;
console.log('(' + navAgent.lowerX + ',' + navAgent.upperX + '),(' + navAgent.lowerY + ',' + navAgent.upperY + ')');

$(document).on('keydown', function(e) {
    switch (e.which) {
        case 38:
            e.preventDefault();
            navAgent.navigate('up');
            break;
        case 40:
            e.preventDefault();
            navAgent.navigate('down');
            break;
        case 37:
            e.preventDefault();
            navAgent.navigate('left');
            break;
        case 39:
            e.preventDefault();
            navAgent.navigate('right');
            break;
        case 13: //enter
        case 32: //space (may want to remove)
            e.preventDefault();
            var ele = navAgent.getCurrentElement();
            console.log(ele.length);
            console.log('click!');
            $(ele)[0].click();
            break;
        case 8: //backspace
            window.history.back();
    }
});