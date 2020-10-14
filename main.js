import * as constants from './constants.js'

var model = null
async function loadMyModel() {
    model = await tf.loadLayersModel('kanji-model-v3-tfjs/model.json')
}

loadMyModel()

var results_container = document.getElementById('results-container')


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

function predict() {
    var canvas = document.getElementById('canvas')
    input_image = tf.browser.fromPixels(canvas, 1)
    input_image = input_image.asType('float32')
    input_image = input_image.div(255.0)
    input_image = input_image.reshape([1, 64, 64, 1])

    if (model != null) {
        result = model.predict(input_image)

        result.array().then((res) => {
            mapped_result = []
            for (let i = 0; i < res[0].length; i++) {
                mapped_result.push([label_dict[i], res[0][i] * 100])
            }

            mapped_result.sort((a, b) => { return b[1] - a[1] })
            // console.log(mapped_result)

            toast_message = ''
            for (let i = 0; i < 5; i++) {
                toast_message += `<div>${mapped_result[i][0]} - ${mapped_result[i][1].toFixed(2)}%</div>`
            }
            template = `
            <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-body">
                    ${toast_message}
                </div>
            </div>`

            results_container.innerHTML = template
        })
    }

}

/**
 *
 * @param {MouseEvent} mouse
 */
function mouse_down(mouse) {
    pen.down = true
}
/**
 * @param {MouseEvent} evt
 */
function mouse_move(mouse) {
    if (pen.down) {
        if (pen.x == null || pen.y == null) {
            pen.x = (evt.clientX - canvasOffset.x) / scale
            pen.y = (evt.clientY - canvasOffset.y) / scale
        } else {
            var x = pen.x
            var y = pen.y

            var dX = (evt.clientX - canvasOffset.x) / scale - x
            var dY = (evt.clientY - canvasOffset.y) / scale - y

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
            pen.x = (evt.clientX - canvasOffset.x) / scale
            pen.y = (evt.clientY - canvasOffset.y) / scale

            isBlank = false
        }
    }
}

/**
 * @param {MouseEvent} evt
 */
function mouse_up(evt) {
    pen.down = false
    pen.x = null
    pen.y = null
    predict()
}


var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')
var ui_container = document.getElementById('ui-container')

function updateLayout() {
    var new_scale = Math.min(
        window.innerWidth / constants.PAD_WIDTH,
        window.innerHeight / constants.PAD_HEIGHT
    )

    scale = new_scale

    c.css('transform', ('scale(' + new_scale + ')'))
    c.css('left', '0')
    canvasOffset.x = 0;

    var ui_width = window.innerWidth - new_scale * constants.PAD_WIDTH;

    if (ui_width == 0) {
        ui_width = window.innerWidth;
    }

    var ui_height = window.innerHeight - new_scale * constants.PAD_HEIGHT;

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

updateLayout()
clearCanvas()

canvas.addEventListener('touchstart', function (evt) {
    evt.preventDefault()
    for (var i = 0; i < evt.changedTouches.length; i++) {
        touchstart(evt.changedTouches[i])
    }
}, false)

canvas.addEventListener('touchmove', function (evt) {
    evt.preventDefault()
    for (var i = 0; i < evt.changedTouches.length; i++) {
        touchmove(evt.changedTouches[i])
    }
}, false)

canvas.addEventListener('touchend', function (evt) {
    evt.preventDefault()
    for (var i = 0; i < evt.changedTouches.length; i++) {
        touchend(evt.changedTouches[i])
    }
}, false)

canvas.addEventListener('mousedown', function (evt) { mouse_down(evt) })
canvas.addEventListener('mousemove', function (evt) { mouse_move(evt) })
canvas.addEventListener('mouseup', function (evt) { mouse_up(evt) })
canvas.addEventListener('mouseleave', function (evt) { mouse_up(evt) })

window.addEventListener('keyup', function (evt) {
    if (evt.key == 'c') {
        clearCanvas()
    }
})

window.addEventListener('resize', function (evt) {
    updateLayout()
})

document.getElementById('clear').addEventListener('click', function () {
    clearCanvas()
})

document.getElementById('predict').addEventListener('click', function () {
    predict()
})
