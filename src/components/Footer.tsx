import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/30 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span>Built with</span>
          <Heart className="w-4 h-4 text-destructive fill-destructive animate-pulse" />
          <span>by Team AlgoRythms @ Nexathon 2025</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
