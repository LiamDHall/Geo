// Starts Game when play button clicked
$('.play').click(function() {
    gameCanvas.create(); // Creates Canvas
    $('.menu').removeClass('display-toggle'); // Hide menu
    createZone(); // Adds Touch Controls
    addPause(); // Add pause to heads up
});