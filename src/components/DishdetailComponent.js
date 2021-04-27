import React, { Component } from 'react';
import { Card, CardImg, CardImgOverlay, CardText, CardBody,
    CardTitle, Breadcrumb, BreadcrumbItem, Label,
    Modal, ModalHeader, ModalBody, Button, Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm } from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';


function RenderDish({dish, favorite, postFavorite, authenticated, deleteFavorite}) {
  return(
    <div className="col-12 col-md-5 m-1">
        <Card>
          <CardImg top src={baseUrl + dish.image} alt={dish.name} />
          {
            authenticated ?
            <CardImgOverlay>
              <Button outline color="primary" size="lg" onClick={() => favorite ? deleteFavorite(dish._id) : postFavorite(dish._id)}>
                {favorite ?
                  <span className="fa fa-heart"></span>
                  : 
                  <span className="fa fa-heart-o"></span>
                }
              </Button>
            </CardImgOverlay>
            : null
          }
          <CardBody>
            <CardTitle>{dish.name}</CardTitle>
            <CardText>{dish.description}</CardText>
          </CardBody>
        </Card>
    </div>
  );
}

function RenderComments({comments, postComment, dishId, authenticated, user}) {
  console.log('authenticated', user);
  if (comments != null)
    return(
      <div className="col-12 col-md-5 m-1">
        <h4>Comments</h4>
        <ul className="list-unstyled">
          {comments.map((comment, idx, arr) => {

            let stars = [];
            for (let i = 0; i < comment.rating; i++ ) {
              stars.push(<span className="fa fa-star mr-1" key={i}></span>)
            }

            for (let i = 0; i < 5 - comment.rating; i++) {
              stars.push(<span className="fa fa-star-o mr-1" key={5-i}></span>)
            }
            
            return (
              <li key={comment._id} className="position-relative">
                {
                  comment.author.username === localStorage.getItem("user") ?
                  <span className="fa fa-trash text-danger cs-position"></span>
                  : null
                }
                <div className="text-warning">{stars}</div>
                <div>{comment.comment}</div>
                <div className="text-secondary small-text">
                  {comment.author.firstname} {comment.author.lastname} · {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day:'2-digit'}).format(new Date(Date.parse(comment.updatedAt)))}
                </div>   

                {
                  idx < arr.length - 1 ?
                  <hr />
                  : null
                }             
              </li>
            );
          })}
        </ul>
        <CommentForm dishId={dishId} postComment={postComment} authenticated={authenticated} />
      </div>
    );
  else
    return(
        <div></div>
    );
}

class CommentForm extends Component {

  constructor(props) {
    super(props);

    this.toggleModal = this.toggleModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    
    this.state = {
      isNavOpen: false,
      isModalOpen: false
    };
  }

  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  }

  handleSubmit(values) {
    this.toggleModal();
    this.props.postComment(this.props.dishId, values.rating, values.comment);
  }

  render() {
    return(
    <div>
      {
        this.props.authenticated ?
        <button className="btn btn-primary" onClick={this.toggleModal}> Add Comment</button>
        : <div className="alert alert-info">
          Please log in to add a comment
        </div>
      }
      <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
        <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
        <ModalBody>
          <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
            <Row className="form-group">
              <Col>
              <Label htmlFor="rating">Rating</Label>
              <Control.select model=".rating" id="rating" className="form-control">
                <option value="" defaultValue>-- Select a rating --</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </Control.select>
              </Col>
            </Row>
            <Row className="form-group">
              <Col>
              <Label htmlFor="comment">Comment</Label>
              <Control.textarea model=".comment" id="comment"
                rows="6" className="form-control" />
              </Col>
            </Row>
            <Button type="submit" className="bg-primary">
              Submit
            </Button>
          </LocalForm>
        </ModalBody>
      </Modal>
    </div>
    );
  }

}

const DishDetail = (props) => {
  if (props.isLoading) {
    return(
      <div className="container">
        <div className="row">
          <Loading />
        </div>
      </div>
    );
  }
  else if (props.errMess) {
    return(
      <div className="container">
        <div className="row">
          <h4>{props.errMess}</h4>
        </div>
      </div>
    );
  }
  else if (props.dish != null)        
    return (
      <div className="container">
        <div className="row">
          <Breadcrumb>
            <BreadcrumbItem><Link to='/menu'>Menu</Link></BreadcrumbItem>
            <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
          </Breadcrumb>
          <div className="col-12">
            <h3>{props.dish.name}</h3>
            <hr />
          </div>
        </div>
        <div className="row">
          <RenderDish dish={props.dish} favorite={props.favorite} postFavorite={props.postFavorite} authenticated={props.auth.isAuthenticated} deleteFavorite={props.deleteFavorite} />
          <RenderComments comments={props.comments}
            postComment={props.postComment}
            dishId={props.dish._id} authenticated={props.auth.isAuthenticated} user={props.auth.user} />
        </div>
      </div>
    );
  else
    return(
        <div></div>
    );
}

export default DishDetail;