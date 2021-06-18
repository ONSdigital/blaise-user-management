import React, {ReactElement} from "react";
import {Link} from "react-router-dom";


interface Props {
    link: string
    title: string
}

function BackLink({link, title}: Props): ReactElement {
    return (
        <nav className="breadcrumb" aria-label="Back">
            <ol className="breadcrumb__items u-fs-s">
                <li className="breadcrumb__item" id="breadcrumb-1">
                    <Link className="breadcrumb__link" id="back" to={link}>{title}</Link>
                    <svg className="svg-icon" viewBox="0 0 8 13" xmlns="http://www.w3.org/2000/svg" focusable="false">
                        <path
                            d="M5.74,14.28l-.57-.56a.5.5,0,0,1,0-.71h0l5-5-5-5a.5.5,0,0,1,0-.71h0l.57-.56a.5.5,0,0,1,.71,0h0l5.93,5.93a.5.5,0,0,1,0,.7L6.45,14.28a.5.5,0,0,1-.71,0Z"
                            transform="translate(-5.02 -1.59)"/>
                    </svg>
                </li>
            </ol>
        </nav>
    );
}

export default BackLink;
