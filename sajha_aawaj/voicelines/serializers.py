from rest_framework import serializers
from .models import Speech, Speaker, Snippet, NepaliText, NepaliTextCollection, SpeechToText
from django.contrib.auth.models import User


class SpeechSerializer(serializers.ModelSerializer):
       class Meta:
        model = Speech
        fields =('id','audiofile','speaker')
    
    
class SpeakerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Speaker
        fields =('id','age','gender')
    
    
class SnippetSerializer(serializers.ModelSerializer):  
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        try:
            if self.context['request'].method in ['GET']:
                self.fields['speech'] = serializers.SerializerMethodField()
                self.fields['text'] = serializers.SerializerMethodField()
        except KeyError:
            pass
    
    class Meta:
        model = Snippet
        fields = ('id','is_rejected','is_recorded','speech','text')
        extra_kwargs = {'is_rejected': {'write_only': True}, 'is_recorded': {'read_only': True}}
        
    def get_speech(self, obj):
        return SpeechSerializer(obj.speech).data
    
    def get_text(self, obj):
         return NepaliTextSerializer(obj.text).data
    
class NepaliTextSerializer(serializers.ModelSerializer):
    class Meta:
        model = NepaliText
        fields = '__all__'
        
        
class NepaliTextCollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = NepaliTextCollection
        fields = '__all__'
        
class SpeechToTextSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpeechToText
        fields = '__all__'
        