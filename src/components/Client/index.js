import React, { Component } from 'react';
import { Redirect, Router, Route } from 'react-router-dom';
import * as ROUTES from "../../constants/routes";
import { withRouter } from 'react-router';
import {withFirebase} from '../../server/Firebase/index';
import { AuthUserContext } from "../../server/Session/index";
//import for individual card
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from "react-bootstrap/Card";
import {Button} from "react-bootstrap";
import {Container} from 'react-bootstrap';
import Nav from "react-bootstrap/Nav";
import Image from "react-bootstrap/Image";
//for button
import {ButtonGroup} from 'reactstrap';
import Navbar from './NavBar';

//css for client
import './client.css'
import './style.css'

let path;
let remember;
let imagesource = false;
let tempObj;
const authUser = JSON.parse(localStorage.getItem("authUser"));
class Client extends React.Component {
  constructor(props) {
    super(props);
    path = this.props.history;

    // lastInfor = this.props.history.location.state;
    this.state = {
      isLoading: false,
      dis: [],
      authUser: {},
      favoritehouses: []
    };
    this.deleteAction = this.deleteAction.bind(this);
  }

  gettingHouse(){
    let houseId = authUser.favHouses.hs;

  }

  onProfile(){
  path.push({
  pathname: './clientform'},remember);
};

onEdit(){
  path.push({
    pathname: './clientedit', remember
  })
}

onSubmit(){
  path.push({
    pathname: './overview', remember
  })
}

 deleteAction=(e, house) => {
   console.log(house.idH);
   console.log(authUser.favHouses[house.idH]);
   var userRef = this.props.firebase.database.ref('users/' + authUser.uid).child('favHouses').child(house.idH);
   userRef.remove();
 }


  componentDidMount() {
    this.setState({isLoading: true});
    const authUser = JSON.parse(localStorage.getItem("authUser"));
    let houseId = authUser.favHouses.hs;
    this.props.firebase.database.ref('account').on('value', (snapshot) => {
      const data = snapshot.val().userAccount;
      let newState = [];
      let imgs = data.userAccount1;
      newState.push({
                name: imgs.name,
                email: imgs.email,
                img: imgs.img,
                isAgent: imgs.isAgent,
                passWord: imgs.passWord
                });

      this.setState({favoritehouses: newState , authUser: authUser});
    });

    this.props.firebase.database.ref("houses").on("value", snapshot => {
        let h = [];
        for(var obj in authUser.favHouses){
          if(authUser.favHouses[obj] !== "null"){
            let idTemp = authUser.favHouses[obj].id;
            console.log(idTemp);
            h.push({
                      idH : obj,
                      image: snapshot.val()[idTemp].images["0"],
                      address: snapshot.val()[idTemp].propertyInfor.details.address,
                      price: snapshot.val()[idTemp].propertyInfor.details.listPrice,
            });
            imagesource = true;
          }
        }
          this.setState({favoritehouses: h , authUser: authUser});
      });

  }

  buildHouse(house){
    return(
      <div className="single-house">
        <div className="SingleHouseInfo">
          <Image src={house.image} alt="" />
          <h2> Price: {house.price}
          <br />
          {house.address}
          </h2>
        </div>
        <div style={this.state.hide ? {visibility: "hidden"}: {visibility: "visible"} }
        className="clientbutton">
        <Button variant="danger" onClick = {((e) => this.deleteAction(e, house))}>Delete</Button>
      </div>
    </div>
    );
  }


buildFavoriteHouseList(){
  const Panel = this.state.favoritehouses.map(house=>{
    return this.buildHouse(house)
  });
  return <div>{Panel}</div>;
}

printEmpty(){
  return(
    <p>You have no favorite house!</p>
  );
}

  render() {
    const {isLoading, authUser} = this.state;
    remember = this.state.dis;

    return (
      <div className="clientContent">
        <div>
        <div className="TopBar container navRender">
          <Nav className="justify-content-center" activeKey="/home">
            <Nav.Item>
              <Nav.Link>
                <span id="nav01" className="textNav activeNav">
                  {"Favorite House"}
                </span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href={ROUTES.HOMEPAGE}>
                <span id="nav03" className="textNav">
                  {"Find a house"}
                </span>
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>

        <div className="row">
        <div className="ClientColumn col-sm-2">
        <Card style={{ "box-shadow": "5px 4px 8px 5px rgba(0,0,0,0.2)" }} className="ClientInfo">
        <Card.Img className="ClientImage" variant="top" src={"https://i.imgur.com/onLuiBV.jpg"}/>
        <Card.Body>
        <Card.Title>
          <h3 class="ClientName">{authUser.firstName + " " +authUser.lastName}</h3>
        </Card.Title>
        {authUser.isAgent !== "true" ? (
                      <div
                        className="btn-edit"
                        style={
                          this.state.hide
                            ? { visibility: "hidden" }
                            : { visibility: "visible" }
                        }
                      >
                        <Button onClick={e => this.onEdit()}>
                          Edit Profile
                        </Button>
                      </div>
                    ) : (
                      ""
                    )}
        </Card.Body>
        </Card>
        </div>
        <div className="FavoriteHouseColumn col-sm-9">
        {(imagesource)?this.buildFavoriteHouseList():this.printEmpty()}
        </div>
        </div>
        </div>

      </div>
    );
  }
}


const styles = {
  card: {
    maxWidth: 345,
  },
  media: {
    objectFit: 'cover',
  },
};

export default  withFirebase(Client);
