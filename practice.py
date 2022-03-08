import pyaudio
import wave
import torchaudio
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor
import  librosa
import torch


#code for sound recording
############################################################################
# CHUNK = 1024
# FORMAT = pyaudio.paInt16
# CHANNELS = 1
# RATE = 16000
# RECORD_SECONDS = 5
# WAVE_OUTPUT_FILENAME = "output.wav"

# p = pyaudio.PyAudio()

# stream = p.open(format=FORMAT,
#                 channels=CHANNELS,
#                 rate=RATE,
#                 input=True,
#                 frames_per_buffer=CHUNK)

# print("* recording")

# frames = []

# for i in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
#     data = stream.read(CHUNK)
#     frames.append(data)

# print("* done recording")

# stream.stop_stream()
# stream.close()
# p.terminate()

# wf = wave.open(WAVE_OUTPUT_FILENAME, 'wb')
# wf.setnchannels(CHANNELS)
# wf.setsampwidth(p.get_sample_size(FORMAT))
# wf.setframerate(RATE)
# wf.writeframes(b''.join(frames))
# wf.close()


#code for model prediction
#################################################################

# model = Wav2Vec2ForCTC.from_pretrained("./models/trained/checkpoint-5000").cuda()
model = Wav2Vec2ForCTC.from_pretrained("./models/trained/checkpoint-5000")
processor = Wav2Vec2Processor.from_pretrained("./models")

speech_array, sampling_rate = torchaudio.load("./Recording.wav")


#converting normal recording stereo , 48Khz to mono, 16Khz
speech = speech_array.squeeze().numpy()
resampled_speech_array = torchaudio.functional.resample(speech_array, 48000, 16000)
speech = speech_array.squeeze().numpy()
np_resampled_speech_array = resampled_speech_array.cpu().detach().numpy()
resampled_speech_mono_array = librosa.to_mono(np_resampled_speech_array)
resampled_speech_array = torch.from_numpy(resampled_speech_mono_array)
speech = resampled_speech_array


inputs = processor(speech, sampling_rate=16_000, return_tensors="pt", padding=True)

with torch.no_grad():
  # logits = model(inputs.input_values.to("cuda"), attention_mask=inputs.attention_mask.to("cuda")).logits
    logits = model(inputs.input_values.to("cpu"), attention_mask=inputs.attention_mask.to("cpu")).logits
pred_ids = torch.argmax(logits, dim=-1)
   # print(pred_ids)
pred_strings = processor.batch_decode(pred_ids)
print("Predicted label:",pred_strings)