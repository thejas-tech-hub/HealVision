import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileImage, MessageSquare, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";

const Dashboard = () => {
  const navigate = useNavigate();

  const tiles = [
    {
      icon: FileImage,
      title: "New Analysis",
      description: "Upload medical images or describe symptoms",
      onClick: () => navigate("/analysis/new"),
      gradient: "from-primary to-primary/80",
    },
    {
      icon: MessageSquare,
      title: "AI Doctor Chat",
      description: "Chat with AI for health guidance",
      onClick: () => navigate("/chat"),
      gradient: "from-secondary to-secondary/80",
    },
    {
      icon: FileText,
      title: "Health Reports",
      description: "View your analysis history",
      onClick: () => navigate("/reports"),
      gradient: "from-accent to-accent/80",
    },
  ];

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Welcome to HealVision
        </h1>
        <p className="text-muted-foreground text-lg">
          Choose an option below to get started with your health analysis
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { value: "24", label: "Total Analyses", color: "text-primary" },
          { value: "12", label: "Consultations", color: "text-secondary" },
          { value: "Today", label: "Last Visit", color: "text-accent" },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
          >
            <Card className="border-border hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Action Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {tiles.map((tile, index) => (
          <motion.div
            key={index}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 + index * 0.15 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className="group cursor-pointer transition-all duration-300 hover:shadow-xl border-border h-full"
              onClick={tile.onClick}
            >
              <CardHeader className="space-y-4">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${tile.gradient} flex items-center justify-center shadow-md group-hover:shadow-xl transition-all group-hover:scale-110`}>
                  <tile.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl mb-2">{tile.title}</CardTitle>
                  <CardDescription className="text-base">{tile.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full group-hover:bg-primary/5 transition-colors">
                  Get Started →
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Medical Disclaimer */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <Alert className="border-muted-foreground/20 bg-muted/30">
          <AlertCircle className="h-5 w-5 text-muted-foreground" />
          <AlertDescription className="text-sm text-muted-foreground ml-2">
            <strong className="text-foreground">Disclaimer:</strong> General information only. Not a medical diagnosis. 
            Seek professional care for urgent symptoms.
          </AlertDescription>
        </Alert>
      </motion.div>
    </div>
  );
};

export default Dashboard;
