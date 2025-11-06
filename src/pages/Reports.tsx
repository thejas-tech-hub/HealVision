import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FileText, AlertTriangle, Brain } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface AnalysisResult {
  summary: string;
  possibleCauses: string[];
  redFlags: string[];
  selfCareTips: string[];
  sources: string[];
}

interface Report {
  id: number;
  type: string;
  input: string;
  date: string;
  result: AnalysisResult;
}

const Reports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // 🔹 Load reports from browser localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("healthReports") || "[]");
    setReports(saved);
  }, []);

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-6">
          ← Back to Dashboard
        </Button>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Health Reports</h1>
        <p className="text-muted-foreground mb-6 text-lg">
          Your analysis history will appear here
        </p>
      </motion.div>

      {/* No reports yet */}
      {reports.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-20 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No reports yet.</h2>
          <p className="text-muted-foreground mb-4">
            Start a new analysis to see your health reports here.
          </p>
          <Button onClick={() => navigate("/analysis/new")}>Start New Analysis</Button>
        </Card>
      ) : (
        // Grid of report cards
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedReport(report)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{report.type}</CardTitle>
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <CardDescription className="text-sm text-muted-foreground">
                    {report.date}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {report.result.summary || "No summary available."}
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    View Full Report
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal — detailed view */}
      {selectedReport && (
        <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedReport.type}</DialogTitle>
              <DialogDescription>{selectedReport.date}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              {/* Summary */}
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" /> Summary
                </h3>
                <p className="text-muted-foreground mt-1">
                  {selectedReport.result.summary || "No summary available."}
                </p>
              </div>

              {/* Possible Causes */}
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" /> Possible Causes
                </h3>
                <ul className="list-disc list-inside text-muted-foreground mt-1">
                  {selectedReport.result.possibleCauses?.length
                    ? selectedReport.result.possibleCauses.map((c, i) => <li key={i}>{c}</li>)
                    : <li>No possible causes available.</li>}
                </ul>
              </div>

              {/* Red Flags */}
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-5 h-5" /> Red Flags
                </h3>
                <ul className="list-disc list-inside text-muted-foreground mt-1">
                  {selectedReport.result.redFlags?.length
                    ? selectedReport.result.redFlags.map((f, i) => <li key={i}>{f}</li>)
                    : <li>No red flags detected.</li>}
                </ul>
              </div>

              {/* Self-Care Tips */}
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  💡 Self-Care Tips
                </h3>
                <ul className="list-disc list-inside text-muted-foreground mt-1">
                  {selectedReport.result.selfCareTips?.length
                    ? selectedReport.result.selfCareTips.map((t, i) => <li key={i}>{t}</li>)
                    : <li>No self-care tips available.</li>}
                </ul>
              </div>

              {/* Sources */}
              <div>
                <h3 className="font-semibold text-lg">Sources</h3>
                <p className="text-muted-foreground mt-1">
                  {selectedReport.result.sources?.length
                    ? selectedReport.result.sources.join(", ")
                    : "No sources provided."}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Reports;
