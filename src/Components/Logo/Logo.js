import React from 'react';
import './Logo.css';
import brain from './brain.png';

//Importing npm Packages
import Tilt from 'react-tilt';

const Logo = () =>{
    return(
        <div className='ma4 mt0'>
            <Tilt className="Tilt br2 shadow-2" options={{ max : 50 }} style={{ height: 100, width: 100 }} >
                <div className="Tilt-inner pa3"> <img style={{ paddingTop: '5px' }} alt='logo' src={brain}/> </div>
            </Tilt>
        </div>
    )
}

export default Logo;