/**
 * Created by daniel on 05.07.15.
 */


module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],
        files: [
            'test/*.js',
            'js/SunPositionCalc.js',
            'js/suncalc.js'
        ]
    });
};