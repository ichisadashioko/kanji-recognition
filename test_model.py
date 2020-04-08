# encoding=utf-8
import os
import re
import time
import math

import tensorflow as tf

import utilities


class MyClassback(tf.keras.callbacks.Callback):
    def __init__(self, model_prefix: str, save_dir: str):
        self.prefix = model_prefix
        self.save_dir = save_dir

    def on_epoch_end(self, epoch, logs={}):
        acc = logs.get('acc')

        if epoch % 5 == 0:
            self.save_model_weights(epoch, acc)

        if acc >= 0.99:
            self.model.stop_training = True
            self.save_model_weights(epoch, acc)

    def save_model_weights(self, epoch, acc):
        if not os.path.exists(self.save_dir):
            os.makedirs(self.save_dir)
        model_weights_filename = f'{self.save_dir}/{self.prefix}_{utilities.time_now()}_epoch_{str(epoch).zfill(2)}_acc_{acc:.2f}.h5'
        self.model.save_weights(model_weights_filename)


if __name__ == "__main__":
    model = utilities.kanji_model_v3()
    model.compile(
        optimizer='adam',
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy'],
    )
    model.summary()

    dataset_filename = 'kanji_dataset.tfrecord'

    buffer_size = 256776
    batch_size = 256
    steps_per_epoch = math.ceil(buffer_size / batch_size)

    ds = utilities.load_tfrecord(dataset_filename)
    ds.cache()
    ds.apply(tf.data.experimental.shuffle_and_repeat(buffer_size=buffer_size))
    ds.batch(batch_size)
    print(ds)

    # callback = MyClassback('kanji_model_v3', 'kanji_model_v3')

    # model.fit(
    #     ds,
    #     steps_per_epoch=steps_per_epoch,
    #     epochs=5,
    #     callbacks=[callback],
    # )