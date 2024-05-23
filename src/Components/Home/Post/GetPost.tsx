import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { DataContext } from '../../../Context/DataProvider';
import { Container, Row, Col, Card } from 'react-bootstrap';

interface postData {
  id: string | null | undefined;
  username: string;
  title: string;
  description: string;
  image: string | null;
}

function GetPost() {
  const [post, setPost] = useState<postData[] | undefined>(undefined);
  const { accounts } = useContext(DataContext);

  const fetchData = async () => {
    try {
      const resData = await axios.get(`http://localhost:5000/getAllPost?username=${accounts[0].username}`);
      if (resData.status === 200) {
        console.log("Getting post", resData.data); 
        setPost(resData.data);
      }
    
    } catch (error) {
      console.log("No Data Posted");            
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container className='mt-5'>
        <p className='mt-2 h3'>My Post</p>
      <Row className='mt-3'>
        {post !== undefined && post.map((post: postData) => (
          <Col key={post.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card style={{height:'500px'}}>
              <Card.Body>
                {post.image && <Card.Img src={`data:image/jpeg;base64,${post.image}`} style={{height:'200px'}}/>} {/* Change here */}
                <Card.Text className="text-center">{post.username}</Card.Text>
                <Card.Text className="text-center">{post.title}</Card.Text>
                <Card.Text className="text-center">{post.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default GetPost;
