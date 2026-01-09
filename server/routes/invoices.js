import express from 'express';
import Invoice from '../models/Invoice.js';

const router = express.Router();

/**
 * CREATE invoice
 */
router.post('/', async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    await invoice.save();
    res.status(201).json({ success: true, data: invoice });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * GET all invoices with pagination
 */
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, clientName } = req.query;
    let query = {};

    if (status) query.status = status;
    if (clientName) query.clientName = { $regex: clientName, $options: 'i' };

    const skip = (page - 1) * limit;
    const invoices = await Invoice.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Invoice.countDocuments(query);

    res.json({
      success: true,
      data: invoices,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET single invoice
 */
router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ success: false, error: 'Invoice not found' });
    }
    res.json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET invoice by invoice number
 */
router.get('/number/:invoiceNumber', async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ invoiceNumber: req.params.invoiceNumber });
    if (!invoice) {
      return res.status(404).json({ success: false, error: 'Invoice not found' });
    }
    res.json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * UPDATE invoice
 */
router.put('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!invoice) {
      return res.status(404).json({ success: false, error: 'Invoice not found' });
    }
    res.json({ success: true, data: invoice });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * DELETE invoice
 */
router.delete('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) {
      return res.status(404).json({ success: false, error: 'Invoice not found' });
    }
    res.json({ success: true, message: 'Invoice deleted', data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * UPDATE invoice status
 */
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!invoice) {
      return res.status(404).json({ success: false, error: 'Invoice not found' });
    }
    res.json({ success: true, data: invoice });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * SEARCH invoices
 */
router.get('/search/query', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, error: 'Query parameter required' });
    }

    const invoices = await Invoice.find({
      $or: [
        { invoiceNumber: { $regex: q, $options: 'i' } },
        { clientName: { $regex: q, $options: 'i' } },
        { clientAddress: { $regex: q, $options: 'i' } },
      ],
    }).limit(10);

    res.json({ success: true, data: invoices });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
