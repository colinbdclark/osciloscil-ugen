fluid.defaults("flock.demo.oscilOscil", {
    gradeNames: "fluid.viewComponent",

    components: {
        enviro: {
            type: "flock.enviro"
        },

        playButton: {
            type: "flock.ui.enviroPlayButton",
            container: "{oscilOscil}.container"
        },

        synth: {
            type: "flock.demo.oscilOscil.synth"
        },
        nexusui: {
            type: "flock.demo.oscilOscil.nexusui"
        }
    }
});

fluid.defaults("flock.demo.oscilOscil.synth", {
    gradeNames: "flock.synth",

    synthDef: {
        id: "oscosc",
        ugen: "flock.ugen.oscilOscil",
        options: {
            waves: ["saw", "sin", "hann"]
        },
        freq: {
            ugen: "flock.ugen.lfNoise",
            freq: 1,
            mul: 60,
            add: 120
        },
        mul: {
            ugen: "flock.ugen.asr",
            attack: 0.25,
            sustain: 0.5,
            release: 0.25,
            gate: {
                ugen: "flock.ugen.impulse",
                rate: "control",
                freq: 1,
                phase: 1.0
            }
        }
    }
});


fluid.defaults("flock.demo.oscilOscil.nexusui", {
    gradeNames: "fluid.component",
    listeners: {
        onCreate: {
            func: function(){
                let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
                let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                width -=15;
                let oscilloscope = new Nexus.Oscilloscope('#scope', {size: [width, 100]});
                let spectrogram = new Nexus.Spectrogram('#spectogram', {size: [width, 100]})
                oscilloscope.connect(flock.environment.audioSystem.nativeNodeManager.outputNode);
                spectrogram.connect(flock.environment.audioSystem.nativeNodeManager.outputNode);
            }
        }
    }
});
