// times (in ms)
var IMG_TIME = 500;
var INITIAL_FIXATION_TIME = 3000;
// images
var FACE_DIR = '../valence_img/faces/';
var SCENE_DIR = '../valence_img/scenes/';
var FACE_IMGS = [['28M_AN_C.jpg', 'AM01HAS.jpg', '08F_SP_O.jpg', '27M_SP_O.jpg', '36M_AN_C.jpg', 'AF13SUS.jpg', '08F_AN_C.jpg', 'AM12SUS.jpg', '06F_SP_O.jpg', '03F_HA_O.jpg', 'AM10ANS.jpg', '23M_SP_O.jpg', '24M_SP_O.jpg', 'AF03SUS.jpg', '24M_HA_O.jpg', 'AM28ANS.jpg', '37M_HA_O.jpg', 'AM34SUS.jpg', '08F_HA_O.jpg', '36M_SP_O.jpg', 'AF07ANS.jpg', 'AF34SUS.jpg', 'AF06HAS.jpg', 'AM35SUS.jpg'],
                 ['28M_HA_O.jpg', '09F_SP_O.jpg', '01F_AN_C.jpg', 'AF14ANS.jpg', '20M_SP_O.jpg', 'AF01SUS.jpg', '36M_HA_O.jpg', '01F_HA_O.jpg', 'AF30SUS.jpg', 'AM06SUS.jpg', '01F_SP_O.jpg', '09F_AN_C.jpg', '07F_HA_O.jpg', '20M_AN_C.jpg', '07F_SP_O.jpg', '28M_SP_O.jpg', '37M_AN_C.jpg', 'AF02SUS.jpg', 'AF08HAS.jpg', 'AM18SUS.jpg', 'AM14HAS.jpg', '02F_SP_O.jpg', '03F_AN_C.jpg', 'AM13SUS.jpg']];
var SCENE_IMGS = [['N9185.jpg', 'A2339.jpg', 'A3211.jpg', 'P1460.jpg', 'N9830.jpg', 'P1710.jpg', 'A4598.jpg', 'P2347.jpg', 'P8380.jpg', 'A7460.jpg', 'N9163.jpg', 'A1030.jpg', 'A2485.jpg', 'A3310.jpg', 'A3360.jpg', 'N9910.jpg', 'P2091.jpg', 'A6837.jpg', 'P2550.jpg', 'A8060.jpg', 'N9220.jpg', 'A8178.jpg', 'N2717.jpg', 'A2480.jpg'],
                  ['N9295.jpg', 'N9600.jpg', 'A2704.jpg', 'P5825.jpg', 'A7570.jpg', 'A8010.jpg', 'P1440.jpg', 'A8501.jpg', 'A4233.jpg', 'A1560.jpg', 'P2057.jpg', 'P7502.jpg', 'P1441.jpg', 'A2688.jpg', 'A7430.jpg', 'N9050.jpg', 'P2340.jpg', 'A7590.jpg', 'N9424.jpg', 'A1303.jpg', 'N7380.jpg', 'A7620.jpg', 'N9421.jpg', 'A8466.jpg']];

// fixation times in seconds (fixation_times.csv reversed)
var FIXATION_TIMES = [
  5.8, 5.8, 3.8, 1.8, 1.8, 3.8, 1.8, 3.8, 3.8, 5.8, 1.8, 5.8, 3.8, 3.8, 3.8, 1.8, 3.8, 5.8, 3.8, 3.8, 1.8, 3.8, 1.8, 5.8,
  1.8, 1.8, 3.8, 1.8, 3.8, 1.8, 3.8, 1.8, 5.8, 3.8, 1.8, 5.8, 5.8, 1.8, 3.8, 3.8, 5.8, 5.8, 1.8, 5.8, 1.8, 3.8, 5.8, 1.8,
  3.8, 1.8, 3.8, 5.8, 5.8, 1.8, 5.8, 3.8, 3.8, 3.8, 5.8, 3.8, 5.8, 1.8, 5.8, 3.8, 1.8, 1.8, 5.8, 1.8, 3.8, 3.8, 3.8, 3.8,
  1.8, 1.8, 3.8, 1.8, 5.8, 1.8, 1.8, 1.8, 1.8, 5.8, 5.8, 1.8, 3.8, 5.8, 1.8, 5.8, 3.8, 1.8, 5.8, 3.8, 5.8, 1.8, 1.8, 3.8
];

// instructions
var INSTR_FACE = '<p>' +
                   'In the next block, you will view pictures of FACES. In each of the following trials, ' +
                   'please rate the image as positive or negative as quickly and accurately as possible. ' +
                   'Press K for a positive image and D for a negative image.' + '<br/><br/>' +
                   'Press space when you are ready to see the first image.' +
                 '</p>';
var INSTR_SCENE = '<p>' +
                    'In the next block, you will view pictures of SCENES. In each of the following trials, ' +
                    'please rate the image as positive or negative as quickly and accurately as possible. ' +
                    'Press K for a positive image and D for a negative image.' + '<br/><br/>' +
                    'Press space when you are ready to see the first image.' +
                  '</p>';
var INSTR_END = '<p class="jspsych-display-element">' +
                  'This is the end of the experiment. Your responses have been recorded.' + '<br/><br/>' +
                  'Thank you for participating!' +
                '</p>';
var INSTR_END_ERR = '<p class="jspsych-display-element">' +
                      'You have completed the experiment, but we were unable to record your responses.' + '<br/><br/>' +
                      'Please send the downloaded data file to the experimenter through email. Thank you very much!' +
                    '</p>';

var REPEAT_ALERT = 'It looks like you have done this experiment before. If for some reason you have to do it again, ' +
                   'please let the experimenter know.'
