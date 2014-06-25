window.onload = () => {
    var sources = {
        down: 'down.png',
        left: 'left.png',
        right: 'right.png',
        up: 'up.png',
        randomize: 'randomize.png',
        refresh: 'refresh.png'
    };

    loadImages(sources, initStage);

    function loadImages(sources, callback) {
        var assetDir = 'images/';
        var images = {};
        var loadedImages = 0;
        var numImages = 0;

        // Load all images from folder in loop
        for (var src in sources) {
            numImages++;
        }
        for (var src in sources) {
            images[src] = new Image();
            images[src].onload = function () {
                if (++loadedImages >= numImages) {
                    callback(images);
                }
            };
            images[src].src = assetDir + sources[src];
        }
    }  

    function initStage(images) {
        var stage = new Kinetic.Stage({
            container: 'floor',
            width: 1200,
            height: 1600
        });

        var button_x = 50;
        var button_y = 1200;
        var buttonSize = 150;

        var down = new Kinetic.Image({
            image: images.down,
            x: button_x,
            y: button_y,
            height: buttonSize,
            width: buttonSize             
        });

        var up = new Kinetic.Image({
            image: images.up,
            x: button_x + 150,
            y:button_y,
            height: buttonSize,
            width: buttonSize    
        });

        var left = new Kinetic.Image({
            image: images.left,
            x: button_x,
            y: button_y + 150,
            height: buttonSize,
            width: buttonSize
        });

        var right = new Kinetic.Image({
            image: images.right,
            x: button_x + 150,
            y: button_y + 150,
            height: buttonSize,
            width: buttonSize
        });

        var refresh = new Kinetic.Image({
            image: images.refresh,
            x: button_x + 320,
            y: button_y - 90,
            height: 450,
            width: 450
        });

        var randomize = new Kinetic.Image({
            image: images.randomize,
            x: button_x + 800,
            y: button_y - 20,
            height: 300,
            width: 300
        });
         
        var layer = new Kinetic.Layer();

        layer.add(down);
        layer.add(up);
        layer.add(left);
        layer.add(right);
        layer.add(refresh);
        layer.add(randomize);
        stage.add(layer);
    }
}; 