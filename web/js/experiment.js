'use strict';

(function () {
    var hookWindow = false;

    // parse id in URL
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
        alert('Invalid user info.');
        $('body').empty();
        return;
    }
    if (userId.length < 5 || userId.length > 8 || !userId.startsWith('ucla') || isNaN(sid) || gender.length != 1) {
        alert('Invalid user info.');
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
        // TODO
    };
    // firebase.initializeApp(config);
    // firebase.auth().signInAnonymously().catch(function(error) {
    //     alert('Error: cannot connect to Firebase. Please find the experimenter.\n' + 
    //           error.code + ': ' + error.message);
    // });
    // firebase.auth().onAuthStateChanged(function(user) {
    //     if (user) {
    //         // User is signed in.
    //         firebaseUid = user.uid;
    //         console.log('Signed in as ' + firebaseUid);
    //         firebase.database().ref(userId + '/').set({ firebase_uid: firebaseUid });
    //     }
    // });

    // construct timeline
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
            trial_duration: 1000, // TODO
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

    var timeline = [beginningInstr];
    add_block_to_timeline('face', 0);
    add_block_to_timeline('scene', 0);
    add_block_to_timeline('face', 1);
    add_block_to_timeline('scene', 1);
    console.log(FIXATION_TIMES.length);

    function startExperiment() {
        hookWindow = true;
        // Start the experiment
        jsPsych.init({
            display_element: 'exp-container',
            timeline: timeline
        });
        startTime = new Date();
    }

    // Load images and then start experiment
    var startTime = null, endTime = null;
    startExperiment();
    document.getElementById('exp-container').focus();
})();
