import { Router } from 'express';
import Settings from '../models/Settings';

const router = Router();

// Get current settings
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = new Settings({
        votesPerCouncilor: 1000,
        totalCouncilors: 8
      });
      await settings.save();
    }
    
    res.json({
      votesPerCouncilor: settings.votesPerCouncilor,
      totalCouncilors: settings.totalCouncilors
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Error fetching settings' });
  }
});

// Update settings
router.put('/', async (req, res) => {
  try {
    const { votesPerCouncilor, totalCouncilors } = req.body;
    
    if (typeof votesPerCouncilor !== 'number' || votesPerCouncilor <= 0) {
      return res.status(400).json({ message: 'Votes per councilor must be a positive number' });
    }
    
    if (typeof totalCouncilors !== 'number' || totalCouncilors <= 0) {
      return res.status(400).json({ message: 'Total councilors must be a positive number' });
    }

    const settings = await Settings.findOneAndUpdate(
      {},
      { votesPerCouncilor, totalCouncilors },
      { new: true, upsert: true }
    );
    
    res.json(settings);
  } catch (error) {
    res.status(400).json({ message: 'Error updating settings', error });
  }
});

export default router;
