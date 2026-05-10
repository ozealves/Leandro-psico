import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

async function startServer() {
  const app = express();
  const PORT = 3000;

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: "Muitas requisições deste IP, por favor tente novamente mais tarde."
  });

  app.use(helmet({
    contentSecurityPolicy: false,
  }));
  app.use(cors());
  app.use(express.json());
  app.use("/api/", limiter);

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "PsiFlow API is running" });
  });

  // Mock API for Patients
  let patients = [
    { id: "1", name: "Ana Silva", email: "ana@example.com", phone: "(11) 98765-4321", status: "ACTIVE", nextAppointment: "2026-04-12T14:00:00Z" },
    { id: "2", name: "Carlos Mendes", email: "carlos@example.com", phone: "(11) 91234-5678", status: "ACTIVE", nextAppointment: "2026-04-15T09:30:00Z" },
    { id: "3", name: "Beatriz Souza", email: "beatriz@example.com", phone: "(11) 99999-8888", status: "WAITING_LIST", nextAppointment: null },
  ];

  app.get("/api/patients", (req, res) => {
    res.json(patients);
  });

  app.post("/api/patients", (req, res) => {
    const newPatient = {
      id: String(patients.length + 1),
      ...req.body,
      nextAppointment: null
    };
    patients.push(newPatient);
    res.status(201).json(newPatient);
  });

  // Mock API for Appointments
  app.get("/api/appointments", (req, res) => {
    res.json([
      { id: "1", patientId: "1", patientName: "Ana Silva", patientPhone: "(11) 98765-4321", date: "2026-04-12T14:00:00Z", type: "INDIVIDUAL", modality: "IN_PERSON", status: "SCHEDULED" },
      { id: "2", patientId: "2", patientName: "Carlos Mendes", patientPhone: "(11) 91234-5678", date: "2026-04-15T09:30:00Z", type: "INDIVIDUAL", modality: "ONLINE", status: "CONFIRMED" },
      { id: "3", patientId: "1", patientName: "Ana Silva", patientPhone: "(11) 98765-4321", date: new Date().toISOString(), type: "INDIVIDUAL", modality: "IN_PERSON", status: "SCHEDULED" },
    ]);
  });

  // Mock API for Finance
  let transactions = [
    { id: "1", type: "INCOME", description: "Consulta - Ana Silva", amount: 250.00, date: new Date().toISOString(), status: "PAID", category: "APPOINTMENT" },
    { id: "2", type: "INCOME", description: "Consulta - Carlos Mendes", amount: 250.00, date: "2026-04-15T09:30:00Z", status: "PENDING", category: "APPOINTMENT" },
    { id: "3", type: "EXPENSE", description: "Aluguel Consultório", amount: 1500.00, date: "2026-04-05T10:00:00Z", status: "PAID", category: "PROPERTY" },
    { id: "4", type: "EXPENSE", description: "Internet", amount: 120.00, date: "2026-04-10T10:00:00Z", status: "PAID", category: "OFFICE" },
  ];

  app.get("/api/finance/transactions", (req, res) => {
    res.json(transactions);
  });

  app.post("/api/finance/transactions", (req, res) => {
    const newTransaction = {
      id: String(transactions.length + 1),
      ...req.body,
      date: req.body.date || new Date().toISOString()
    };
    transactions.push(newTransaction);
    res.status(201).json(newTransaction);
  });

  // Mock API for Records (Prontuários)
  let records = [
    { id: "1", patientId: "1", patientName: "Ana Silva", date: "2026-04-05T14:00:00Z", content: "Paciente relatou melhora nos sintomas de ansiedade. Aplicado GAD-7 com score 8 (leve).", psychologist: "Dr. Admin" },
    { id: "2", patientId: "2", patientName: "Carlos Mendes", date: "2026-04-08T09:30:00Z", content: "Primeira sessão. Realizada anamnese focada em histórico familiar e queixa principal (estresse no trabalho).", psychologist: "Dr. Admin" },
  ];

  app.get("/api/records", (req, res) => {
    res.json(records);
  });

  app.post("/api/records", (req, res) => {
    const newRecord = {
      id: String(records.length + 1),
      ...req.body,
      date: new Date().toISOString(),
      psychologist: "Dr. Admin"
    };
    records.unshift(newRecord); // Add to beginning
    res.status(201).json(newRecord);
  });

  // Vite middleware for development
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
