#!/usr/bin/env python

import pandas as pd
import os
from data_conversion_util import *

DATA_FOLDER = 'data/'
LONG_CSV_NAME = 'val_bias_data_long.csv'
COUNTS_CSV_NAME = 'val_bias_data_counts.csv'


def convert_to_long_csv():
    data = [flatten(load_json(DATA_FOLDER + datafile, multiple_obj=True), obj_id=datafile[:-4])
            for datafile in os.listdir(DATA_FOLDER)]
    col_names, data = fill_missing_keys(data)
    col_names, data = cut_and_stack(col_names, data, cut_start=6, cut_length=4,
                                    cut_number=198, skip_cols=range(4, 6))
    for i in range(1, 4):
        col_names[i] = col_names[i][2:].lower()
    list2csv(data, LONG_CSV_NAME, col_names)
    # add type and condition
    df = pd.read_csv(LONG_CSV_NAME)
    df['type'] = df.apply(lambda row: 'face' if 'face' in row.img_name else 'scene', axis=1)
    df['condition'] = df.apply(lambda row: get_cond(row), axis=1)
    df.to_csv(LONG_CSV_NAME, index=False)
    return df


def get_cond(row):
    if row.type == 'face':
        if 'SP' in row.img_name or 'SU' in row.img_name:
            return 'ambiguous'
        elif 'HA' in row.img_name:
            return 'positive'
        elif 'AN' in row.img_name:
            return 'negative'
    elif row.type == 'scene':
        if '/A' in row.img_name:
            return 'ambiguous'
        elif '/P' in row.img_name:
            return 'positive'
        elif '/N' in row.img_name:
            return 'negative'


def convert_to_counts_csv(df):
    df = df[df.block_index != 'prac'].groupby(['id', 'type', 'condition'])
    resp_counts = df['resp_key'].value_counts()
    data_list = [['id', 'face_ambiguous_k', 'face_ambiguous_d', 'face_ambiguous_none',
                  'face_positive_k', 'face_positive_d', 'face_positive_none',
                  'face_negative_k', 'face_negative_d', 'face_negative_none',
                  'scene_ambiguous_k', 'scene_ambiguous_d', 'scene_ambiguous_none',
                  'scene_positive_k', 'scene_positive_d', 'scene_positive_none',
                  'scene_negative_k', 'scene_negative_d', 'scene_negative_none']]
    last_id = -1
    row = None
    for key, val in resp_counts.iteritems():
        if key[0] != last_id:  # new subject id
            # append last row
            if row is not None:
                data_list.append(row)
            # create new row
            row = [key[0]] + [0 for _ in range(len(data_list[0]) - 1)]
            last_id = key[0]
        row_index = 1
        if key[1] == 'scene':
            row_index += 9
        if key[2] == 'positive':
            row_index += 3
        elif key[2] == 'negative':
            row_index += 6
        if key[3] == 'd':
            row_index += 1
        elif key[3] == 'None':
            row_index += 2
        row[row_index] = val
    data_list.append(row)
    list2csv(data_list, COUNTS_CSV_NAME)


if __name__ == '__main__':
    data = convert_to_long_csv()
    convert_to_counts_csv(data)
