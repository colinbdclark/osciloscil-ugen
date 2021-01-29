fluid.registerNamespace("flock.test");

flock.test.pitchScalingOscBenchmark = function () {
    sheep.test([
        {
            name: "flock.ugen.osc",
            numReps: 1000000,
            setup: function () {
                return flock.synth({
                    ugen: "flock.ugen.sinOsc",
                    tableSize: 8192,
                    freq: 440,
                    mul: 1.0
                });
            },
            test: flock.evaluate.synth
        },
        {
            name: "flock.ugen.scalingOsc",
            numReps: 1000000,
            setup: function () {
                return flock.synth({
                    ugen: "flock.ugen.scalingOsc",
                    table: flock.fillTable(8192, flock.tableGenerators.sin),
                    tableSize: 8192,
                    freq: 440,
                    mul: 1.0
                });
            },
            test: flock.evaluate.synth
        }
    ])
};
