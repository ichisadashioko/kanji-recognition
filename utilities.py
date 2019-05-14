# encoding=utf-8
import os
import time
import re
import math

import numpy as np

import tensorflow as tf


def time_tostring(t):
    return time.strftime('%H:%M:%S', time.gmtime(t))


def time_now():
    return time.strftime('%Y-%m-%d_%H-%M-%S', time.gmtime())


def _bytes_feature(value):
    """Returns a bytes_list from a string / byte."""
    return tf.train.Feature(bytes_list=tf.train.BytesList(value=[value]))


def _float_feature(value):
    """Returns a float_list from a float / double."""
    return tf.train.Feature(float_list=tf.train.FloatList(value=[value]))


def _int64_feature(value):
    """Returns an int64_list from a bool / enum / int / uint."""
    return tf.train.Feature(int64_list=tf.train.Int64List(value=[value]))


def preprocess_image(tf_image):
    """
    Convert encoded `PNG` byte string to `Tensor` with shape `[64, 64, 1]`.
    Values are scaled between `[0.0, 1.0]`
    """
    tf_image = tf.image.decode_png(tf_image, channels=1)
    tf_image = tf.image.resize_images(tf_image, [64, 64])
    # tf_image = tf.cast(tf_image, tf.float32)
    # tf_image /= 255.0
    tf_image = tf_image / 255.0
    return tf_image


def load_and_preprocess_image(image_path):
    tf_image = tf.read_file(image_path)
    return preprocess_image(tf_image)


def load_and_preprocess_image_from_path_label(image_path, label):
    return load_and_preprocess_image(image_path), label


def convert_to_tfrec(all_image_paths, all_labels, filename):
    with tf.python_io.TFRecordWriter(filename) as tfrec_writer:
        idx = 0
        start_time = time.time()
        for image_path, label in zip(all_image_paths, all_labels):
            # image_raw = tf.read_file(image_path)
            image_raw = open(image_path, 'rb').read()

            feature = {
                'image_raw': _bytes_feature(image_raw),
                'label': _int64_feature(label),
            }

            example = tf.train.Example(
                features=tf.train.Features(feature=feature))

            tfrec_writer.write(example.SerializeToString())

            idx += 1
            if idx % 5000 == 0:
                active_time = time.time() - start_time
                avg_time = active_time / (idx)
                remain_time = avg_time * (len(all_image_paths) - idx)
                print(f'{idx}/{len(all_image_paths)}')
                print(f'ACTIVE_TIME: {time_tostring(active_time)}')
                print(f'REMAIN_TIME: {time_tostring(remain_time)}')
                print(f'AVG_TIME: {avg_time:.4f}s')
                print('=' * 32)


def load_tfrecord(filename: str):
    """
    Load `TFRecord` file that has two features `image_raw` and `label`.
    """
    tfrec_ds = tf.data.TFRecordDataset(filename)

    # Create a dictionary describing the features
    image_feature_description = {
        'image_raw': tf.FixedLenFeature([], tf.string),
        'label': tf.FixedLenFeature([], tf.int64),
    }

    def _parse_image_function(example_proto):
        # Parse the input tf.Example proto using the dictionary above
        return tf.parse_single_example(example_proto, image_feature_description)

    ds = tfrec_ds.map(_parse_image_function)

    def preprocess_image_label_tfrecord(tfrec_features):
        image_raw = tfrec_features['image_raw']
        label = tfrec_features['label']
        return preprocess_image(image_raw), label

    ds = ds.map(preprocess_image_label_tfrecord)

    return ds


def kanji_model_v1():
    """
    Return a deep CNN model.
    `input_shape` = (?, 64, 64, 1)
    `output_shape` = (?, 2199)
    """
    model = tf.keras.Sequential([
        tf.keras.layers.Conv2D(
            filters=32,
            kernel_size=16,
            # padding='same',
            activation=tf.nn.relu,
            name=f'Conv2D_NUM_1',
            input_shape=(64, 64, 1,),
            data_format='channels_last',
        ),
        tf.keras.layers.Dropout(
            rate=0.4,
            name=f'Dropout_NUM_1',
        ),
        tf.keras.layers.MaxPool2D(
            pool_size=2,
            name=f'MaxPool2D_NUM_1',
        ),
        tf.keras.layers.Conv2D(
            filters=64,
            kernel_size=8,
            # padding='same',
            activation=tf.nn.relu,
            name=f'Conv2D_NUM_2',
        ),
        tf.keras.layers.MaxPool2D(
            pool_size=2,
            name=f'MaxPool2D_NUM_2',
        ),
        tf.keras.layers.Conv2D(
            filters=128,
            kernel_size=4,
            # padding='same',
            activation=tf.nn.relu,
            name=f'Conv2D_NUM_3',
        ),
        tf.keras.layers.MaxPool2D(
            pool_size=2,
            name=f'MaxPool2D_NUM_3',
        ),
        # tf.keras.layers.Conv2D(
        #     filters=256,
        #     kernel_size=4,
        #     padding='same',
        #     activation=tf.nn.relu,
        #     name=f'Conv2D_NUM_4',
        # ),
        # tf.keras.layers.MaxPool2D(
        #     pool_size=2,
        #     name=f'MaxPool2D_NUM_4',
        # ),
        tf.keras.layers.Flatten(
            name=f'Flatten_NUM_1',
        ),
        tf.keras.layers.Dense(
            units=512,
            activation=tf.nn.relu,
            name=f'Dense_NUM_1',
        ),
        tf.keras.layers.Dense(
            units=2199,
            activation=tf.nn.softmax,
            name=f'Output_Dense_layer',
        ),
    ])

    return model


