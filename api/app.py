import logging
import boto3
from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from analysis import Analysis
from photo_list import PhotoList
from photo import Photo
from report import Report

logger = logging.getLogger(__name__)


def create_app(test_config=None):
    app = Flask(__name__)
    if test_config is None:
        app.config.from_pyfile("config.py", silent=True)
    else:
        app.config.update(test_config)
    bucket_name = app.config.get('BUCKET_NAME')
    if bucket_name is None or bucket_name == 'NEED-BUCKET-NAME':
        raise RuntimeError(
            "Please configure this app with an S3 bucket in config.py")

    CORS(app)
    api = Api(app)

    bucket = boto3.resource('s3').Bucket(app.config.get('BUCKET_NAME'))
    rekognition_client = boto3.client('rekognition')
    ses_client = boto3.client('ses')

    api.add_resource(
        PhotoList, '/photos',
        resource_class_args=(bucket,))
    api.add_resource(
        Photo, '/photos/<string:photo_key>',
        resource_class_args=(bucket,))
    api.add_resource(
        Analysis, '/photos/<string:photo_key>/labels',
        resource_class_args=(bucket.name, rekognition_client))
    api.add_resource(
        Report, '/photos/report',
        resource_class_args=(bucket, rekognition_client, ses_client))

    return app


if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
    try:
        create_app().run(debug=True)
    except RuntimeError as error:
        logger.error(error)
