import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"
import './App.css';


export default function App() {
    /*
     1) Track the number of Rolls it took to win the game
     2) Track the time it took to win the game
     3) Save your best time and lowest number of Rolls to local storage
     4) CSS: put real dots on the dice.
     5) display the stats of the game, stats like number of Rolls,
        time-taken and also display the best record of number of Rolls
        and time-taken from local storage.
    */
    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [stats, setStats]   = React.useState({
        rollCount: 0,
        timeTaken: 0,
    })
    const [firstClick, setFirstClick] = React.useState(true)
    const [endTime, setEndTime] = React.useState(0)
    const [storedRecords, setStoredRecords] =  React.useState(
       JSON.parse(localStorage.getItem('records')) || {})
    
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)

        if (allHeld && allSameValue) {
            if(!tenzies) {
                setEndTime(Date.now())   
            }
            setTenzies(true)
           
        }
    }, [dice])

    React.useEffect( () => {
        if(tenzies) {
            setStats(prevStats => {
                return {
                    ...prevStats,
                    timeTaken : endTime - prevStats.timeTaken
                }
            })
            if(stats.rollCount < storedRecords.rollCount
                || !storedRecords.rollCount)  {
                setStoredRecords(prevRecords => {
                    return  {
                        ...prevRecords,
                        rollCount : stats.rollCount
                    }
                })
                localStorage.setItem('records', JSON.stringify(storedRecords))
            }
        }

    },[tenzies])

    React.useEffect(() => {
        if(tenzies) {
            if(stats.timeTaken < storedRecords.timeTaken 
                || !storedRecords.timeTaken)  {
                    console.log('now in timetaken')
                setStoredRecords(prevRecords => {
                    return {
                        ...prevRecords,
                        timeTaken : stats.timeTaken,
                    }
                })
                localStorage.setItem('records', JSON.stringify(storedRecords))
            }
        }
    }, [stats])
    
    localStorage.setItem('records', JSON.stringify(storedRecords))    

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    function rollDice() {
        if(!tenzies) {
            setStats(prevStats => {
                return {
                    ...prevStats,
                    rollCount : prevStats.rollCount + 1
                }
            })
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
        } else {
            setStats(prevStats => {
                return {
                    ...prevStats,
                    rollCount : 0
                }
            })
            setTenzies(false)
            setDice(allNewDice())
            setFirstClick(true)
        }
    }
    
    function holdDice(id) {
        if(firstClick === true ) {
            setStats(prevStats => {
                return {
                    ...prevStats,
                    timeTaken : Date.now()
                }
            })
        }
        setFirstClick(false)
        if(!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.id === id ? 
                    {...die, isHeld: !die.isHeld} :
                    die
            }))
        }
    }

    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))

    const styles = {
        margin: 'auto'
    }
    
    return (
        <main>
            {tenzies && <Confetti style={styles}/>}
            <h1 className="title">Tenzies</h1>
            {
                !tenzies &&
                <p className="instructions">
                    Roll until all dice are the same. 
                    Click each die to freeze it at its current value between 
                    rolls.
                </p>
            }
            {
                tenzies &&
                <div  className="instructions-two">
                    <div>Number of Rolls : {stats.rollCount}</div>
                    <div>Time Taken : 
                        {
                            stats.timeTaken > 1000 ? 
                            ` ${Math.floor(stats.timeTaken/1000)}secs` :
                            `${stats.timeTaken}milisecs`
                        }
                    </div>
                    <div>Record Rolls : {storedRecords.rollCount}</div>
                    <div>Record Time : 
                        { 
                            stats.timeTaken > 1000 ? 
                            ` ${Math.floor(storedRecords.timeTaken/1000)}secs` :
                            `${storedRecords.timeTaken}milisecs`
                        }
                    </div>
                </div>
            }
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
        </main>
    )
}
