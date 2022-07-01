import React from 'react';
import { Spinner } from 'react-bootstrap';
import './spinner.css';


const ShowSpinner = ({data_text, display}) => {
    return (
        <section id='showSpinner' className={display}>
            <Spinner animation='grow' role={'status'}></Spinner>
            <div id='spinnerText'>{data_text}...</div>
        </section>
    )
}

export default ShowSpinner;