import { Router } from 'express';
import Party, { IParty } from '../models/Party';

const router = Router();

// Get all parties
router.get('/', async (req, res) => {
  try {
    const parties = await Party.find();
    res.json(parties);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching parties', error });
  }
});

// Create a new party
router.post('/', async (req, res) => {
  try {
    const { name, color, voteThreshold } = req.body;
    const newParty = new Party({ 
      name, 
      color, 
      voteThreshold: voteThreshold || 0 
    });
    await newParty.save();
    res.status(201).json(newParty);
  } catch (error) {
    res.status(400).json({ message: 'Error creating party', error });
  }
});

// Update a party
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedParty = await Party.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedParty) {
      return res.status(404).json({ message: 'Party not found' });
    }
    res.json(updatedParty);
  } catch (error) {
    res.status(400).json({ message: 'Error updating party', error });
  }
});

// Delete a party
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedParty = await Party.findByIdAndDelete(id);
    if (!deletedParty) {
      return res.status(404).json({ message: 'Party not found' });
    }
    res.json({ message: 'Party deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting party', error });
  }
});

export default router;
