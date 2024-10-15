const mongoose = require('mongoose');

const WasteTransactionSchema = new mongoose.Schema({
    binId: { type: mongoose.Schema.Types.ObjectId, ref: 'WasteBin', required: true },  // Reference to waste bin
    weightAdded: { type: Number, required: true },  // Amount of waste added
    timestamp: { type: Date, default: Date.now },  // Time of disposal
    collected: { type: Boolean, default: false },  // If the waste was collected
});

module.exports = mongoose.model('WasteTransaction', WasteTransactionSchema);
