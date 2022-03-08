
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework import status
from .models import NepaliTextCollection, Speech, Speaker, NepaliText, Snippet, SpeechToText
from .serializers import SpeechSerializer, SpeakerSerializer, NepaliTextSerializer, SnippetSerializer, NepaliTextCollectionSerializer, SpeechToTextSerializer
from rest_framework import filters
from rest_framework.parsers import FormParser, MultiPartParser
from django.contrib.auth.models import User

from rest_framework.pagination import PageNumberPagination


import torchaudio
import  librosa
import torch

from .apps import VoicelinesConfig



class StandardResultsSetPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100
    page_query_param = 'p'


class SpeechViewSet(viewsets.ModelViewSet):
    queryset = Speech.objects.all()
    parser_classes = (FormParser, MultiPartParser,)
    permission_classes = [permissions.AllowAny]
    
    serializer_class = SpeechSerializer
    
    def perform_create(self, serializer, format =None):
        
        if self.request.data.get('audiofile') is not None:
            audiofile = self.request.data.get('audiofile')
            speaker = Speaker.objects.get(id = self.request.data.get('speaker'))
            serializer.save(audiofile = audiofile, speaker = speaker)
    
    
class SpeakerViewSet(viewsets.ModelViewSet):
    queryset = Speaker.objects.all()
    permission_classes = [permissions.AllowAny]
    
    serializer_class = SpeakerSerializer
    
    
    
class NepaliTextViewSet(viewsets.ModelViewSet):
    queryset = NepaliText.objects.all().order_by('?')
    permission_classes = [permissions.AllowAny]
    
    serializer_class = NepaliTextSerializer
    
    def perform_create(self,serializer):
        text = serializer.save()
        Snippet.objects.create(text = text)
    


class SnippetListenViewSet(viewsets.ModelViewSet):
    queryset = Snippet.objects.filter(is_recorded = True).filter(is_verified = False).order_by('?')
    permission_classes = [permissions.AllowAny]
    
    serializer_class = SnippetSerializer
    pagination_class = StandardResultsSetPagination
    
    
    def perform_update(self, serializer):
        snippet = serializer.save()
        
        if(snippet.is_rejected == True):
            snippet.verification_count = snippet.verification_count - 1
            snippet.save()
        
        else:
            snippet.verification_count = snippet.verification_count + 1
            snippet.save()
            
        if(snippet.verification_count <=-2):
            snippet.speech = None
            snippet.verification_count = 0
            snippet.is_recorded = False
            snippet.save()
            
            
        elif(snippet.verification_count >=2):
            snippet.is_verified = True
            snippet.save()

        return Response({'status':'Snippet updated'})
       
class SnippetRecordViewSet(viewsets.ModelViewSet):
    queryset = Snippet.objects.filter(is_recorded = False).order_by('?')
    permission_classes = [permissions.AllowAny]
    
    serializer_class = SnippetSerializer
    pagination_class = StandardResultsSetPagination
    
    def perform_update(self, serializer):
        snippet = serializer.save()
        
        if(snippet.speech):
            snippet.is_rejected = False
            snippet.is_recorded = True
      
            serializer.save()
            
            
            
class SnippetVerifiedViewSet(viewsets.ModelViewSet):
    queryset = Snippet.objects.filter(is_recorded=True).filter(is_verified = True)
    permission_classes = [permissions.AllowAny]
    
    serializer_class = SnippetSerializer
    
    
    
class SpeechToTextViewSet(viewsets.ModelViewSet):
    queryset = Speech.objects.all()
    permission_classes = [permissions.AllowAny]
    
    serializer_class = SpeechSerializer
    
    
class NepaliTextCollectionViewSet(viewsets.ModelViewSet):
    queryset = NepaliTextCollection.objects.all()
    permission_classes =[permissions.AllowAny]
    
    serializer_class = NepaliTextCollectionSerializer
    
    
    def perform_create(self,serializer):
        text_file = serializer.save()
        # read the file and create text objects for the lines
        
        
class SpeechToTextViewSet(viewsets.ModelViewSet):
    queryset = SpeechToText.objects.all()
    permission_classes = [ permissions.AllowAny]
    parser_classes = (FormParser, MultiPartParser,)
    
    serializer_class = SpeechToTextSerializer
    
    
    def perform_create(self, serializer):
        snippet = serializer.save()
        
        speech_array, sampling_rate = torchaudio.load(snippet.audiofile.path)


        #converting normal recording stereo , 48Khz to mono, 16Khz
        speech = speech_array.squeeze().numpy()
        resampled_speech_array = torchaudio.functional.resample(speech_array, 48000, 16000)
        speech = speech_array.squeeze().numpy()
        np_resampled_speech_array = resampled_speech_array.cpu().detach().numpy()
        resampled_speech_mono_array = librosa.to_mono(np_resampled_speech_array)
        resampled_speech_array = torch.from_numpy(resampled_speech_mono_array)
        speech = resampled_speech_array
        
        inputs = VoicelinesConfig.processor(speech, sampling_rate=16_000, return_tensors="pt", padding=True)

        with torch.no_grad():
        # logits = model(inputs.input_values.to("cuda"), attention_mask=inputs.attention_mask.to("cuda")).logits
            logits = VoicelinesConfig.model(inputs.input_values.to("cpu"), attention_mask=inputs.attention_mask.to("cpu")).logits
        pred_ids = torch.argmax(logits, dim=-1)
        # print(pred_ids)
        pred_strings = VoicelinesConfig.processor.batch_decode(pred_ids)
        snippet.text = pred_strings[0]
        
        snippet.save()
                
      