import React, {useEffect, useState} from "react";
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Row from 'react-bootstrap/Row'
import ListGroup from 'react-bootstrap/ListGroup'
import {Report} from './Report';
import $ from "jquery";

export const PhotoList = (props) => {
  const [photosError, setPhotosError] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [imageFile, setImageFile] = useState();
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    $.get(`${props.apiUrl}/photos`,
      (result) => {
        console.log("SUCCESS", result)
        setPhotos(result)
      })
      .fail((error) => {
        setPhotosError(error);
      })
  }, [props.apiUrl]);

  const uploadFile = () => {
    console.log("uploadFile called");
    const formData = new FormData();
    formData.append("image_file", imageFile, imageFile.name);
    $.post({
      url: `${props.apiUrl}/photos`,
      data: formData,
      processData: false,
      contentType: false,
      success: () => {
        console.log(`Posted image ${imageFile.name}.`);
        setPhotos(photos.concat({'name': imageFile.name})
          .sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)));
        setImageFile(undefined);
      },
      fail: (error) => {
        setUploadError(error);
      }
    });
  };

  return (
    <>
      <Row className="mb-3">
        <h3>Photos</h3>
        {photos.length < 1 ?
          <p className="lead">Upload some photos to analyze them.</p>
          :
          <p className="lead">Select a photo to analyze.</p>
        }
        <p className='text-danger'>{photosError}</p>
        <ListGroup style={{maxHeight: `calc(100vh - 400px)`, overflowY: "auto"}}>
          {photos.map(photo => (
            <ListGroup.Item action
              key={photo.name}
              onClick={(event) => props.onSelectedPhotoChange(photo)}
            >{photo.name}</ListGroup.Item>
          ))}
        </ListGroup>
      </Row>
      <Row className="mb-3">
        <Form className="ps-0">
          <Form.Group>
            <Form.Label className="ms-2" htmlFor="imageFile">Upload a photo</Form.Label>
            <InputGroup>
              <Form.Control type="file" id="imageFile" accept=".jpg,.png"
                onChange={(event) => setImageFile(event.target.files[0])}
              />
              <Button variant="outline-secondary" disabled={!imageFile} onClick={uploadFile}>Upload</Button>
            </InputGroup>
          </Form.Group>
        </Form>
        <p className='text-danger'>{uploadError}</p>
      </Row>
      {photos.length < 1 ? null :
      <Row className="me-0">
        <Report apiUrl={props.apiUrl}/>
      </Row>}
    </>
  );
};
