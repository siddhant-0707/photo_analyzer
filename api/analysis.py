import logging
from botocore.exceptions import ClientError
from flask_restful import Resource

logger = logging.getLogger(__name__)


class Analysis(Resource):
    def __init__(self, photo_bucket_name, rekognition_client):
        self.photo_bucket_name = photo_bucket_name
        self.rekognition_client = rekognition_client

    def get(self, photo_key):
        labels = []
        result = 200
        response = self.rekognition_client.detect_labels(
            Image={'S3Object': {'Bucket': self.photo_bucket_name, 'Name': photo_key}})
        labels = response.get('Labels', [])
        logger.info("Found %s labels in %s.", len(response['Labels']), photo_key)
        
        return labels, result
