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
