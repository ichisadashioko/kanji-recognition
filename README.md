# Kanji recognition

## Introduction

This project is inspired by the Tensorflow tutorial on [MNIST handwritten digit](http://web.archive.org/web/20190623161535/https://www.tensorflow.org/tutorials/estimators/cnn) when I was learning Convolutional Nerual Networks.

This project demonstrates building a CNN to recognize Japanese kanji characters.

## Write-up

__Labels__

Moving away from the MNIST example, my first problem was the labels. As I was learning RTK at that time, I thought those characters would be a good starting point as they fit my need (my need for using those characters during learning Japanese). I spent a few days writing some scrappers for getting those characters from a `memrise` course and `wikipedia`.

__Data__

While writing those scrappers, I realized that I had no dataset for training. Because of that, I created [a drawing/note taking app](https://github.com/ichisadashioko/handwriting_canvas) with `cordova` to generate some data without labeling. That took a few weeks and I was happy with that because that was one of my first mobile app experience.

A few weeks later, I realized that I was not generating nowhere enough data for training. The `MNIST` example has around 10,000 records for each labels. I had ~2000 labels and less than 10 records for 20% of those labels. I needed to find a way to create data. "Fonts" - a thing that came to my mind. While learning Japanese with Anki, the default font for rendering Japanese was pretty bad for learners - the characters were not rendered as we suppose to write them. I got my hand on some of the Japanese fonts that is suitable for Japanese learners from the community. I got the ideal to use Japanese fonts to generate image data. It took me a 1-2 months to complete [the project](https://github.com/ichisadashioko/generate_kanji_datasets).

__Training__

With the data ready, I was able to train reasonable good models (in a few weeks). I spent the next few months to build some applications that utilize that model - a web app demo, an android app, and a desktop app for labeling my hard-work writing data.

## Implementations

- [TensorFlow - Python](train_classifier_with_font_only.ipynb) - Train model with Python and TensorFlow.

- [tfjs](https://github.com/ichisadashioko/kanji-recognition/tree/gh-pages) (on `gh-pages` branch) - Use trained model to recognize handwriting from HTML canvas with JavaScript.

- [TensorFlow Lite](https://github.com/ichisadashioko/kanji-recognition-android) - Use trained model to create handwriting input app on Android device with Java/Kotlin.

## References

- [Deep Convolutional Networks for Handwritten Chinese Character Recognition - Yuhao Zhang](http://web.archive.org/web/20190712132138/http://yuhao.im/files/Zhang_CNNChar.pdf)

- [Tensorflow tutorial on building Convolution Neural Networks](http://web.archive.org/web/20190623161535/https://www.tensorflow.org/tutorials/estimators/cnn)
