"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAvailable = exports.loadAvailable = exports.loadAvailableSuccess = exports.fetchAvailableSuccess = exports.availableSlice = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const availableFilename = path_1.default.join(__dirname, "..", "..", "data", "available.json");
const groupId = "p05pn9jr";
const url = `http://ibl.api.bbci.co.uk/ibl/v1/groups/${groupId}/episodes`;
const qs = {
    rights: "web",
    page: 1,
    per_page: 200,
    initial_child_count: 1,
    availability: "available",
};
const oneDay = 1000 * 60 * 60 * 24;
;
;
const initialState = {
    lastCheck: new Date("2020-01-01").getTime(),
    available: [],
};
exports.availableSlice = toolkit_1.createSlice({
    name: "available",
    initialState,
    reducers: {
        loadAvailableSuccess(state, action) {
            const { available, lastCheck } = action.payload;
            state.available = available;
            state.lastCheck = lastCheck;
        },
        fetchAvailableSuccess(state, action) {
            const { available, lastCheck } = action.payload;
            state.available = available;
            state.lastCheck = lastCheck;
        }
    },
});
_a = exports.availableSlice.actions, exports.fetchAvailableSuccess = _a.fetchAvailableSuccess, exports.loadAvailableSuccess = _a.loadAvailableSuccess;
exports.default = exports.availableSlice.reducer;
exports.loadAvailable = () => async (dispatch, getState) => {
    let available;
    let lastCheck;
    // 1. load file if present, else start with empty array;
    try {
        const buffer = fs_1.default.readFileSync(availableFilename);
        available = JSON.parse(buffer.toString());
        if (available.length > 0) {
            lastCheck = available[0].addedOn;
        }
        else {
            lastCheck = new Date("2020-01-01").getTime();
        }
    }
    catch (error) {
        available = [];
    }
    // 2. check if we need to fetch new data: more than 1 day ago
    if (getState().lastCheck + oneDay < new Date().getTime()) {
    }
    try {
    }
    catch (error) {
        console.error(error);
        return;
    }
    dispatch(exports.loadAvailableSuccess({ available, lastCheck }));
};
exports.fetchAvailable = () => async (dispatch, getState) => {
    let available;
    // 1. load file if present, else start with empty array;
    try {
        const buffer = fs_1.default.readFileSync(availableFilename);
        available = JSON.parse(buffer.toString());
    }
    catch (error) {
        available = [];
    }
    // 2. check if we need to fetch new data: more than 1 day ago
    if (getState().lastCheck + oneDay < new Date().getTime()) {
    }
    try {
    }
    catch (error) {
        console.error(error);
        return;
    }
    dispatch(exports.fetchAvailableSuccess(available));
};
// const saveAvailable = (available) => {
//   fs.writeFileSync(availableFilename, JSON.stringify(available));
// };
//# sourceMappingURL=availableSlice.js.map