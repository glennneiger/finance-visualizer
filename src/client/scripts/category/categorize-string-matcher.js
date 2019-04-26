import React from "react";
export default function (props) {
    if (!(props.characterColor && props.characterColor.length == props.text.length)) {
        return <div></div>;
    }
    let response = [];
    if (props.text && props.text.trim().length > 0) {
        for (let charIndex = 0; charIndex < props.text.length; charIndex++) {
            let charElement =
                <span
                    key={charIndex}
                    className={"no-select"}
                    style={{ background: props.characterColor[charIndex] }}
                    onMouseDown={props.startHighlight.bind(null, charIndex)}
                    onMouseEnter={props.highlight.bind(null, charIndex)}>{props.text.charAt(charIndex)}</span >;
            response.push(charElement);
        }
        return <div>{response}</div>;
    }
    return <span>"--"</span>;
}