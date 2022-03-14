from django.urls import path
from rest_framework import routers
from .api import NepaliTextCollectionViewSet, SpeechToTextViewSet,SpeechToTextViewSet2, SpeechViewSet, SpeakerViewSet, NepaliTextViewSet, SnippetListenViewSet, SnippetRecordViewSet, SnippetVerifiedViewSet

router = routers.DefaultRouter()
router.register('api/speech', SpeechViewSet, 'speech')
router.register('api/speaker', SpeakerViewSet, 'speaker')
router.register('api/nepali_text', NepaliTextViewSet, 'nepali_text')
router.register('api/nepalitext_collection', NepaliTextCollectionViewSet, 'nepalitext_collection')
router.register('api/snippet_listen', SnippetListenViewSet, 'snippet')
router.register('api/snippet_record', SnippetRecordViewSet, 'snippet_record')
# router.register('api/snippet_verified', SnippetVerifiedViewSet, 'snippet_verified')
router.register('api/speech_to_text', SpeechToTextViewSet, 'speech_to_text')
router.register('api/speech_to_text2', SpeechToTextViewSet2, 'speech_to_text')
urlpatterns = router.urls
urlpatterns += [path('api/snippet_verified/', SnippetVerifiedViewSet.as_view())]
