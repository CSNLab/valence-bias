#!/usr/bin/env python

import csv
from psychopy_util import *
from config import *


def show_one_trial(image, fixation_time):
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

    # results
    if response is not None:
        data = {'resp_key': response[0], 'rt': response[1], 'img_name': image._imName}
    else:
        data = {'resp_key': 'None', 'img_name': image._imName}
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


def show_one_block(img_seq, fix_time_seq):
    presenter.draw_stimuli_for_duration(stimuli=(bg, plus_sign), duration=INITIAL_FIX_TIME)
    for i in range(NUM_TRIALS_PER_BLOCK):
        data = show_one_trial(img_seq[i], fix_time_seq[i])
        dataLogger.write_json(data)


if __name__ == '__main__':
    # subject ID dialog
    sinfo = {'ID': '', 'Gender': ['Female', 'Male'], 'Age': '', 'Handedness': ['Right', 'Left'], 'Mode': ['Exp', 'Test']}
    show_form_dialog(sinfo, validation, order=['ID', 'Gender', 'Age', 'Handedness', 'Mode'])
    sid = int(sinfo['ID'])

    # create logging file
    infoLogger = logging.getLogger()
    if not os.path.isdir(LOG_FOLDER):
        os.mkdir(LOG_FOLDER)
    logging.basicConfig(filename=LOG_FOLDER + str(sid) + '.log', level=logging.INFO,
                        format='%(asctime)s %(levelname)8s %(message)s')
    # create data file
    dataLogger = DataLogger(DATA_FOLDER, str(sid) + '.txt')
    # save info from the dialog box
    dataLogger.write_json({
        k: str(sinfo[k]) for k in sinfo.keys()
    })
    # create window
    presenter = Presenter(fullscreen=(sinfo['Mode'] == 'Exp'))
    plus_sign = visual.TextStim(presenter.window, text='+')
    bg = visual.Rect(presenter.window, pos=presenter.CENTRAL_POS, fillColor='#000000', size=(4.1, 4.1))
    # load sequences
    with open('stim1.csv', 'rU') as csvDataFile:
        reader = csv.reader(csvDataFile)
        face_image_sequences, scene_image_sequences = [], []
        for i in range(2):  # first 2 rows are faces
            face_image_sequences.append(
                [visual.ImageStim(presenter.window, image=IMG_FOLDER_FACES + img) for img in reader.next()])
        for i in range(2):  # last 2 rows are scenes
            scene_image_sequences.append(
                [visual.ImageStim(presenter.window, image=IMG_FOLDER_SCENES + img) for img in reader.next()])
    with open('fixation_times.csv', 'rU') as csvDataFile:
        reader = csv.reader(csvDataFile)
        fixation_time_sequences = [[float(t) for t in row] for row in reader]

    # show instructions
    presenter.show_instructions(INSTR_BEGIN)
    # show trials
    presenter.show_instructions(INSTR_FACE)
    show_one_block(face_image_sequences[0], fixation_time_sequences[0])
    presenter.show_instructions(INSTR_SCENE)
    show_one_block(scene_image_sequences[0], fixation_time_sequences[1])
    presenter.show_instructions(INSTR_FACE)
    show_one_block(face_image_sequences[1], fixation_time_sequences[2])
    presenter.show_instructions(INSTR_SCENE)
    show_one_block(scene_image_sequences[1], fixation_time_sequences[3])

    # end of experiment
    presenter.show_instructions(INSTR_END)
    infoLogger.info('End of experiment')
