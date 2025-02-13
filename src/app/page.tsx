
import Link from "next/link";
import "../styles/globals.css";

export default function Home() {
  return (
    <div className="home-container">
      <h1>💖 Valentine's Memory Game 💖</h1>
      <Link href="/game">
        <button>Start Game 🎮</button>
      </Link>
    </div>
  );
}


/*
import MemoryGame from "@/components/MemoryGame"; // Ensure the correct import path
import "@/styles/game.css"; // Import your game styles

export default function Home() {
  return <MemoryGame />;
}
*/