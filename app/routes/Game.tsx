import React, { useEffect } from "react";
import "./Game.css";
import Die from "../components/Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";


export default function Game() {
  const [dice, setDice] = React.useState(() => generateAllNewDice());
  
  const gameWon = dice.every((die) => die.isHeld) && 
  dice.every((die) => die.value === dice[0].value);
 
  function generateAllNewDice() {
    return new Array(10).fill(0).map(() => ({
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    }));
  }

  const diceElements = dice.map((dieObj) => (
    <Die
      key={dieObj.id}
      value={dieObj.value}
      isHeld={dieObj.isHeld}
      hold={holdDice}
      id={dieObj.id}
    />
  ));

  function rollDice() {
    if(!gameWon) {
    setDice((prevDice) => {
      return prevDice.map((die) => {
        return die.isHeld
          ? die
          : { ...die, value: Math.ceil(Math.random() * 6) };
      });
    });
    } else {
      setDice(generateAllNewDice())
    }
  }

  function holdDice(id: any) {
    setDice((prevDice) => {
      return prevDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      });
    });
  }

  return (
    <main>
      { gameWon && <Confetti />}
      <div className="game-box">
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
        <div className="dice-grid">{diceElements}</div>

        <button className="roll-button" onClick={rollDice}>
          {gameWon ? "New Game" :  "Roll"}
        </button>
      </div> 
    </main>
  );
}
