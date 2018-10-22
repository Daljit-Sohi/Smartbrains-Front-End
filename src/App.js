import React, { Component } from 'react';
import './App.css';

//Import Component
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import SignIn from './Components/SignIn/SignIn';
import Register from './Components/Register/Register';

//Importing NPM Packages
import Particles from 'react-particles-js';
// import Clarifai from 'clarifai'; --> Moved to backend
//Clarifai API KEY
// const ClarifaiAPI = "502f742614a54f4d95da97846da82c47";

// const app = new Clarifai.App({
//   apiKey: ClarifaiAPI
//  });

const particlesOptions = {
  particles: {
    number: {
      value: 35, 
      density: {
        enable: true, 
        value_area: 800,
      }
    }
  } //end particles
}// end particlesOptions Const

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user:{
    id: '',
    name: '', 
    email: '', 
    entries: '0',
    joined: '', 
  }
}//end initialState

class App extends Component {

  constructor(){
    super();
    this.state = initialState;
  }

  calculateFaceLocation = (data) => {
    // const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const faceBoxArray = [];
    const clarifaiFace = data.outputs[0].data.regions; 
    // console.log(clarifaiFace);

    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);

    clarifaiFace.forEach(element => {
      // console.log('region info -----> ', element.region_info.bounding_box);

      let obj = {
        leftCol: element.region_info.bounding_box.left_col * width,
        topRow: element.region_info.bounding_box.top_row * height,
        rightCol: width - (element.region_info.bounding_box.right_col * width),
        bottomRow: height - (element.region_info.bounding_box.bottom_row * height)
      }
       faceBoxArray.push(obj);
    });

    // console.log('Facebox Array --> ',faceBoxArray);

    // const faceBoxObj = {
    //   leftCol: clarifaiFace.left_col * width,
    //   topRow: clarifaiFace.top_row * height,
    //   rightCol: width - (clarifaiFace.right_col * width),
    //   bottomRow: height - (clarifaiFace.bottom_row * height)
    // }
    
    return faceBoxArray;
  }

  displayFaceBox = (box) => {  
    // console.log(box);
    
    this.setState({
      box: box
    })
  }

  onInputChange = (event) =>{
    this.setState({
      input: event.target.value
    })
    // console.log(event.target.value);
  }

  onImageSubmit = () => {
    this.setState({
      imageUrl: this.state.input
    });
    fetch('https://enigmatic-scrubland-46027.herokuapp.com/imageurl', {
      method: 'post', 
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(response => response.json())
    .then(response => {

      // this.displayFaceBox(this.calculateFaceLocation(response)); //--> Find out why this shiteee don't working!!!!!!!!

      //test face image -> https://sambashades.planetva.net/sa/clients/sambashades.com/assets/img/female-model-front-face.jpg
      //                -> https://i.pinimg.com/originals/52/5e/81/525e8147f8b2e37f8fc1b662dbf7722f.png
      
      //Updating the Number of Entries Made by the User.
      if(response){
        fetch('https://enigmatic-scrubland-46027.herokuapp.com/image', {
          method: 'put', 
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
          .then(res => res.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}));
          })
          .catch(console.log);
      }

      this.displayFaceBox(this.calculateFaceLocation(response));
    })
    .catch(err => console.log(err, 'Seems like the Image Link you provided cannot be Detected.'));
  }//end onImageSubmit

  onRouteChange = (route) =>{
    if(route === 'signin'){
      this.setState(initialState);
    }else if(route === 'home'){
      this.setState({isSignedIn: true});
    }
    this.setState({
      route: route
    })
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name, 
        email: data.email, 
        entries: data.entries,
        joined: data.joined, 
      }
    });
  }
 
  render(){
    
    const { isSignedIn, imageUrl, route, box, user} = this.state;

    return (
      <div className="App">
         <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home'
          ? <div>
              <Logo />
              <Rank name={user.name} entries={user.entries} />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onImageSubmit={this.onImageSubmit}
              />
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>
          : (
             route === 'signin'
             ? <SignIn loadUser = {this.loadUser} onRouteChange={this.onRouteChange}/>
             : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
    ); //end return
  }

  /** 
  render() {
    if(this.state.isSignedIn === false && this.state.route === 'signin'){
      return (
        <div>
          <Particles className='particles' params={particlesOptions}/>
          <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
          <SignIn onRouteChange={this.onRouteChange} />
        </div>
      )
    }if(this.state.isSignedIn === false && this.state.route === 'register'){
      return (
        <div>
          <Particles className='particles' params={particlesOptions}/>
          <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
          <Register onRouteChange={this.onRouteChange} />
        </div>
      ) 
    }if(this.state.isSignedIn === true && this.state.route === 'home'){
      return (
        <div> 
          <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
          <Logo />
          <Rank />
          <ImageLinkForm onInputChange={this.onInputChange} onImageSubmit={this.onImageSubmit} />
          <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
        </div>
      )
    }
  } //end Render
  */
} // End App Component

export default App;
