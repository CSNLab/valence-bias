'use strict';

(function () {
    var hookWindow = false;

    // process image names
    for (var i = 0; i < FACE_IMGS[0].length; ++i) {
      FACE_IMGS[0][i] = FACE_DIR + FACE_IMGS[0][i];
      FACE_IMGS[1][i] = FACE_DIR + FACE_IMGS[1][i];
    }
    for (var i = 0; i < SCENE_IMGS[0].length; ++i) {
      SCENE_IMGS[0][i] = SCENE_DIR + SCENE_IMGS[0][i];
      SCENE_IMGS[1][i] = SCENE_DIR + SCENE_IMGS[1][i];
    }
    var allImgs = FACE_IMGS[0].concat(FACE_IMGS[1]).concat(SCENE_IMGS[0]).concat(SCENE_IMGS[1]);

    // response keys
    var responseKeys = ['d','k'];
    var keyMapping = {'-1': 'none', '68': 'd', '75': 'k'};

    // parse user info in URL
    var userId = '',
        sid = null,
        gender = null;
    var parameters = window.location.search.substring(1);

    if (parameters.length > 11 && parameters.length < 15) {
        var parts = parameters.split(/[&=]/);
        userId = parts[1];
        sid = userId.substring(4);
        gender = parts[3];
    } else {
        alert('Invalid user info');
        $('body').empty();
        cancelFullScreen(document.body);
        return;
    }
    if (userId == 'short') {
        FACE_IMGS[0] = FACE_IMGS[0].slice(0, 2);
        FACE_IMGS[1] = FACE_IMGS[1].slice(0, 2);
        SCENE_IMGS[0] = FACE_IMGS[0].slice(0, 2);
        SCENE_IMGS[1] = FACE_IMGS[1].slice(0, 2);
    }
    else if (userId.length < 5 || userId.length > 8 || !userId.startsWith('ucla') || 
        isNaN(sid) || gender.length != 1) {
        alert('Invalid user info');
        cancelFullScreen(document.body);
        $('body').empty();
        return;
    }
    sid = parseInt(sid);

    // prevent closing window
    window.onbeforeunload = function() {
        if (hookWindow) {
            return 'Do you want to leave this page? Your progress will not be saved.';
        }
    }

    // initialize firebase
    var firebaseUid = null;
    var config = {
        apiKey: "AIzaSyByDfAISXKXywYhmEFPq1chpVyVeDneYMA",
        authDomain: "valence-bias.firebaseapp.com",
        databaseURL: "https://valence-bias.firebaseio.com",
        projectId: "valence-bias",
        storageBucket: "valence-bias.appspot.com",
        messagingSenderId: "278302107297"
    };
    firebase.initializeApp(config);
    firebase.auth().signInAnonymously().catch(function(error) {
        // $('body').empty();
        alert('Error: Cannot connect to Firebase. Please check your internet connection.\n\n' + 
              error.code + ': ' + error.message);
        firebase_error = true;
    });
    firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
            return;
        }
        // User is signed in
        firebaseUid = user.uid;
        console.log('Signed in as ' + firebaseUid);

        firebase.database().ref(userId + '/sid').once('value').then(function(snapshot) {
            if (snapshot.val()) {  // user exists
                if (userId != 'short') {
                    alert(REPEAT_ALERT);
                }
            } else {  // user does not exist
                firebase.database().ref(userId + '/').set({
                    firebase_uid: firebaseUid,
                    gender: gender,
                    sid: sid || 'none'
                });
            }
        });
    });

    // data handlers
    function after_exp_finish() {
        cancelFullScreen(document.body);
        if (firebase_error) {
            $('body').append(INSTR_END_ERR);
            // TODO download data file
        }
        else {
            $('body').append(INSTR_END);
            firebase.auth().currentUser.delete();
        }
        hookWindow = false;
    }

    function on_exp_finish() {
        var endTime = new Date();
        var data = {
            start_time: startTime,
            end_time: endTime,
            duration: endTime.getTime() - startTime.getTime()
        };
        var updates = {};
        updates[userId + '/' + startTime + '/start_time'] = startTime.getTime();
        updates[userId + '/' + startTime + '/end_time'] = endTime.getTime();
        updates[userId + '/' + startTime + '/duration'] = endTime.getTime() - startTime.getTime();
        firebase.database().ref().update(updates).then(function() {
            after_exp_finish();
        }, function() {
            firebase_error = true;
            after_exp_finish();
        });
    }

    function on_trial_finish(data) {
        if (data.trial_type == 'html-keyboard-response') {  // first "+" of the block
            return;
        }
        else if (data.trial_type == 'instructions') {
            data = {
                trial_type: 'instructions',
                trial_index: data.trial_index,
                view_time: data.rt
            }
        }
        else if (data.trial_type == 'image-keyboard-response') {
            data = {
                trial_type: 'image-response',
                trial_index: data.trial_index,
                stimulus: data['stimulus'].substring(15),
                key_pressed: keyMapping[data.key_press],
                rt: data.rt
            }
        }

        // send to firebase
        var userRef = firebase.database().ref(userId + '/' + startTime + '/' + data.trial_index);
        userRef.set(data).then(function() {
            // success
            if (data['trial_index'] == timeline.length - 1) {  // last trial
                on_exp_finish();
            }
        }, function() {
            // failed
            firebase_error = true;
        });
    }

    // construct timeline
    // instruction pages
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

    function add_block_to_timeline(block_name, index) {
        var imgs;
        // instruction
        if (block_name == 'face') {
            timeline.push(faceInstr);
            imgs = FACE_IMGS[index];
        } else if (block_name == 'scene') {
            timeline.push(sceneInstr);
            imgs = SCENE_IMGS[index];
        }
        else {
            throw 'Error: Wrong type of block.';
        }
        // initial fixation
        timeline.push({
            type: 'html-keyboard-response',
            stimulus: '<p>+</p>',
            choices: [],
            trial_duration: INITIAL_FIXATION_TIME,
            response_ends_trial: false
        });
        for (var i = 0; i < imgs.length; ++i) {
            // image
            timeline.push({
                type: 'image-keyboard-response',
                stimulus: imgs[i],
                choices: ['d','k'],
                stimulus_duration: IMG_TIME,
                trial_duration: IMG_TIME + parseFloat(FIXATION_TIMES.pop()) * 1000,
                response_ends_trial: false
            });
        }
    }

    var timeline = [];
    add_block_to_timeline('face', 0);
    add_block_to_timeline('scene', 0);
    add_block_to_timeline('face', 1);
    add_block_to_timeline('scene', 1);

    function focus() {
        document.getElementById('exp-container').focus();
    }

    function startExperiment() {
        hookWindow = true;
        // Start the experiment
        jsPsych.init({
            display_element: 'exp-container',
            timeline: timeline,
            on_trial_start: focus,
            on_trial_finish: on_trial_finish
        });
        startTime = new Date();
    }

    // Load images and then start experiment
    var startTime = null;
    var firebase_error = false;
    startExperiment();
    focus();
})();
