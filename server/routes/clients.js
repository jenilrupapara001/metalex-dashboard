import express from 'express';
import Client from '../models/Client.js';

const router = express.Router();

/**
 * CREATE client
 */
router.post('/', async (req, res) => {
  try {
    const client = new Client(req.body);
    await client.save();
    res.status(201).json({ success: true, data: client });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * GET all clients
 */
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const clients = await Client.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('invoices');

    const total = await Client.countDocuments();

    res.json({
      success: true,
      data: clients,
      pagination: { total, page: parseInt(page), limit: parseInt(limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET single client
 */
router.get('/:id', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).populate('invoices');
    if (!client) {
      return res.status(404).json({ success: false, error: 'Client not found' });
    }
    res.json({ success: true, data: client });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * UPDATE client
 */
router.put('/:id', async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!client) {
      return res.status(404).json({ success: false, error: 'Client not found' });
    }
    res.json({ success: true, data: client });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * DELETE client
 */
router.delete('/:id', async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, error: 'Client not found' });
    }
    res.json({ success: true, message: 'Client deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
