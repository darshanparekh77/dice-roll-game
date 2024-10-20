import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('https://dice-roll-game.onrender.com');

const DiceRoll = () => {
    const [myRoll, setMyRoll] = useState(null);
    const [opponentRoll, setOpponentRoll] = useState(null);
    
    const rollDice = () => {
        socket.emit('rollDice');
    };

    useEffect(() => {
        socket.on('diceRoll', roll => setMyRoll(roll));
        socket.on('opponentRoll', roll => setOpponentRoll(roll));
    }, []);

    return (
        <div>
            <h1>My Roll: {myRoll}</h1>
            <h1>Opponent Roll: {opponentRoll}</h1>
            <button onClick={rollDice}>Roll Dice</button>
        </div>
    );
};

export default DiceRoll;
