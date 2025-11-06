import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 hover:scale-105">
            <img src="/logo.png" alt="HealVision Logo" className="w-10 h-10" />
            <span className="text-xl font-bold text-foreground">HealVision Insight</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
