#!/usr/bin/env python

import csv
from psychopy_util import *
from config import *


def show_one_trial(image, fixation_time, block_index, practice_i=-1):
    # show image and try to get a response
    event.clearEvents()
    response = presenter.draw_stimuli_for_response(stimuli=(bg, image), max_wait=IMG_TIME, response_keys={'k', 'd'})

    if response is not None and response[1] < IMG_TIME:
        # continue to show the image
        presenter.draw_stimuli_for_duration(stimuli=(bg, image), duration=IMG_TIME - response[1])
    if response is None:
        # show fixation and try to get a response
        response = presenter.draw_stimuli_for_response(stimuli=(bg, plus_sign), max_wait=fixation_time, response_keys={'k', 'd'})
        if response is not None:
            if response[1] < fixation_time:
                # continue to show the fixation
                presenter.draw_stimuli_for_duration(stimuli=(bg, plus_sign), duration=fixation_time - response[1])
            response = (response[0], response[1] + IMG_TIME)  # fix RT
    else:
        # show fixation
        presenter.draw_stimuli_for_duration(stimuli=(bg, plus_sign), duration=fixation_time)

    if practice_i > -1:
        if response is None:
            feedback_stim = visual.TextStim(presenter.window, PRAC_FEEDBACK_NO_RESP, wrapWidth=1.7)
            stims = (bg, feedback_stim)
        else:
            correct = response[0] == PRAC_ANSWERS[practice_i]
            img_type = 'positive' if PRAC_ANSWERS[practice_i] == 'k' else 'negative'
            rt_in_ms = int(response[1] * 1000)
            feedback = PRAC_FEEDBACK.format('Correct', img_type, rt_in_ms) if correct else \
                       PRAC_FEEDBACK.format('Incorrect', img_type, rt_in_ms)
            feedback_stim = visual.TextStim(presenter.window, feedback, pos=(0, -0.7), wrapWidth=1.7)
            stims = (bg, image, feedback_stim)
        presenter.draw_stimuli_for_duration(stims, PRAC_FEEDBACK_TIME)

    # results
    if response is not None:
        data = {'resp_key': response[0], 'rt': response[1], 'img_name': image._imName}
    else:
        data = {'resp_key': 'None', 'img_name': image._imName}
    data['block_index'] = block_index
    return data


def validation(items):
    # check empty field
    for key in items.keys():
        if items[key] is None or len(items[key]) == 0:
            return False, str(key) + ' cannot be empty.'
    # check age
    try:
        if int(items['Age']) <= 0:
            raise ValueError
    except ValueError:
        return False, 'Age must be a positive integer'
    # everything is okay
    return True, ''


def show_one_block(img_seq, block_index, fix_time_seq=(), practice=False):
    presenter.draw_stimuli_for_duration(stimuli=(bg, plus_sign), duration=INITIAL_FIX_TIME)
    num_trials = len(prac_imgs) if practice else NUM_TRIALS_PER_BLOCK
    for i in range(num_trials):
        data = show_one_trial(img_seq[i], fixation_time=PRAC_FIX_TIME, block_index=block_index, practice_i=i) \
            if practice else show_one_trial(img_seq[i], fix_time_seq[i], block_index)
        dataLogger.write_json(data)


if __name__ == '__main__':
    # subject ID dialog
    sinfo = {'ID': '', 'Gender': ['Female', 'Male'], 'Age': '', 'Handedness': ['Right', 'Left'], 'Mode': ['Exp', 'Test']}
    show_form_dialog(sinfo, validation, order=['ID', 'Gender', 'Age', 'Handedness', 'Mode'])
    sid = int(sinfo['ID'])

    # create logging file
    infoLogger = DataLogger(LOG_FOLDER, str(sid) + '.log', log_name='info_logger', logging_info=True)
    # create data file
    dataLogger = DataLogger(DATA_FOLDER, str(sid) + '.txt', log_name='data_logger')
    # save info from the dialog box
    dataLogger.write_json({
        k: str(sinfo[k]) for k in sinfo.keys()
    })
    # create window
    presenter = Presenter(fullscreen=(sinfo['Mode'] == 'Exp'), info_logger='info_logger')
    plus_sign = visual.TextStim(presenter.window, text='+')
    bg = visual.Rect(presenter.window, pos=presenter.CENTRAL_POS, fillColor='#000000', size=(4.1, 4.1))
    # load sequences
    with open('stimuli.csv', 'rU') as csvDataFile:
        reader = csv.reader(csvDataFile)
        face_image_sequences, scene_image_sequences = [], []
        for i in range(4):  # first 4 rows are faces
            face_image_sequences.append(
                [visual.ImageStim(presenter.window, image=IMG_FOLDER_FACES + img) for img in reader.next()])
        for i in range(4):  # last 4 rows are scenes
            scene_image_sequences.append(
                [visual.ImageStim(presenter.window, image=IMG_FOLDER_SCENES + img) for img in reader.next()])
    with open('fixation_times.csv', 'rU') as csvDataFile:
        reader = csv.reader(csvDataFile)
        fixation_time_sequences = [[float(t) for t in row] for row in reader]
    # practice
    prac_imgs = presenter.load_all_images(PRAC_IMG_FOLDER, '.jpg')

    # show instructions
    presenter.show_instructions(INSTR_BEGIN)
    # show trials
    presenter.show_instructions(INSTR_PRAC, next_page_text=None)
    show_one_block(prac_imgs, 'prac', practice=True)
    for i in range(4):  # running 4 face blocks + scene blocks (= 8 blocks total)
        presenter.show_instructions(INSTR_FACE)
        show_one_block(face_image_sequences[i], i * 2 + 1, fixation_time_sequences[i * 2])
        presenter.show_instructions(INSTR_SCENE)
        show_one_block(scene_image_sequences[i], i * 2 + 2, fixation_time_sequences[i * 2 + 1])

    # end of experiment
    presenter.show_instructions(INSTR_END)
    infoLogger.info('End of experiment')
