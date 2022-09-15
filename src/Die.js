import React from "react"

export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }
    //To turn the numbers to actual dots, create a span 
    //element and style it to be a rounded dot and then
    //display the amount of times the random number 
    //appears on each die.

    const spanElements = []
    for(let i=0;i<props.value;i++) {
        spanElements.push(<span></span>)
    }
    // console.log(spanElements)
    return (
        <div 
            className="die-face" 
            style={styles}
            onClick={props.holdDice}
        >
            {/* <h2 className="die-num">{props.value}</h2> */}
            <div className="die-dots">
                {spanElements}
            </div>
        </div>
    )
}