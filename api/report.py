import logging
from botocore.exceptions import ClientError
from flask import render_template
from flask_restful import Resource, reqparse

logger = logging.getLogger(__name__)


class Report(Resource):
    def __init__(self, photo_bucket, rekognition_client, ses_client):

        self.photo_bucket = photo_bucket
        self.rekognition_client = rekognition_client
        self.ses_client = ses_client

    def get(self):
        result = 200
        report_csv = ['Photo,Label,Confidence']
        try:
            for photo in self.photo_bucket.objects.all():
                try:
                    response = self.rekognition_client.detect_labels(
                        Image={
                            'S3Object': {
                                'Bucket': self.photo_bucket.name, 'Name': photo.key}})
                    logger.info("Found %s labels in %s.", len(response['Labels']), photo.key)
                    for label in response.get('Labels', []):
                        report_csv.append(
                            ','.join((photo.key, label['Name'], str(label['Confidence']))))
                except ClientError as err:
                    logger.warning(
                        "Couldn't detect labels in %s. Here's why: %s: %s", photo.key,
                        err.response['Error']['Code'], err.response['Error']['Message'])
        except ClientError as err:
            logger.error(
                "Couldn't list photos in bucket '%s'. Here's why: %s: %s",
                self.photo_bucket.name,
                err.response['Error']['Code'], err.response['Error']['Message'])
            result = 400
        return report_csv, result

    def post(self):

        result = 200
        parser = reqparse.RequestParser()
        parser.add_argument('sender', location='json')
        parser.add_argument('recipient', location='json')
        parser.add_argument('subject', location='json')
        parser.add_argument('message', location='json')
        parser.add_argument('analysis_labels', type=list, location='json')
        args = parser.parse_args()
        html_report = render_template(
            'report.html', message=args['message'],
            headers=args['analysis_labels'][0].split(','),
            labels=[label.split(',') for label in args['analysis_labels'][1:]]
        )
        text_labels = '\n'.join(args['analysis_labels'])
        try:
            pass
            self.ses_client.send_email(
                Source=args['sender'],
                Destination={'ToAddresses': [args['recipient']]},
                Message={
                    'Subject': {'Data': args['subject']},
                    'Body': {
                        'Html': {'Data': html_report},
                        'Text': {
                            'Data': f"{args['message']}\n\n{text_labels}"}}})
        except ClientError as err:
            logger.exception(
                "Couldn't send email. Here's why: %s: %s",
                err.response['Error']['Code'], err.response['Error']['Message'])
            result = 400
        return None, result
