import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import invoiceRoutes from './routes/invoices.js';
import clientRoutes from './routes/clients.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/metalex-saas';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/invoices', invoiceRoutes);
app.use('/api/clients', clientRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ success: false, error: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Database connection
const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ MongoDB connected successfully');
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
    console.log(`✓ API endpoints:`);
    console.log(`  GET    /api/invoices`);
    console.log(`  POST   /api/invoices`);
    console.log(`  GET    /api/invoices/:id`);
    console.log(`  PUT    /api/invoices/:id`);
    console.log(`  DELETE /api/invoices/:id`);
    console.log(`  GET    /api/clients`);
    console.log(`  POST   /api/clients`);
  });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

export default app;
