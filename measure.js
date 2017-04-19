var results = [];
var presses = [];
var stop = 0;

// The actual measurement loop
//    - loop slices are 5ms
//    - counter values are saved in results, timestamps in presses
function measure_time(seq) {
    var counter = 0;
    if (!stop)
        setTimeout(measure_time, 0, seq + 1);

    var start = performance.now();
    while (performance.now() - start < 5) {
        counter++;
    }
    presses[seq] = performance.now();
    results[seq] = counter;
}

// Register message callback to communicate with main application
//   - "init": pre-allocate arrays for timestamps and measurements
//   - "start": start the measurement
//   - "stop": stop the measurement
self.onmessage = function(event) {
    if (event.data == "stop") {
        stop = 1;
        postMessage(JSON.stringify([results, presses]));
    } else if (event.data == "start") {
        stop = 0;
        setTimeout(measure_time, 0, 0);
    } else if (event.data == "init") {
        for (var i = 0; i < 4000; i++) {
            results[i] = 0;
            presses[i] = 0;
        }
    }
}
