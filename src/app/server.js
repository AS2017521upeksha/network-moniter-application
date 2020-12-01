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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var mongodb_1 = require("mongodb");
var uri = 'mongodb+srv://upeksha:qxUcHnRAvzV4jZIl@pcnetworkmonitor.bdsx2.mongodb.net/<monitor_data>?retryWrites=true&w=majority';
var client = new mongodb_1.MongoClient(uri);
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var Error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, client.connect()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, iteartion()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    Error_1 = _a.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
main()["catch"](console.error);
function iteartion() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            getAll(function (all_working_pcs, all_connected_pcs, all_disconnected_pcs) {
                console.log(all_working_pcs);
                console.log(all_connected_pcs);
                console.log(all_disconnected_pcs);
                setInterval(iteartion, 30000);
            });
            return [2 /*return*/];
        });
    });
}
function getAll(callback) {
    return __awaiter(this, void 0, void 0, function () {
        var t, now_t, cursor, cursor_1, disconnected, results, results_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    t = new Date();
                    t.setSeconds(t.getSeconds() - 30);
                    now_t = new Date(Date.now());
                    cursor = client.db("monitor_data").collection("dataSchema").find({ status: 'CONNECTED' }).sort({ time: -1 });
                    cursor_1 = client.db("monitor_data").collection("dataSchema").find({ status: 'CONNECTED',
                        time: { $gte: t, $lte: now_t } }).sort({ time: -1 });
                    disconnected = [];
                    return [4 /*yield*/, cursor.toArray()];
                case 1:
                    results = _a.sent();
                    return [4 /*yield*/, cursor_1.toArray()];
                case 2:
                    results_1 = _a.sent();
                    if (results.length !== results_1.length) {
                        results.forEach(function (result_1) {
                            if (!(results_1.some(function (result) { return result.ip_address === result_1.ip_address; }))) {
                                disconnected.push(result_1);
                            }
                        });
                    }
                    callback(results, results_1, disconnected);
                    return [2 /*return*/];
            }
        });
    });
}
