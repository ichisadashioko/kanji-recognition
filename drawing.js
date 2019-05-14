const MIN_RADIUS = 1;
const MAX_RADIUS = 5;
const MIN_DISTANCE = 1; //MIN_RADIUS / 4.0;
const MAX_DISTANCE = 96;

const PAD_WIDTH = 64;
const PAD_HEIGHT = 64;

var lastClear = Date.now();


var brushStyle = 'rgb(255,255,255)';
var bgStyle = 'rgb(0,0,0)';

var canvas;
var ctx;
var scale = 1;

var pen = {
    x: null,
    y: null,
    down: false,
    id: null,
    radius: MIN_RADIUS,
}

var isBlank = true;

var canvasOffset = {
    x: 0,
    y: 0,
}

function doResize() {

    var c = $('#canvas')

    var new_scale = Math.min(
        window.innerWidth / PAD_WIDTH,
        window.innerHeight / PAD_HEIGHT
    );

    scale = new_scale

    c.css('transform', ('scale(' + new_scale + ')'))
    c.css('left', '0')
    canvasOffset.x = 0;

    var ui_container = $('#ui-container')

    var ui_width = window.innerWidth - new_scale * PAD_WIDTH;

    if (ui_width == 0) {
        ui_width = window.innerWidth;
    }

    var ui_height = window.innerHeight - new_scale * PAD_HEIGHT;

    if (ui_height == 0) {
        ui_height = window.innerHeight;
        canvasOffset.x = ui_width;
        c.css('left', ui_width)
        ui_container.css('left', '0')
        ui_container.css('right', '')
    }

    ui_container.css('width', ('' + ui_width + 'px'))
    ui_container.css('height', ('' + ui_height + 'px'))
}

function clearCanvas() {
    isBlank = true

    pen.down = false
    pen.id = null
    pen.x = null
    pen.y = null

    var width = canvas.width;
    var height = canvas.height;

    ctx.fillStyle = bgStyle;
    ctx.fillRect(0, 0, width, height);
}

/**
 * Initialize pen
 * @param {Touch} touch 
 */
function touchstart(touch) {
    if (!pen.down) {
        pen.down = true
        pen.id = touch.identifier
        pen.x = (touch.clientX - canvasOffset.x) / scale
        pen.y = (touch.clientY - canvasOffset.y) / scale
    }
}
/**
 * 
 * @param {Touch} touch 
 */
function touchmove(touch) {
    console.log(touch)
    if (!pen.down) { return }
    else if (pen.id == touch.identifier) {
        if (pen.x == null || pen.y == null) {
            pen.x = (touch.clientX - canvasOffset.x) / scale
            pen.y = (touch.clientY - canvasOffset.y) / scale
        } else {
            var x = pen.x
            var y = pen.y

            var dX = (touch.clientX - canvasOffset.x) / scale - x;
            var dY = (touch.clientY - canvasOffset.y) / scale - y;

            var distance = Math.sqrt(dX ** 2 + dY ** 2)

            var step = distance / MIN_DISTANCE
            var deltaX = dX / step
            var deltaY = dY / step

            for (let i = 0; i < step; i++) {
                ctx.fillStyle = brushStyle;
                ctx.beginPath()
                ctx.arc(x, y, pen.radius, 0, Math.PI * 2, false)
                ctx.fill()

                x += deltaX
                y += deltaY
            }
            pen.x = (touch.clientX - canvasOffset.x) / scale
            pen.y = (touch.clientY - canvasOffset.y) / scale

            isBlank = false
        }
    }
}

/**
 * 
 * @param {Touch} touch 
 */
function touchend(touch) {
    if (pen.down) {
        if (pen.id == touch.identifier) {
            pen.id == null
            pen.down = false
            pen.x = null
            pen.y = null
        }
    }
}
