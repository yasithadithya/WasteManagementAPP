const express = require('express');
const {
    getAllWasteBins,
    getWasteBinById, // Ensure this matches the function name in the controller
    createWasteBin,
    updateBinMaxCapacity, // Ensure this matches the function name in the controller
    deleteWasteBin,
    getWasteBinCount
} = require('../../controllers/wasteBin/wasteBinController');

const wasteBinRouter = express.Router();

// Define routes for wasteBinController
wasteBinRouter.get('/count', getWasteBinCount);
wasteBinRouter.get('/', getAllWasteBins);
wasteBinRouter.get('/:binID', getWasteBinById);
wasteBinRouter.post('/', createWasteBin);
wasteBinRouter.put('/:binID', updateBinMaxCapacity);
wasteBinRouter.delete('/:binID', deleteWasteBin);


module.exports = wasteBinRouter;