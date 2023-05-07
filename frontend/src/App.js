import React, { useState } from 'react';
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import {PhotoList} from './PhotoList';
import {Analysis} from './Analysis';

function App(props) {
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  const handleSelectedPhotoChange = (photo) => {
    setSelectedPhoto(photo);
  };

  return (
    <Container>
      <Row>
        <h1 className='display-3 text-center'>Photo Analyzer</h1>
        <hr/>
      </Row>
      <Row className='gx-5'>
        <Col className='border-end'>
          <PhotoList apiUrl={props.apiUrl} onSelectedPhotoChange={handleSelectedPhotoChange}/>
        </Col>
        <Col>
          <Analysis apiUrl={props.apiUrl} photo={selectedPhoto}/>
        </Col>
      </Row>
    </Container>
  );
}

export default App;