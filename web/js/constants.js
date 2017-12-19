// times
var IMG_TIME = 500;  // in ms
var INITIAL_FIXATION_TIME = 3000;
// images
var FACE_IMGS = [['../valence_img/faces/03F_AN_C.jpg'],
                 ['../valence_img/faces/07F_SP_O.jpg']];
var SCENE_IMGS = [['../valence_img/scenes/A1560.jpg'],
                  ['../valence_img/scenes/A4233.jpg']];
var allImgs = FACE_IMGS[0].concat(FACE_IMGS[1]).concat(SCENE_IMGS[0]).concat(SCENE_IMGS[1]);

// fixation times in seconds (fixation_times.csv reversed)
var FIXATION_TIMES = [
    5.8, 5.8, 3.8, 1.8, 1.8, 3.8, 1.8, 3.8, 3.8, 5.8, 1.8, 5.8, 3.8, 3.8, 3.8, 1.8, 3.8, 5.8, 3.8, 3.8, 1.8, 3.8, 1.8, 5.8,
    1.8, 1.8, 3.8, 1.8, 3.8, 1.8, 3.8, 1.8, 5.8, 3.8, 1.8, 5.8, 5.8, 1.8, 3.8, 3.8, 5.8, 5.8, 1.8, 5.8, 1.8, 3.8, 5.8, 1.8,
    3.8, 1.8, 3.8, 5.8, 5.8, 1.8, 5.8, 3.8, 3.8, 3.8, 5.8, 3.8, 5.8, 1.8, 5.8, 3.8, 1.8, 1.8, 5.8, 1.8, 3.8, 3.8, 3.8, 3.8,
    1.8, 1.8, 3.8, 1.8, 5.8, 1.8, 1.8, 1.8, 1.8, 5.8, 5.8, 1.8, 3.8, 5.8, 1.8, 5.8, 3.8, 1.8, 5.8, 3.8, 5.8, 1.8, 1.8, 3.8
];

// instructions
var INSTR_BEGIN = '<p>' +
                      'Welcome to the experiment!' + '<br/><br/>' +
                      'This is a study about how people react emotionally to images.' + '<br/>' +
                      'You will view four sets of 24 images of either faces or scenes. ' +
                      'You will also be asked to rate how that image made you feel.' + '<br/><br/>' +
                      'Press space to continue.'
                  '</p>';
var INSTR_FACE = '<p>' +
                     'In the next block, you will view pictures of faces. In each of the following trials, ' +
                     'please rate the image as positive or negative as quickly and accurately as possible. ' +
                     'Press "K" for a positive image and "D" for a negative image.' + '<br/><br/>' +
                     'Press space when you are ready to see the first image.' +
                 '</p>';
var INSTR_SCENE = '<p>' +
                      'In the next block, you will view pictures of scenes. In each of the following trials, ' +
                      'please rate the image as positive or negative as quickly and accurately as possible. ' +
                      'Press "K" for a positive image and "D" for a negative image.' + '<br/><br/>' +
                      'Press space when you are ready to see the first image.' +
                  '</p>';
var INSTR_END = '<p>' +
                    'This is the end of the experiment.' + '<br/><br/>' +
                    'Thank you for participating!' +
                '</p>';

// instruction pages
var beginningInstr = {
    type: 'instructions',
    pages: [INSTR_BEGIN],
    key_forward: 'space',
    allow_backward: false
};
var faceInstr = {
    type: 'instructions',
    pages: [INSTR_FACE],
    key_forward: 'space',
    allow_backward: false
};
var sceneInstr = {
    type: 'instructions',
    pages: [INSTR_SCENE],
    key_forward: 'space',
    allow_backward: false
};
