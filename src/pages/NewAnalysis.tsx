import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { analyzeText, analyzeImage, AnalysisResult } from "@/lib/api";
import { motion } from "framer-motion";

const NewAnalysis = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [allergies, setAllergies] = useState("");
  const [symptomsText, setSymptomsText] = useState("");
  const [language, setLanguage] = useState("English");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  // --- Image selection preview ---
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // --- Save to localStorage for Health Reports ---
  const saveReportToLocal = (data: AnalysisResult, type: string, input: string) => {
    const reports = JSON.parse(localStorage.getItem("healthReports") || "[]");
    const newReport = {
      id: Date.now(),
      type,
      input,
      date: new Date().toLocaleString(),
      result: data,
    };
    reports.unshift(newReport);
    localStorage.setItem("healthReports", JSON.stringify(reports));
  };

  // --- Text Analysis ---
  const handleTextAnalysis = async () => {
    if (!age || !gender || !symptomsText) {
      toast({
        title: "Missing information",
        description: "Please fill in age, gender, and symptoms",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = await analyzeText({
        age: parseInt(age),
        gender,
        allergies,
        symptomsText,
        targetLanguage: language,
      });

      setResult(data);
      saveReportToLocal(data, "Text Analysis", symptomsText);
    } catch (error) {
      console.error("❌ Text analysis failed:", error);
      toast({
        title: "Error",
        description: "Failed to analyze symptoms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // --- Image Analysis ---
  const handleImageAnalysis = async () => {
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please upload an image first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = await analyzeImage({
        image: selectedImage,
        targetLanguage: language,
      });

      setResult(data);
      saveReportToLocal(data, "Image Analysis", selectedImage.name);
    } catch (error) {
      console.error("❌ Image analysis failed:", error);
      toast({
        title: "Error",
        description: "Failed to analyze image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-4">
          ← Back to Dashboard
        </Button>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          New Health Analysis
        </h1>
        <p className="text-muted-foreground text-lg">
          Choose how you'd like to provide your health information
        </p>
      </motion.div>

      {/* Input Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* --- Text Analysis --- */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-border hover:shadow-lg transition-shadow h-full">
            <CardHeader className="space-y-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center shadow-md">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl mb-2">Type Your Symptoms</CardTitle>
                <CardDescription className="text-base">
                  Describe your symptoms in text for analysis
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Enter your age" />
              
              <Label htmlFor="gender">Gender</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger id="gender"><SelectValue placeholder="Select gender" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>

              <Label htmlFor="allergies">Allergies (Optional)</Label>
              <Input id="allergies" value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="Any known allergies" />

              <Label htmlFor="symptoms">Symptoms</Label>
              <Textarea id="symptoms" value={symptomsText} onChange={(e) => setSymptomsText(e.target.value)} placeholder="Describe your symptoms in detail..." className="min-h-[120px]" />

              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={handleTextAnalysis} disabled={isLoading} className="w-full" size="lg">
                {isLoading ? "Analyzing..." : "Analyze Symptoms"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* --- Image Analysis --- */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <Card className="border-border hover:shadow-lg transition-shadow h-full">
            <CardHeader className="space-y-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl mb-2">Photo/X-ray Upload</CardTitle>
                <CardDescription className="text-base">
                  Upload medical images or X-rays for AI analysis
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label htmlFor="image">Upload Image</Label>
              <Input id="image" type="file" accept="image/*" onChange={handleImageSelect} />

              {imagePreview && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4"
                >
                  <Label>Preview</Label>
                  <img src={imagePreview} alt="Preview" className="w-full max-w-xs h-48 object-cover rounded-lg border border-border mt-2 shadow-sm" />
                </motion.div>
              )}

              <Label htmlFor="image-language">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="image-language"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={handleImageAnalysis} disabled={isLoading || !selectedImage} className="w-full" size="lg">
                {isLoading ? "Analyzing..." : "Analyze Image"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* --- Analysis Results --- */}
      {result && (
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
          <Card className="border-border shadow-lg">
            <CardHeader><CardTitle className="text-2xl">Analysis Results</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Summary</h3>
                <p className="text-muted-foreground">
                  {result.summary || result.analysis || "No summary available."}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Possible Causes (Non-Diagnostic)</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {result.possibleCauses?.length
                    ? result.possibleCauses.map((cause, idx) => <li key={idx}>{cause}</li>)
                    : <li>No possible causes available.</li>}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-destructive">Red Flags</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {result.redFlags?.length
                    ? result.redFlags.map((flag, idx) => <li key={idx}>{flag}</li>)
                    : <li>No red flags detected.</li>}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Self-Care Tips</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {result.selfCareTips?.length
                    ? result.selfCareTips.map((tip, idx) => <li key={idx}>{tip}</li>)
                    : <li>No self-care tips available.</li>}
                </ul>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  <strong>Sources:</strong>{" "}
                  {result.sources?.length ? result.sources.join(", ") : "No sources provided."}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default NewAnalysis;
