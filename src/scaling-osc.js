// TODO: This is a full copy pasta job from flock.ugen.osc,
// with the addition of a frequency scaling input.
// We should do some benchmarking and determine if this legitmately could
// replace the base flock.ugen.osc implementation, assuming the extra math
// (another input lookup and a multiplication) isn't too costly.
flock.ugen.scalingOsc = function (inputs, output, options) {
    var that = flock.ugen(inputs, output, options);

    that.gen = function (numSamps) {
        var m = that.model,
            inputs = that.inputs,
            freq = inputs.freq.output,
            phaseOffset = inputs.phase.output,
            freqScale = inputs.freqScale.output,
            table = inputs.table,
            tableLen = m.tableLen,
            tableIncHz = m.tableIncHz,
            tableIncRad = m.tableIncRad,
            out = that.output,
            phase = m.phase,
            i,
            j,
            k,
            l,
            idx,
            val;

        for (i = 0, j = 0, k = 0, l = 0; i < numSamps; i++, j += m.strides.phase, k += m.strides.freq, l += m.strides.freqScale) {
            idx = phase + phaseOffset[j] * tableIncRad;
            if (idx >= tableLen) {
                idx -= tableLen;
            } else if (idx < 0) {
                idx += tableLen;
            }
            out[i] = val = that.interpolate(idx, table);
            phase += freq[k] * tableIncHz * freqScale[l];
            if (phase >= tableLen) {
                phase -= tableLen;
            } else if (phase < 0) {
                phase += tableLen;
            }
        }

        m.phase = phase;
        m.unscaledValue = val;
        that.mulAdd(numSamps);
        m.value = flock.ugen.lastOutputValue(numSamps, out);
    };

    that.onInputChanged = function (inputName) {
        flock.ugen.osc.onInputChanged(that);

        // Precalculate table-related values.
        if (!inputName || inputName === "table") {
            var m = that.model,
                table = that.inputs.table;

            if (table.length < 1) {
                table = that.inputs.table = flock.ugen.osc.emptyTable;
            }

            m.tableLen = table.length;
            m.tableIncHz = m.tableLen / m.sampleRate;
            m.tableIncRad =  m.tableLen / flock.TWOPI;
        }
    };

    that.onInputChanged();
    return that;
};

flock.ugen.osc.emptyTable = new Float32Array([0, 0, 0]);

flock.ugen.osc.onInputChanged = function (that) {
    that.calculateStrides();
    flock.onMulAddInputChanged(that);
};

flock.ugenDefaults("flock.ugen.scalingOsc", {
    rate: "audio",
    inputs: {
        freq: 440.0,
        phase: 0.0,
        freqScale: 1.0,
        table: [],
        mul: null,
        add: null
    },
    ugenOptions: {
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
        ]
    },
    tableSize: 8192
});
