const express = require('express');
const {
    getAllWasteBins,
    getWasteBinById, // Ensure this matches the function name in the controller
    createWasteBin,
    updateBinMaxCapacity, // Ensure this matches the function name in the controller
    deleteWasteBin,
    getWasteBinCount,
    assignWasteBinToResident,
    getWasteBinsByResident,
    searchAvailableWasteBins
} = require('../../controllers/wasteBin/wasteBinController');

const wasteBinRouter = express.Router();

// Define routes for wasteBinController
wasteBinRouter.get('/count', getWasteBinCount);
// In wasteBinRouter.js

wasteBinRouter.get('/search', searchAvailableWasteBins); // Route to search for available waste bins

wasteBinRouter.get('/:residentId', getWasteBinsByResident);
wasteBinRouter.get('/', getAllWasteBins);
wasteBinRouter.get('/:binID', getWasteBinById);
wasteBinRouter.post('/', createWasteBin);
wasteBinRouter.post('/assignOwner',(req,res,next)=>{
    console.log("route hit");
    next();
}, assignWasteBinToResident);
wasteBinRouter.put('/:binID', updateBinMaxCapacity);
wasteBinRouter.delete('/:binID', deleteWasteBin);



module.exports = wasteBinRouter;