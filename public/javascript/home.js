function displayField() {
    document.getElementById("optionalText").style.display = 'none'
    document.getElementById("report2").style.display = 'flex'
    document.getElementById("report2").style.background = "none"
}

// disable backspace from going to the previous page
$(document).ready(function(){
    $("#searchField, #report2").keydown(function (e) {
        var key = e.keyCode || e.charCode;
        if (key == 8 || key == 46) {
            // e.preventDefault();
            e.stopPropagation();
            $('#target').focus();
        }
    });
})