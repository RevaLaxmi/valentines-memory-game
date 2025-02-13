/* eslint-disable @typescript-eslint/no-unused-expressions */

"use client";

import { useState, useEffect } from "react";

type Card = {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
};

const cardImages: string[] = ["❤️", "💌", "🍫", "🌹", "💖", "🎁"];

const shuffleCards = (): Card[] => {
  return [...cardImages, ...cardImages]
    .sort(() => Math.random() - 0.5)
    .map((emoji, index) => ({
      id: index,
      emoji: emoji,
      flipped: false,
      matched: false,
    }));
};

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [firstPick, setFirstPick] = useState<Card | null>(null);
  const [secondPick, setSecondPick] = useState<Card | null>(null);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [won, setWon] = useState<boolean>(false);
  const [lost, setLost] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(30);

  useEffect(() => {
    setCards(shuffleCards());
  }, []);

  useEffect(() => {
    if (firstPick && secondPick) {
      setDisabled(true);
      if (firstPick.emoji === secondPick.emoji) {
        setCards((prevCards) =>
          prevCards.map((c) =>
            c.emoji === firstPick.emoji ? { ...c, matched: true } : c
          )
        );
        resetTurn();
      } else {
        setTimeout(() => {
          resetTurn();
        }, 1000);
        
      }
    }
  }, [firstPick, secondPick]);

  useEffect(() => {
    if (cards.length > 0 && cards.every((c) => c.matched)) {
      setWon(true);
    }
  }, [cards]);  

  /*
  useEffect(() => {
    if (timeLeft > 0 && !won) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => Math.max(prevTime - 1,0));
      }, 1000);
      
      return () => clearInterval(timer);
    } 
    
    if (timeLeft === 0) {
      setLost(true);
    }
  }, [timeLeft, won]);
  */

  useEffect(() => {
    if (timeLeft > 0 && !won) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => Math.max(prevTime - 1, 0));
      }, 1000);
  
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setLost(true);
    }
  }, [timeLeft, won]);
  

  const handleCardClick = (clickedCard: Card): void => {
    if (!disabled && !clickedCard.flipped && !clickedCard.matched) {
      setCards((prevCards) =>
        prevCards.map((c) =>
          c.id === clickedCard.id ? { ...c, flipped: true } : c
        )
      );

      firstPick ? setSecondPick(clickedCard) : setFirstPick(clickedCard);
    }
  };

  const resetTurn = (): void => {
    setFirstPick(null);
    setSecondPick(null);
    setDisabled(false);
    setCards((prevCards) =>
      prevCards.map((c) => (c.matched ? c : { ...c, flipped: false }))
    );
  };

  const restartGame = (): void => {
    setCards(shuffleCards());
    setWon(false);
    setLost(false);
    setTimeLeft(30);
  };

  useEffect(() => {
    const createSparkle = (e: MouseEvent) => {
      const sparkle = document.createElement("div");
      sparkle.classList.add("sparkle");
      document.body.appendChild(sparkle);

      sparkle.style.left = `${e.clientX}px`;
      sparkle.style.top = `${e.clientY}px`;

      setTimeout(() => sparkle.remove(), 800);
    };

    document.addEventListener("mousemove", createSparkle);

    return () => {
      document.removeEventListener("mousemove", createSparkle);
    };
  }, []);

  return (
    <div className="game-container">
      <h2>Memory Match Game</h2>
      <div className="timer-container">
        <div className="timer-bar" style={{ width: `${(timeLeft / 30) * 100}%` }}></div>
        <div className="timer-text">{timeLeft}s</div>
      </div>

      {won ? (
        <div className="win-message">
          <p>🎉 You won the game!</p>
          <p>{"Youre the sweetest part of Galentines! 💗"}</p>
        </div>
      ) : lost ? (
        <div className="lose-message">
          <p>😢 Oops! You lost</p>
          <p>{"Every moment with you is a win for me! 💗"}</p>
        </div>
      ) : (
        <div className="game-board">
          {cards.map((c) => (
            <div
              key={c.id}
              className={`card ${c.flipped ? "flipped" : ""} ${c.matched ? "matched" : ""}`}
              onClick={() => handleCardClick(c)}
            >
              <div className="card-back"></div>
              <div className="card-front">{c.emoji}</div>
            </div>
          ))}
        </div>
      )}

      <button onClick={restartGame}>Restart Game</button>
    </div>
  );
}

