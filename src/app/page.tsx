import Link from "next/link";
import "../styles/home.css";  // ✅ Import the page-specific CSS

export default function Home() {
  return (
    <div className="home-container">
      <h1>Sip, Laugh, Match 🍷💗</h1>
      <Link href="/game">
        <button>Start Game 🎮</button>
      </Link>
    </div>
  );
}

/*
import Link from "next/link";
import "../styles/globals.css";

export default function Home() {
  return (
    <div className="home-container">
      <h1>💖 Valentines Memory Game 💖</h1>
      <Link href="/game">
        <button>Start Game 🎮</button>
      </Link>
    </div>
  );
}
*/


/*
import MemoryGame from "@/components/MemoryGame"; // Ensure the correct import path
import "@/styles/game.css"; // Import your game styles

export default function Home() {
  return <MemoryGame />;
}
*/