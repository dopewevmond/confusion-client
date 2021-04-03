import React, { Component } from 'react';
import { Navbar, NavbarBrand, Nav, NavbarToggler, Collapse, NavItem, Jumbotron,
    Button, Modal, ModalHeader, ModalBody,
    Form, FormGroup, Input, Label } from 'reactstrap';
import { NavLink } from 'react-router-dom';

class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isNavOpen: false,
      isLoginModalOpen: false,
      isLogoutModalOpen: false
    };
    this.toggleNav = this.toggleNav.bind(this);
    this.toggleLoginModal = this.toggleLoginModal.bind(this);
    this.toggleLogoutModal = this.toggleLogoutModal.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
      
  }

  toggleNav() {
    this.setState({
      isNavOpen: !this.state.isNavOpen
    });
  }

  toggleLoginModal() {
    this.setState({
      isLoginModalOpen: !this.state.isLoginModalOpen
    });
  }

  toggleLogoutModal() {
    this.setState({
      isLogoutModalOpen: !this.state.isLogoutModalOpen
    });
  }

  handleLogin(event) {
    this.toggleLoginModal();
    this.props.loginUser({username: this.username.value, password: this.password.value});
    event.preventDefault();
  }

  handleLogout() {
    this.toggleLogoutModal();
    this.props.logoutUser();
  }

  render() {
    return(
      <React.Fragment>
        <Navbar dark expand="md">
          <div className="container">
            <NavbarBrand className="mr-auto" href="/">
              <img src="/assets/images/logo.png" height="30" width="41"
                alt="Ristorante Con Fusion" />
            </NavbarBrand>
              
            <NavbarToggler onClick={this.toggleNav} />

            <Collapse isOpen={this.state.isNavOpen} navbar>
              <Nav navbar className="ml-md-4">
                <NavItem>
                  <NavLink className="nav-link" to="/home" onClick={this.toggleNav}>
                    Home
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className="nav-link" to="/aboutus" onClick={this.toggleNav}>
                    About Us
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className="nav-link" to="/menu" onClick={this.toggleNav}>
                    Menu
                  </NavLink>
                </NavItem>
                {
                  this.props.auth.isAuthenticated ?
                  <NavItem>
                    <NavLink className="nav-link" to="/favorites" onClick={this.toggleNav}>
                      My Favorites
                    </NavLink>
                  </NavItem>
                  : null
                }
                <NavItem>
                  <NavLink className="nav-link" to="/contactus" onClick={this.toggleNav}>
                    Contact Us
                  </NavLink>
                </NavItem>
              </Nav>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  { !this.props.auth.isAuthenticated ?
                    <button className="btn bg-primary text-white" onClick={this.toggleLoginModal}>
                      Login
                      {this.props.auth.isFetching ?
                        <span className="fa fa-spinner fa-pulse fa-fw"></span>
                        : null
                      }
                    </button>
                    :
                    <div>
                    <div className="navbar-text mr-3">{this.props.auth.user.username}</div>
                    <button className="btn bg-danger text-white" onClick={this.toggleLogoutModal}>
                      Logout
                      {this.props.auth.isFetching ?
                        <span className="fa fa-spinner fa-pulse fa-fw"></span>
                        : null
                      }
                    </button>
                    </div>
                  }
                </NavItem>
              </Nav>
            </Collapse>
          </div>
        </Navbar>
        <Jumbotron>
          <div className="container">
            <div className="row row-header">
              <div className="col-12 col-sm-6">
                <h1>Ristorante Con Fusion</h1>
                <p>We take inspiration from the World's best cuisines, and create a unique fusion experience. Our lipsmacking creations will tickle your culinary senses!</p>
              </div>
            </div>
          </div>
        </Jumbotron>
        <Modal isOpen={this.state.isLoginModalOpen} toggle={this.toggleLoginModal}>
          <ModalHeader toggle={this.toggleLoginModal}>Login</ModalHeader>
          <ModalBody>
            <Form onSubmit={this.handleLogin}>
              <FormGroup>
                <Label htmlFor="username">Username</Label>
                <Input type="text" id="username" name="username"
                  innerRef={(input) => this.username = input} />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="password">Password</Label>
                <Input type="password" id="password" name="password"
                    innerRef={(input) => this.password = input}  />
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input type="checkbox" name="remember"
                  innerRef={(input) => this.remember = input}  />
                  Remember me
                </Label>
              </FormGroup>
              <Button type="submit" value="submit" color="primary">Login</Button>
            </Form>
          </ModalBody>
        </Modal>

        <Modal isOpen={this.state.isLogoutModalOpen} toggle={this.toggleLogoutModal}>
          <ModalHeader toggle={this.toggleLogoutModal}>Logout</ModalHeader>
          <ModalBody>
            <p>Are you sure you want to log out?</p>
            <button className="btn btn-danger" onClick={this.handleLogout}>Logout</button>
            <button className="btn btn-secondary ml-2" onClick={this.toggleLogoutModal}>Cancel</button>
          </ModalBody>
        </Modal>
      </React.Fragment>
    );
  }
}

export default Header;