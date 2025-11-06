import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Heart } from "lucide-react";
import { motion } from "framer-motion";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-theme(spacing.16))] flex flex-col relative overflow-hidden">
      {/* Floating Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-glow" />
      </div>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-12 md:py-20 relative z-10">
        <div className="container max-w-5xl mx-auto text-center space-y-8">
          {/* Logo/Icon */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
            className="flex justify-center"
          >
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-2xl">
              <Heart className="w-16 h-16 text-primary-foreground" />
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              AI-Powered Health Analysis
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mt-2">
                At Your Fingertips
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload medical images, chat with AI doctors, and get instant health insights. 
              Your personal healthcare assistant powered by advanced AI technology.
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-4"
          >
            <Button
              onClick={() => navigate("/dashboard")}
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all shadow-lg hover:shadow-2xl hover:scale-105 text-lg px-10 py-7 rounded-xl group"
            >
              Start Your Health Journey
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4 pt-8"
          >
            {[
              { icon: Shield, text: "Secure & Private", color: "text-primary" },
              { icon: Zap, text: "Instant Results", color: "text-secondary" },
              { icon: Heart, text: "AI-Powered Care", color: "text-destructive" },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-card border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <feature.icon className={`w-4 h-4 ${feature.color}`} />
                <span className="text-sm font-medium text-foreground">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
