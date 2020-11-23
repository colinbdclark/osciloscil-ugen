flock.ugen.oscilOscil = function (inputs, output, options) {
    var that = flock.ugen.scalingOsc(inputs, output, options);

    that.init = function () {
        var waves = fluid.makeArray(that.options.waves),
            freqScale = waves.length > 0 ? 1 / waves.length : 1.0;

        that.inputs.table = flock.ugen.oscilOscil.generateTable(that, waves);
        flock.fillBufferWithValue(that.inputs.freqScale.output, freqScale);
        that.onInputChanged();
    };

    that.init();
    return that;
};

flock.ugen.oscilOscil.generateTable = function (that, waves) {
    var subTableSize = that.options.tableSize,
        tableSize = subTableSize * waves.length,
        subTable = new Float32Array(subTableSize),
        table = new Float32Array(tableSize);

    fluid.each(waves, function (wave, waveIdx) {
        var tableGenerator = flock.tableGenerators[wave] || flock.silence;
        var subTable = flock.fillTable(subTableSize, tableGenerator);
        table.set(subTable, subTableSize * waveIdx);
    });

    return table;
};

flock.ugenDefaults("flock.ugen.oscilOscil", {
    rate: "audio",
    inputs: {
        freq: 440,
        phase: 0.0,
        freqScale: 0.5,
        table: [],
        mul: null,
        add: null
    },
    ugenOptions: {
        waves: ["saw", "sin"],
        interpolation: "linear",
        model: {
            phase: 0.0,
            unscaledValue: 0.0,
            value: 0.0
        },
        strideInputs: [
            "freq",
            "phase",
            "freqScale"
        ],
        tableSize: 8192
    }
});