/*
"use client";

import { useState, useEffect } from "react";

type Card = {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
};

const cardImages: string[] = ["❤️", "💌", "🍫", "🌹", "💖", "🎁"];

const shuffleCards = (): Card[] => {
  return [...cardImages, ...cardImages]
    .sort(() => Math.random() - 0.5)
    .map((emoji, index) => ({
      id: index,
      emoji: emoji,
      flipped: false,
      matched: false,
    }));
};

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([]); // Empty array initially
  const [firstPick, setFirstPick] = useState<Card | null>(null);
  const [secondPick, setSecondPick] = useState<Card | null>(null);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [won, setWon] = useState<boolean>(false);
  const [lost, setLost] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(30);

  // Shuffle cards only after the component mounts (client-side)
  useEffect(() => {
    setCards(shuffleCards());
  }, []);

  useEffect(() => {
    if (firstPick && secondPick) {
      setDisabled(true);
      if (firstPick.emoji === secondPick.emoji) {
        setCards((prevCards) =>
          prevCards.map((c) =>
            c.emoji === firstPick.emoji ? { ...c, matched: true } : c
          )
        );
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [firstPick, secondPick]);

  useEffect(() => {
    if (cards.every((c) => c.matched) && cards.length > 0) {
      setWon(true);
    }
  }, [cards]);

  useEffect(() => {
    if (timeLeft > 0 && !won) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setLost(true);
    }
  }, [timeLeft, won]);

  const handleCardClick = (clickedCard: Card): void => {
    if (!disabled && !clickedCard.flipped && !clickedCard.matched) {
      setCards((prevCards) =>
        prevCards.map((c) =>
          c.id === clickedCard.id ? { ...c, flipped: true } : c
        )
      );

      firstPick ? setSecondPick(clickedCard) : setFirstPick(clickedCard);
    }
  };

  const resetTurn = (): void => {
    setFirstPick(null);
    setSecondPick(null);
    setDisabled(false);
    setCards((prevCards) =>
      prevCards.map((c) => (c.matched ? c : { ...c, flipped: false }))
    );
  };

  const restartGame = (): void => {
    setCards(shuffleCards());
    setWon(false);
    setLost(false);
    setTimeLeft(30);
  };

  return (
    <div className="game-container">
      <h2>Memory Match Game</h2>
      <div className="timer-container">
        <div className="timer-bar" style={{ width: `${(timeLeft / 30) * 100}%` }}></div>
        <div className="timer-text">{timeLeft}s</div>
      </div>

      {won ? (
        <div className="win-message">
          <p>🎉 You won the game!</p>
          <p>Let's celebrate, 14th of Feb for a date💖</p>
        </div>
      ) : lost ? (
        <div className="lose-message">
          <p>You lost 😢</p>
          <p>Let me take you out on the 14th for a date? 💞</p>
        </div>
      ) : (
        <div className="game-board">
            {cards.map((c) => (
                <div
                key={c.id}
                className={`card ${c.flipped ? "flipped" : ""} ${c.matched ? "matched" : ""}`}
                onClick={() => handleCardClick(c)}
                >
                {}  
                <div className="card-back"></div>  

                {}
                <div className="card-front">{c.emoji}</div>
                </div>
            ))}
        </div>
      )}

      <button onClick={restartGame}>Restart Game</button>
    </div>
  );
}
*/


/*  THIS IS A WORKING VERSION */
/*
"use client";

import { useState, useEffect } from "react";

type Card = {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
};

const cardImages: string[] = ["❤️", "💌", "🍫", "🌹", "💖", "🎁"];

const shuffleCards = (): Card[] => {
  return [...cardImages, ...cardImages]
    .sort(() => Math.random() - 0.5)
    .map((emoji, index) => ({
      id: index,
      emoji: emoji,
      flipped: false,
      matched: false,
    }));
};

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>(shuffleCards());
  const [firstPick, setFirstPick] = useState<Card | null>(null);
  const [secondPick, setSecondPick] = useState<Card | null>(null);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [won, setWon] = useState<boolean>(false);
  const [lost, setLost] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(30);

  useEffect(() => {
    if (firstPick && secondPick) {
      setDisabled(true);
      if (firstPick.emoji === secondPick.emoji) {
        setCards((prevCards) =>
          prevCards.map((c) =>
            c.emoji === firstPick.emoji ? { ...c, matched: true } : c
          )
        );
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [firstPick, secondPick]);

  useEffect(() => {
    if (cards.every((c) => c.matched)) {
      setWon(true);
    }
  }, [cards]);

  useEffect(() => {
    if (timeLeft > 0 && !won) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setLost(true);
    }
  }, [timeLeft, won]);

  const handleCardClick = (clickedCard: Card): void => {
    if (!disabled && !clickedCard.flipped && !clickedCard.matched) {
      setCards((prevCards) =>
        prevCards.map((c) =>
          c.id === clickedCard.id ? { ...c, flipped: true } : c
        )
      );

      firstPick ? setSecondPick(clickedCard) : setFirstPick(clickedCard);
    }
  };

  const resetTurn = (): void => {
    setFirstPick(null);
    setSecondPick(null);
    setDisabled(false);
    setCards((prevCards) =>
      prevCards.map((c) => (c.matched ? c : { ...c, flipped: false }))
    );
  };

  const restartGame = (): void => {
    setCards(shuffleCards());
    setWon(false);
    setLost(false);
    setTimeLeft(30);
  };

  return (
    <div className="game-container">
      <h2>Memory Match Game</h2>
      <div className="timer-container">
        <div className="timer-bar" style={{ width: `${(timeLeft / 30) * 100}%` }}></div>
        <div className="timer-text">{timeLeft}s</div>
      </div>

      {won ? (
        <div className="win-message">
          <p>🎉 You won the game!</p>
          <p>Don't worry, I'll take you out on the 14th of Feb for a date! 💖</p>
        </div>
      ) : lost ? (
        <div className="lose-message">
          <p>😢 Time's up! You lost!</p>
          <p>But hey, I'll still take you out on the 14th of Feb for a date! 💞</p>
        </div>
      ) : (
        <div className="game-board">
            {cards.map((c) => (
                <div
                key={c.id}
                className={`card ${c.flipped ? "flipped" : ""} ${c.matched ? "matched" : ""}`}
                onClick={() => handleCardClick(c)}
                >
                {}
                <div className="card-back"></div>  

                {}
                <div className="card-front">{c.emoji}</div>
                </div>
            ))}
        </div>

      )}

      <button onClick={restartGame}>Restart Game</button>
    </div>
  );
}

*/

/*
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
*/