"use client";

import { useState, useEffect } from "react";

const cardImages = ["❤️", "💌", "🍫", "🌹", "💖", "🎁"];

// Define card structure type
interface Card {
  id: number;
  card: string;
  flipped: boolean;
  matched: boolean;
}

const shuffleCards = (): Card[] => {
  return [...cardImages, ...cardImages]
    .sort(() => Math.random() - 0.5)
    .map((card, index) => ({ id: index, card, flipped: false, matched: false }));
};

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>(shuffleCards());
  const [firstPick, setFirstPick] = useState<Card | null>(null);
  const [secondPick, setSecondPick] = useState<Card | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [won, setWon] = useState(false);

  useEffect(() => {
    if (firstPick && secondPick) {
      setDisabled(true);
      if (firstPick.card === secondPick.card) {
        setCards(prev =>
          prev.map(card =>
            card.card === firstPick.card ? { ...card, matched: true } : card
          )
        );
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [firstPick, secondPick]);

  useEffect(() => {
    if (cards.every(card => card.matched)) {
      setWon(true);
    }
  }, [cards]);

  const handleCardClick = (clickedCard: Card) => {
    if (!disabled && !clickedCard.flipped && !clickedCard.matched) {
      // Properly update the state without mutating it
      setCards(prev =>
        prev.map(card =>
          card.id === clickedCard.id ? { ...card, flipped: true } : card
        )
      );

      firstPick ? setSecondPick(clickedCard) : setFirstPick(clickedCard);
    }
  };

  const resetTurn = () => {
    setFirstPick(null);
    setSecondPick(null);
    setDisabled(false);

    setCards(prev =>
      prev.map(card =>
        card.matched ? card : { ...card, flipped: false }
      )
    );
  };

  const restartGame = () => {
    setWon(false);
    setFirstPick(null);
    setSecondPick(null);
    setCards(shuffleCards());
  };

  return (
    <div className="game-container">
      <h2>Memory Match Game 💘</h2>

      {won ? (
        <div className="win-message">
          <p>Congratulations! 🎉 You won the game!</p>
          <p>Don't worry, I'll take you out on the 14th of Feb for a date! 💖</p>
        </div>
      ) : (
        <div className="game-board">
          {cards.map(card => (
            <div
              key={card.id}
              className={`card ${card.flipped ? "flipped" : ""} ${
                card.matched ? "matched" : ""
              }`}
              onClick={() => handleCardClick(card)}
            >
              {card.flipped || card.matched ? card.card : "❓"}
            </div>
          ))}
        </div>
      )}

      <button onClick={restartGame}>Restart Game 🔄</button>
    </div>
  );
}
