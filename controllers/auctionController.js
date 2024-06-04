import asyncHandler from "express-async-handler";
import Vehicle from "../models/vehicleModal.js";
import Auction from "../models/auctionModel.js";

const addAuction = asyncHandler(async (req, res) => {
  const { bidstartprice, registerno, status, description, startDate, endDate } =
    req.body;

  const vehicle = await Vehicle.findOne({ registerno });
  if (!vehicle) {
    res.status(404);
    throw new Error("Vehicle not found");
  }

  if (vehicle.status === "Sold") {
    res.status(400).json({ message: "This vehicle is already sold" });
    return;
  }

  const auction = await Auction.create({
    bidstartprice,
    vehicleId: vehicle._id,
    status,
    description,
    startDate,
    endDate,
  });

  if (auction) {
    res.status(200).json({
      data: auction,
      message: "Auction Created Sucessfully",
    });
  } else {
    res.status(401);
    throw new Error("Invalid Auction Data");
  }
});

const getAllAuctions = asyncHandler(async (req, res) => {
  try {
    const auction = await Auction.find({});
    if (auction.length === 0) {
      return res.status(404).json({ message: "Auction Details is Empty !" });
    }
    res.status(200).json(auction);
  } catch (err) {
    console.error("Failed to fetch Auction from MongoDB:", err);
    res.status(500).json({ message: err.message });
  }
});

export { addAuction, getAllAuctions };