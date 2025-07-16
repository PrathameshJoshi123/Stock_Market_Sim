import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  Clock,
  LineChart,
  DollarSign,
  User,
  Trophy,
  BookOpen,
  GamepadIcon,
} from "lucide-react";

export function Navigation() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="bg-black/70 border border-cyan-500/30 rounded-lg p-1 mb-6 flex flex-wrap gap-1 shadow-[0_0_10px_rgba(0,255,255,0.15)]">
      <Link
        to="/dashboard"
        className={`flex-1 px-4 py-3 rounded flex items-center justify-center gap-2 transition-all duration-300 ${
          currentPath === "/dashboard"
            ? "bg-gradient-to-r from-cyan-600 to-cyan-500 text-black font-semibold shadow-lg"
            : "bg-black/60 text-cyan-400 hover:bg-black/40"
        }`}
      >
        <DollarSign
          className={`w-4 h-4 ${
            currentPath === "/dashboard" ? "text-black" : "text-cyan-400"
          }`}
        />
        <span>Dashboard</span>
      </Link>

      <Link
        to="/profile"
        className={`flex-1 px-4 py-3 rounded flex items-center justify-center gap-2 transition-all duration-300 ${
          currentPath === "/profile"
            ? "bg-gradient-to-r from-cyan-600 to-cyan-500 text-black font-semibold shadow-lg"
            : "bg-black/60 text-cyan-400 hover:bg-black/40"
        }`}
      >
        <User
          className={`w-4 h-4 ${
            currentPath === "/profile" ? "text-black" : "text-cyan-400"
          }`}
        />
        <span>Profile</span>
      </Link>

      <Link
        to="/competitions"
        className={`flex-1 px-4 py-3 rounded flex items-center justify-center gap-2 transition-all duration-300 ${
          currentPath === "/competitions"
            ? "bg-gradient-to-r from-cyan-600 to-cyan-500 text-black font-semibold shadow-lg"
            : "bg-black/60 text-cyan-400 hover:bg-black/40"
        }`}
      >
        <Trophy
          className={`w-4 h-4 ${
            currentPath === "/competitions" ? "text-black" : "text-cyan-400"
          }`}
        />
        <span>Competitions</span>
      </Link>

      <Link
        to="/learning"
        className={`flex-1 px-4 py-3 rounded flex items-center justify-center gap-2 transition-all duration-300 ${
          currentPath === "/learning"
            ? "bg-gradient-to-r from-cyan-600 to-cyan-500 text-black font-semibold shadow-lg"
            : "bg-black/60 text-cyan-400 hover:bg-black/40"
        }`}
      >
        <BookOpen
          className={`w-4 h-4 ${
            currentPath === "/learning" ? "text-black" : "text-cyan-400"
          }`}
        />
        <span>Learning</span>
      </Link>

      <Link
        to="/simulations"
        className={`flex-1 px-4 py-3 rounded flex items-center justify-center gap-2 transition-all duration-300 ${
          currentPath === "/simulations"
            ? "bg-gradient-to-r from-cyan-600 to-cyan-500 text-black font-semibold shadow-lg"
            : "bg-black/60 text-cyan-400 hover:bg-black/40"
        }`}
      >
        <GamepadIcon
          className={`w-4 h-4 ${
            currentPath === "/simulations" ? "text-black" : "text-cyan-400"
          }`}
        />
        <span>Simulations</span>
      </Link>
    </div>
  );
}
