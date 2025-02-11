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
