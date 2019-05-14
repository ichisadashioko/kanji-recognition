var model = null
async function loadMyModel() {
    model = await tf.loadLayersModel('kanji-model-v3-tfjs/model.json')
}

loadMyModel()

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
                    result_message_here
                </div>
            </div>`.replace('result_message_here', toast_message)

            // template = $('#result-template').html().replace('result_message_here', toast_message)
            $('#result-container').html(template)
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
 * 
 * @param {MouseEvent} mouse 
 */
function mouse_move(mouse) {
    if (pen.down) {
        if (pen.x == null || pen.y == null) {
            pen.x = (mouse.clientX - canvasOffset.x) / scale
            pen.y = (mouse.clientY - canvasOffset.y) / scale
        } else {
            var x = pen.x
            var y = pen.y

            var dX = (mouse.clientX - canvasOffset.x) / scale - x;
            var dY = (mouse.clientY - canvasOffset.y) / scale - y;

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
            pen.x = (mouse.clientX - canvasOffset.x) / scale
            pen.y = (mouse.clientY - canvasOffset.y) / scale

            isBlank = false
        }
    }
}

/**
 * 
 * @param {MouseEvent} mouse 
 */
function mouse_up(mouse) {
    pen.down = false
    pen.x = null
    pen.y = null
    predict()
}

window.onload = function () {

    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    doResize();
    clearCanvas();

    canvas.addEventListener('touchstart', (evt) => {
        evt.preventDefault()
        for (var i = 0; i < evt.changedTouches.length; i++) {
            touchstart(evt.changedTouches[i])
        }
    }, false)

    canvas.addEventListener('touchmove', (evt) => {
        evt.preventDefault()
        for (var i = 0; i < evt.changedTouches.length; i++) {
            touchmove(evt.changedTouches[i])
        }
    }, false)

    canvas.addEventListener('touchend', (evt) => {
        evt.preventDefault()
        for (var i = 0; i < evt.changedTouches.length; i++) {
            touchend(evt.changedTouches[i])
        }
    }, false)

    canvas.addEventListener('mousedown', (evt) => mouse_down(evt))
    canvas.addEventListener('mousemove', (evt) => mouse_move(evt))
    canvas.addEventListener('mouseup', (evt) => mouse_up(evt))
    canvas.addEventListener('mouseleave', (evt) => mouse_up(evt))

    window.addEventListener('keyup', (evt) => {
        if (evt.key == 'c') {
            clearCanvas()
        }
    })

    window.addEventListener('resize', function (e) {
        doResize();
    })
}