import { Router } from 'express';
import VotingTable, { IVotingTable } from '../models/VotingTable';
import Settings from '../models/Settings';

const router = Router();

// Get all voting tables with party details
router.get('/', async (req, res) => {
  try {
    const tables = await VotingTable.find().populate('votes.party', 'name color');
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching voting tables', error });
  }
});

// Get councilor calculation
router.get('/councilors', async (req, res) => {
  try {
    const tables = await VotingTable.find().populate('votes.party', 'name color');
    const settings = await Settings.findOne();
    
    if (!settings) {
      return res.status(500).json({ message: 'Settings not found' });
    }
    
    const votesPerCouncilor = settings.votesPerCouncilor || 1000;
    
    // Calculate total votes per party
    const partyVotes = new Map();
    let totalVotes = 0;

    tables.forEach(table => {
      table.votes.forEach(vote => {
        const partyId = vote.party._id.toString();
        const currentCount = partyVotes.get(partyId) || {
          party: vote.party,
          votes: 0
        };
        currentCount.votes += vote.votes;
        partyVotes.set(partyId, currentCount);
        totalVotes += vote.votes;
      });
    });

    // Convert to array and calculate councilors
    let results = Array.from(partyVotes.values())
      .map(item => ({
        party: item.party,
        votes: item.votes,
        percentage: totalVotes > 0 ? (item.votes / totalVotes) * 100 : 0,
        councilors: Math.floor(item.votes / votesPerCouncilor),
        votesPerCouncilor: votesPerCouncilor,
        remainder: item.votes % votesPerCouncilor // Store remainder for tie-breaking
      }))
      .sort((a, b) => b.councilors - a.councilors);

    // Get total councilors from settings
    const appSettings = await Settings.findOne() || { totalCouncilors: 8 };
    const TOTAL_COUNCILLORS = appSettings.totalCouncilors || 8;
    
    // Reset all councilors to 0 and start fresh distribution
    results.forEach(party => {
      party.councilors = 0;
    });
    
    // Create a copy of the results to work with
    const parties = results.map((party, index) => ({
      ...party,
      index,
      quotient: party.votes, // Initial quotient is the total votes
      seatNumber: 1          // Next seat number to calculate quotient for
    }));
    
    // Distribute all 8 seats
    for (let seat = 0; seat < TOTAL_COUNCILLORS; seat++) {
      // Find party with highest quotient
      let maxQuotient = -1;
      let selectedPartyIndex = -1;
      
      parties.forEach((party, idx) => {
        // Calculate quotient for next seat: votes / (seats + 1)
        const quotient = party.votes / (party.councilors + 1);
        parties[idx].quotient = quotient;
        
        if (quotient > maxQuotient) {
          maxQuotient = quotient;
          selectedPartyIndex = idx;
        }
      });
      
      // Assign seat to the party with highest quotient
      if (selectedPartyIndex >= 0) {
        parties[selectedPartyIndex].councilors++;
        parties[selectedPartyIndex].seatNumber++;
      }
    }
    
    // Update the original results with the calculated councilors
    parties.forEach(party => {
      results[party.index].councilors = party.councilors;
    });
    
    // Sort final results by number of councilors
    results = results.sort((a, b) => b.councilors - a.councilors);
    
    res.json({
      success: true,
      results: results,
      votesPerCouncilor: votesPerCouncilor,
      totalCouncilors: TOTAL_COUNCILLORS
    });
  } catch (error) {
    console.error('Error calculating councilors:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: 'Error calculating councilors', error: errorMessage });
  }
});

// Get voting results summary
router.get('/results', async (req, res) => {
  try {
    const tables = await VotingTable.find().populate('votes.party', 'name color');
    
    // Calculate total votes per party
    const partyVotes = new Map();
    let totalVotes = 0;

    tables.forEach(table => {
      table.votes.forEach(vote => {
        const partyId = vote.party._id.toString();
        const currentCount = partyVotes.get(partyId) || {
          party: vote.party,
          votes: 0
        };
        currentCount.votes += vote.votes;
        partyVotes.set(partyId, currentCount);
        totalVotes += vote.votes;
      });
    });

    // Convert to array and add percentages
    const results = Array.from(partyVotes.values()).map(item => ({
      party: item.party,
      votes: item.votes,
      percentage: totalVotes > 0 ? (item.votes / totalVotes) * 100 : 0
    }));

    res.json({
      totalVotes,
      results
    });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating results', error });
  }
});

// Create a new voting table
router.post('/', async (req, res) => {
  try {
    const { tableNumber, location, votes } = req.body;
    const newTable = new VotingTable({ tableNumber, location, votes });
    await newTable.save();
    const populatedTable = await VotingTable.findById(newTable._id).populate('votes.party', 'name color');
    res.status(201).json(populatedTable);
  } catch (error) {
    res.status(400).json({ message: 'Error creating voting table', error });
  }
});

// Update a voting table
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTable = await VotingTable.findByIdAndUpdate(
      id, 
      req.body, 
      { new: true }
    ).populate('votes.party', 'name color');
    
    if (!updatedTable) {
      return res.status(404).json({ message: 'Voting table not found' });
    }
    
    res.json(updatedTable);
  } catch (error) {
    res.status(400).json({ message: 'Error updating voting table', error });
  }
});

// Delete a voting table
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTable = await VotingTable.findByIdAndDelete(id);
    if (!deletedTable) {
      return res.status(404).json({ message: 'Voting table not found' });
    }
    res.json({ message: 'Voting table deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting voting table', error });
  }
});

export default router;
