"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// URI di connessione da variabile d'ambiente
const URI = process.env.ATLAS_URI || "";
console.log("URI:", URI);
function connectToDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connessione al database
            yield mongoose_1.default.connect(URI, {
                serverSelectionTimeoutMS: 5000, // Timeout per selezionare un server
            });
            console.log("Successfully connected to MongoDB using Mongoose!");
        }
        catch (err) {
            console.error("Error connecting to MongoDB:", err);
            process.exit(1); // Esce in caso di errore critico
        }
    });
}
// Inizializza la connessione
connectToDatabase();
exports.default = mongoose_1.default;
