# Notes

## Links

[HTMLMediaElement API](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement)

[Web audio concepts and usage](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

[fs in Electron](https://stackoverflow.com/questions/43722450/electron-function-to-read-a-local-file-fs-not-reading)

## Web Audio API

### [AudioParam](https://developer.mozilla.org/en-US/docs/Web/API/AudioParam)

There are two kinds of AudioParam, a-rate and k-rate parameters:

An a-rate AudioParam takes the current audio parameter value for each sample frame of the audio signal.
A k-rate AudioParam uses the same initial audio parameter value for the whole block processed, that is 128 sample frames.
Each [AudioNode](https://developer.mozilla.org/en-US/docs/Web/API/AudioNode) defines which of its parameters are a-rate or k-rate in the spec.
