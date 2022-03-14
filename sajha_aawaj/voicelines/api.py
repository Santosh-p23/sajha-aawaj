from encodings import utf_8
from http import HTTPStatus
from wsgiref.util import FileWrapper
from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response
from rest_framework import status
from .models import NepaliTextCollection, Speech, Speaker, NepaliText, Snippet, SpeechToText
from .serializers import SpeechSerializer, SpeakerSerializer, NepaliTextSerializer, SnippetSerializer, NepaliTextCollectionSerializer, SpeechToTextSerializer
from rest_framework import filters
from rest_framework.parsers import FormParser, MultiPartParser
from django.contrib.auth.models import User

from rest_framework.pagination import PageNumberPagination
from django.conf import settings
from django.http import HttpResponse

import torchaudio
import  librosa
import torch
import shutil

from .apps import VoicelinesConfig

import unicodecsv as csv

from django.http import StreamingHttpResponse

from models2.infer import speechToText




class Echo:
    def write(self, value):
        return value



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
            
            newpath = shutil.copy(snippet.speech.audiofile.path, VoicelinesConfig.verifiedVoicelinePath)            
            # print('newpath', newpath)
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
            
            
            
# class SnippetVerifiedViewSet(viewsets.ModelViewSet):
#     queryset = Snippet.objects.filter(is_recorded=True).filter(is_verified = True)
#     permission_classes = [permissions.AllowAny]
    
#     serializer_class = SnippetSerializer
    
    
class SnippetVerifiedViewSet(generics.GenericAPIView):
    
    def get(self,request):
        queryset = Snippet.objects.filter(is_recorded=True).filter(is_verified = True)
        
        dataset =[]
        for snip in queryset:
            dataset.append([snip.text.text, snip.speech.audiofile.name])
            
        print(dataset)
        echo_buffer = Echo()
        csv_writer = csv.writer(echo_buffer)
        
        fields = ['text', 'audiofile']
        with open(VoicelinesConfig.verifiedVoicelinePath+'/data.csv','wb') as f:
            write = csv.writer(f)
            write.writerow(fields)
            write.writerows(dataset)
        
        shutil.make_archive(VoicelinesConfig.verifiedVoicelinePath,'zip',VoicelinesConfig.verifiedVoicelinePath)
        rows = (csv_writer.writerow(row) for row in dataset)
        # response = StreamingHttpResponse(rows, content_type="text/csv")
        # response["Content-Disposition"] = 'attachment; filename="speech_dataset.csv"'
        
        zipname = VoicelinesConfig.mediapath+'verifiedVoicelines.zip'
        wrapper = FileWrapper(open(zipname, 'rb'))
        response = HttpResponse(wrapper, content_type='application/zip')
        response['Content-Disposition'] = 'attachment; filename="speech_dataset.zip"'
        return response
        
         
class SpeechToTextViewSet(viewsets.ModelViewSet):
    queryset = Speech.objects.all()
    permission_classes = [permissions.AllowAny]
    
    serializer_class = SpeechSerializer
    
    
class NepaliTextCollectionViewSet(viewsets.ModelViewSet):
    queryset = NepaliTextCollection.objects.all()
    permission_classes =[permissions.IsAuthenticated]
    
    serializer_class = NepaliTextCollectionSerializer
    
    
    def perform_create(self,serializer):
        text_file = serializer.save()
        # read the file and create text objects for the lines
        print(text_file.text_file.path)
        
        with open(text_file.text_file.path, encoding ='utf8' ) as f:
            lines = f.readlines()
            print(lines[0].strip())
            
            # for line in f:
            #     print(line.strip())

        for line in lines:
            text = NepaliText.objects.create(text = line.strip())
            Snippet.objects.create(text = text)
        
        
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
                
      
      
class SpeechToTextViewSet2(viewsets.ModelViewSet):
    queryset = SpeechToText.objects.all()
    permission_classes = [ permissions.AllowAny]
    parser_classes = (FormParser, MultiPartParser,)
    
    serializer_class = SpeechToTextSerializer
    
    
    def perform_create(self, serializer):
        snippet = serializer.save()
        hyp  =speechToText(snippet.audiofile.path)
        print(hyp)
        snippet.text = hyp
        snippet.save()
        
        