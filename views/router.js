import express from "express";
import sessionController from "../controllers/sessionController.js";
import quiverController from "../controllers/quiverController.js";
import locationsController from "../controllers/locationsController.js";
import boardsController from "../controllers/boardsController.js";
import settingsController from "../controllers/settingsController.js";

const Router = express.Router();

// Quiver routes
Router.route("/quiver")
  .get(quiverController.getQuiver)
  .post(quiverController.addKite)
  .delete(quiverController.removeKite);

// Locations routes
Router.route("/locations")
  .get(locationsController.getLocations)
  .post(locationsController.addLocation)
  .delete(locationsController.removeLocation);

// Boards routes
Router.route("/boards")
  .get(boardsController.getBoards)
  .post(boardsController.addBoard)
  .delete(boardsController.removeBoard);

// Settings routes
Router.route("/settings/wind-unit")
  .get(settingsController.getWindUnit)
  .post(settingsController.setWindUnit);

Router.route("/settings/speed-unit")
  .get(settingsController.getSpeedUnit)
  .post(settingsController.setSpeedUnit);

// Session routes
Router.route("/sessions")
  .get(sessionController.getAllSessions)
  .post(sessionController.createSession);

Router.route("/sessions/:id")
  .get(sessionController.getSessionById)
  .put(sessionController.updateSessionById)
  .delete(sessionController.deleteSessionById);

export default Router;