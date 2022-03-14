from django.apps import AppConfig

from django.conf import settings

from pathlib import Path
import os

from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor



class VoicelinesConfig(AppConfig):
    name = 'voicelines'
    
    verifiedVoicelinePath = os.path.join(settings.MEDIA_ROOT, 'verifiedVoicelines')
    mediapath = os.path.join(settings.MEDIA_ROOT,'')
    
    processor_path = os.path.join(Path(__file__).resolve().parent.parent, 'models')
    model_path = os.path.join(settings.MODELS, 'trained/checkpoint-5000')
    
    model_ii_path = os.path.join(Path(__file__).resolve().parent.parent, 'models2')
    
    model = Wav2Vec2ForCTC.from_pretrained(model_path)
    processor = Wav2Vec2Processor.from_pretrained(processor_path)
    
    
