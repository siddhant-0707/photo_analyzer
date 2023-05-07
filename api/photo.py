import logging
from flask_restful import Resource

logger = logging.getLogger(__name__)


class Photo(Resource):
    def __init__(self, photo_bucket):
        self.photo_bucket = photo_bucket

    def get(self, photo_key):
        url = self.photo_bucket.meta.client.generate_presigned_url(
            ClientMethod='get_object',
            Params={'Bucket': self.photo_bucket.name, 'Key': photo_key})
        logger.info("Got presigned URL: %s", url)
        return {'name': photo_key, 'url': url}, 200
