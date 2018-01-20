# Numbers
NUM_TRIALS_PER_BLOCK = 24
# Paths
IMG_FOLDER_FACES = '../valence_img/faces/'
IMG_FOLDER_SCENES = '../valence_img/scenes/'
PRAC_IMG_FOLDER = '../prac_img/'
DATA_FOLDER = 'data/'
LOG_FOLDER = 'log/'
# Times
INITIAL_FIX_TIME = 4
IMG_TIME = 0.5
PRAC_FIX_TIME = 1.8
PRAC_FEEDBACK_TIME = 3.5
# Practice trials
PRAC_ANSWERS = ['d', 'k', 'd', 'd', 'k', 'k']
# Instructions
INSTR_BEGIN = ['Welcome to the experiment!',
               'This is a study about how people react emotionally to images. '
               'You will view four sets of 24 images of either faces or scenes, '
               'and you will be asked to rate the images as positive or negative.']
INSTR_PRAC = 'Before the experiment starts, you will first go through a few practice trials. ' \
             'In each of the following trials, please rate the image as positive or negative ' \
             'as quickly and accurately as possible.\n\n' \
             'Press K for a positive image and D for a negative image.\n\n' \
             'You will see feedback in these practice trials, but not later in the experiment. ' \
             'Now, press space when you are ready to see the first image.'
PRAC_FEEDBACK = '{}!\nThis image is {}.\n\nYour reaction time was {}ms.'
PRAC_FEEDBACK_NO_RESP = 'Please respond faster.\n\nPress K for a positive image or D for a negative image.'
INSTR_FACE = 'Welcome to a new block of pictures of faces. In each of the following trials, ' \
             'please rate each image as positive or negative as quickly and accurately as possible. ' \
             'Press key "K" for a positive image and key "D" for a negative image. \n\nPress space when ' \
             'you are ready to see the first image.'
INSTR_SCENE = 'Welcome to a new block of pictures of scenes. In each of the following trials, ' \
              'please rate each image as positive or negative as quickly and accurately as possible. ' \
              'Press key "K" for a positive image and key "D" for a negative image. \n\nPress space when y' \
              'ou are ready to see the first image.'
INSTR_END = 'This is the end of the experiment. Thank you for participating!'
