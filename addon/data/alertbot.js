self.port.on('log', function(m) {
    console.log(m);
});

self.port.on('alert', function(m) {
    alert(m)
});
