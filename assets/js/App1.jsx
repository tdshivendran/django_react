import React from "react"
import { render } from "react-dom"

const display = (
    <div>
        <h1>Hello.</h1>
        <p>This is a django application integrated with react.</p>
    </div>
);

render(display, document.getElementById('root'));