
import React from "react"

import "../styles/app.css"

function MainBody(props) {

    return (
        <div className="main-sec about-us-section parallax">
            {props.children}
        </div>
    )
}

export default MainBody