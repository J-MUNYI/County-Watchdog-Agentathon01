import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // In-memory store for demo purposes (should use Firestore for real persistence)
  const queries: any[] = [];
  const gazetteNotices = [
    {
      id: "1",
      title: "County Budget Amendment Bill 2026",
      date: "2026-05-10",
      summary: "Amendment to reallocate funds for rural electrification and water projects.",
      isBudgetRelated: true
    },
    {
      id: "2",
      title: "Public Procurement Notice - Roads",
      date: "2026-05-12",
      summary: "Tender for rehabilitation of ward-level infrastructure in Kileleshwa.",
      isBudgetRelated: true
    }
  ];

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "County Budget Watchdog" });
  });

  // SMS Gateway Callback (Mocking Africa's Talking)
  app.post("/api/sms/callback", (req, res) => {
    const { from, text } = req.body;
    console.log(`Received SMS from ${from}: ${text}`);
    
    const newQuery = {
      id: Date.now().toString(),
      sender: from,
      message: text,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    
    queries.push(newQuery);
    
    // In a real app, we would call Gemini here or queue a job
    res.json({ status: "received", message: "Query logged" });
  });

  app.get("/api/queries", (req, res) => {
    res.json(queries);
  });

  app.get("/api/gazette", (req, res) => {
    res.json(gazetteNotices);
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Watchdog backend running on http://localhost:${PORT}`);
  });
}

startServer();