def kanji_model_v2():
    """
    Return a deep CNN model.
    `input_shape` = (?, 64, 64, 1)
    `output_shape` = (?, 2199)
    Single `Dropout` layer
    """
    model = tf.keras.Sequential([
        tf.keras.layers.Conv2D(
            filters=32,
            kernel_size=17,
            activation=tf.nn.relu,
            name=f'Conv2D_NUM_1',
            input_shape=(64, 64, 1,),
            data_format='channels_last',
        ),
        tf.keras.layers.Dropout(
            rate=0.4,
            name=f'Dropout_NUM_1',
        ),
        tf.keras.layers.MaxPool2D(
            pool_size=2,
            name=f'MaxPool2D_NUM_1',
        ),
        tf.keras.layers.Conv2D(
            filters=64,
            kernel_size=5,
            activation=tf.nn.relu,
            name=f'Conv2D_NUM_2',
        ),
        tf.keras.layers.MaxPool2D(
            pool_size=2,
            name=f'MaxPool2D_NUM_2',
        ),
        tf.keras.layers.Conv2D(
            filters=128,
            kernel_size=3,
            activation=tf.nn.relu,
            name=f'Conv2D_NUM_3',
        ),
        tf.keras.layers.MaxPool2D(
            pool_size=2,
            name=f'MaxPool2D_NUM_3',
        ),
        tf.keras.layers.Flatten(
            name=f'Flatten_NUM_1',
        ),
        tf.keras.layers.Dense(
            units=512,
            activation=tf.nn.relu,
            name=f'Dense_NUM_1',
        ),
        tf.keras.layers.Dense(
            units=2199,
            activation=tf.nn.softmax,
            name=f'Output_Dense_layer',
        ),
    ])

    return model


def kanji_model_v3():
    """
    Return a deep CNN model.

    `input_shape` = (?, 64, 64, 1)

    `output_shape` = (?, 2199)

    3 times Conv2D => Dropout => Maxpool2D
    """
    model = tf.keras.Sequential([
        tf.keras.layers.Conv2D(
            filters=32,
            kernel_size=17,
            activation=tf.nn.relu,
            name=f'Conv2D_NUM_1',
            input_shape=(64, 64, 1,),
            data_format='channels_last',
        ),
        tf.keras.layers.Dropout(
            rate=0.4,
            name=f'Dropout_NUM_1',
        ),
        tf.keras.layers.MaxPool2D(
            pool_size=2,
            name=f'MaxPool2D_NUM_1',
        ),
        tf.keras.layers.Conv2D(
            filters=64,
            kernel_size=5,
            activation=tf.nn.relu,
            name=f'Conv2D_NUM_2',
        ),
        tf.keras.layers.Dropout(
            rate=0.2,
            name=f'Dropout_NUM_2',
        ),
        tf.keras.layers.MaxPool2D(
            pool_size=2,
            name=f'MaxPool2D_NUM_2',
        ),
        tf.keras.layers.Conv2D(
            filters=128,
            kernel_size=3,
            activation=tf.nn.relu,
            name=f'Conv2D_NUM_3',
        ),
        tf.keras.layers.Dropout(
            rate=0.2,
            name=f'Dropout_NUM_3',
        ),
        tf.keras.layers.MaxPool2D(
            pool_size=2,
            name=f'MaxPool2D_NUM_3',
        ),
        tf.keras.layers.Flatten(
            name=f'Flatten_NUM_1',
        ),
        tf.keras.layers.Dense(
            units=512,
            activation=tf.nn.relu,
            name=f'Dense_NUM_1',
        ),
        tf.keras.layers.Dense(
            units=2199,
            activation=tf.nn.softmax,
            name=f'Output_Dense_layer',
        ),
    ])

    return model


def kanji_model_v4():
    """
    Return a deep CNN model.

    `input_shape` = (?, 64, 64, 1)

    `output_shape` = (?, 2199)
    
    No `Dropout`
    """
    model = tf.keras.Sequential([
        tf.keras.layers.Conv2D(
            filters=32,
            kernel_size=17,
            activation=tf.nn.relu,
            name=f'Conv2D_NUM_1',
            input_shape=(64, 64, 1,),
            data_format='channels_last',
        ),
        tf.keras.layers.MaxPool2D(
            pool_size=2,
            name=f'MaxPool2D_NUM_1',
        ),
        tf.keras.layers.Conv2D(
            filters=64,
            kernel_size=5,
            activation=tf.nn.relu,
            name=f'Conv2D_NUM_2',
        ),
        tf.keras.layers.MaxPool2D(
            pool_size=2,
            name=f'MaxPool2D_NUM_2',
        ),
        tf.keras.layers.Conv2D(
            filters=128,
            kernel_size=3,
            activation=tf.nn.relu,
            name=f'Conv2D_NUM_3',
        ),
        tf.keras.layers.MaxPool2D(
            pool_size=2,
            name=f'MaxPool2D_NUM_3',
        ),
        tf.keras.layers.Flatten(
            name=f'Flatten_NUM_1',
        ),
        tf.keras.layers.Dense(
            units=512,
            activation=tf.nn.relu,
            name=f'Dense_NUM_1',
        ),
        tf.keras.layers.Dense(
            units=2199,
            activation=tf.nn.softmax,
            name=f'Output_Dense_layer',
        ),
    ])

    return model
