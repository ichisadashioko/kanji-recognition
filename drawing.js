
var lastClear = Date.now()


var brushStyle = 'rgb(255,255,255)'
var bgStyle = 'rgb(0,0,0)'

var canvas
var ctx
var scale = 1

var pen = {
    x: null,
    y: null,
    down: false,
    id: null,
    radius: MIN_RADIUS,
}

var isBlank = true

var canvasOffset = {
    x: 0,
    y: 0,
}

function clearCanvas() {
    isBlank = true

    pen.down = false
    pen.id = null
    pen.x = null
    pen.y = null

    var width = canvas.width
    var height = canvas.height

    ctx.fillStyle = bgStyle
    ctx.fillRect(0, 0, width, height)
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

            var dX = (touch.clientX - canvasOffset.x) / scale - x
            var dY = (touch.clientY - canvasOffset.y) / scale - y

            var distance = Math.sqrt(dX ** 2 + dY ** 2)

            var step = distance / MIN_DISTANCE
            var deltaX = dX / step
            var deltaY = dY / step

            for (let i = 0; i < step; i++) {
                ctx.fillStyle = brushStyle
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
