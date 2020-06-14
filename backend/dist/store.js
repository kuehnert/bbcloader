"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootReducer = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const availableSlice_1 = __importDefault(require("./features/available/availableSlice"));
exports.rootReducer = toolkit_1.combineReducers({
    available: availableSlice_1.default,
});
const store = toolkit_1.configureStore({
    devTools: process.env.NODE_ENV !== "production",
    reducer: exports.rootReducer,
});
exports.default = store;
//# sourceMappingURL=store.js.map