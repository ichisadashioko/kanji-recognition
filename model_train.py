# encoding=utf-8
import os
import time
import re
import math

import numpy as np
import pandas

import tensorflow as tf
# tf.enable_eager_execution()

# this is my custom library file that will host all the methods and model architectures
import utilities

import kanji_label_dict as kld


class MyClassback(tf.keras.callbacks.Callback):
    def __init__(self, prefix: str, save_dir: str):
        # append `prefix` to model weights to 
        self.prefix = prefix
        self.save_dir = save_dir
        self.last_acc = None
        # model weights will be saved every `save_iter` epoches
        self.save_iter = 5

    def on_epoch_end(self, epoch, logs={}):
        acc = logs.get('acc')

        if self.last_acc is None:
            self.last_acc = acc
        else:
            if self.last_acc > acc:
                self.save_model_weights(epoch, acc)

            self.last_acc = acc

        if acc >= 0.99:
            self.model.stop_training = True
            self.save_model_weights(epoch, acc)
        elif epoch % self.save_iter == 0:
            self.save_model_weights(epoch, acc)

    def save_model_weights(self, epoch, acc):
        if not os.path.exists(self.save_dir):
            os.makedirs(self.save_dir)
        model_weights_filename = f'{self.save_dir}/{self.prefix}_weights_epoch_{str(epoch).zfill(2)}_acc_{acc:.2f}_{utilities.time_now()}.h5'
        self.model.save_weights(model_weights_filename)


if __name__ == "__main__":
    model = utilities.kanji_model_v3()
    model.compile(
        optimizer='adam',
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy'],
    )
    model.summary()

    # the number of samples is 256776 (the last time I keep track of it)
    # full-sized `buffer_size` to be well shuffled
    buffer_size = 256776
    # small `buffer_size` for faster shuffling
    # buffer_size = 256

    batch_size = 256
    steps_per_epoch = math.ceil(buffer_size / batch_size)

    tfrecord_filename = 'kanji_dataset.tfrecord'
    ds = utilities.load_tfrecord(tfrecord_filename)
    ds = ds.cache()
    ds = ds.apply(tf.data.experimental.shuffle_and_repeat(
        buffer_size=buffer_size
    ))
    ds = ds.batch(batch_size)

    save_dir = 'kanji_model_v3'
    prefix = 'kanji_model_v3'
    callback = MyClassback(prefix=prefix, save_dir=save_dir)
    # callback.save_iter = 5

    histories = model.fit(
        ds,
        epochs=20,
        steps_per_epoch=steps_per_epoch,
        callbacks=[callback],
    )

    model_filename = f'{save_dir}/{prefix}_model_{utilities.time_now()}.h5'

    model.save(model_filename)
