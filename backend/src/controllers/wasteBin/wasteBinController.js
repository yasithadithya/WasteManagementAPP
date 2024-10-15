const WasteBin = require('../../models/WasteBin/wasteBin');

// Helper function to generate unique bin ID (BIN + 4 digit random number)
const generateBinID = () => {
    return 'BIN' + Math.floor(1000 + Math.random() * 9000);
};

// Add a new waste bin
exports.createWasteBin = async (req, res) => {
    try {
        const { binType, maxWeight } = req.body;

        // Generate a unique bin ID
        const uniqueBinID = generateBinID();

        // Create a new waste bin entry
        const wasteBin = await WasteBin.create({
            binID: uniqueBinID,
            binType,
            maxWeight
        });
        res.status(201).json({ 
            status: 'success',
            data: wasteBin,
            message: 'Waste bin created successfully'
        });
    } catch (err) {
        res.status(400).json({ message: 'Error creating waste bin', error: err });
        console.log(err);
    }
};

// Get all waste bins
exports.getAllWasteBins = async (req, res) => {
    try {
        // Find all waste bins
        const wasteBins = await WasteBin.find();
        res.status(200).json({ wasteBins });
    } catch (err) {

        res.status(500).json({ message: 'Error getting waste bins', error: err });
    }
};

// Get a waste bin by its unique bin ID
exports.getWasteBinById = async (req, res) => {
    try {
        const { binID } = req.params;

        // Find the waste bin by its unique bin ID
        const wasteBin = await WasteBin.findOne({ binID });

        if (!wasteBin) {
            return res.status(404).json({ message: 'Waste bin not found' });
        }

        res.status(200).json({ wasteBin });
    } catch (err) {
        res.status(500).json({ message: 'Error getting waste bin', error: err });
    }
};

// Delete a waste bin by its unique bin ID
exports.deleteWasteBin = async (req, res) => {
    try {
        const { binID } = req.params;

        // Find the waste bin by its unique bin ID and delete it
        const deletedBin = await WasteBin.findOneAndDelete({ binID });

        if (!deletedBin) {
            return res.status(404).json({ message: 'Waste bin not found' });
        }

        res.status(200).json({ message: 'Waste bin deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting waste bin', error: err });
    }
};

// Update the max capacity of a bin by its unique ID
exports.updateBinMaxCapacity = async (req, res) => {
    try {
        const { binId } = req.params; // Get binId from the request parameters
        const { maxWeight } = req.body; // New maxWeight to be set

        // Find the bin by its unique ID and update the max weight
        const updatedBin = await WasteBin.findOneAndUpdate(
            { binId },
            { maxWeight },
            { new: true } // Return the updated bin
        );

        if (!updatedBin) {
            return res.status(404).json({ message: 'Waste bin not found' });
        }

        res.status(200).json({ message: 'Max capacity updated successfully', bin: updatedBin });
    } catch (error) {
        res.status(500).json({ message: 'Error updating max capacity', error });
    }
};
