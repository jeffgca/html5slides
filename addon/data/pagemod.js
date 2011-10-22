$(document).ready(function() {

    /* pop up a panel */
    $("#panelify").click(function() {
        self.port.emit('panelify', true);
        return false;
    });
    
    /* make a web request and display the results */
    $("#requestify").click(function() {
        self.port.emit('requestify', true);
        return false;
    });
    
    $("#notify").click(function() {
        self.port.emit('notify', true);
        return false;
    });
    
    self.port.on('requested', function(message) {
        alert(message);
    });
});