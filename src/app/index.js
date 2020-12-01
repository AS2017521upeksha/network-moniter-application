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
var si = require("systeminformation");
var uri = 'mongodb+srv://upeksha:qxUcHnRAvzV4jZIl@pcnetworkmonitor.bdsx2.mongodb.net/<monitor_data>?retryWrites=true&w=majority';
var client = new mongodb_1.MongoClient(uri);
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var Error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, 5, 6]);
                    return [4 /*yield*/, client.connect()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, iteartion()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 3:
                    Error_1 = _a.sent();
                    console.log('end');
                    return [4 /*yield*/, getIP(function (ip_address, iface) {
                            var item = {
                                ip_address: ip_address,
                                network_interface: iface,
                                tx_packets: 0,
                                rx_packets: 0,
                                status: 'SHUT DOWN',
                                time: new Date(Date.now())
                            };
                            updateListingByIp(client, item);
                        })];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    console.log('end');
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
process.on('exit', function () {
    process.nextTick(function () {
        console.log('This will not run');
    });
    console.log('About to exit.');
});
main()["catch"](console.error);
function iteartion() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getIP(function (ip_address, iface) {
                        getNetworkStat(iface, function (tx_packets, rx_packets) {
                            var item = {
                                ip_address: ip_address,
                                network_interface: iface,
                                tx_packets: tx_packets,
                                rx_packets: rx_packets,
                                status: 'CONNECTED',
                                time: new Date(Date.now())
                            };
                            updateListingByIp(client, item);
                            setInterval(iteartion, 5000);
                        });
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function getIP(callback) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            si.networkInterfaces()
                .then(function (data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].iface === 'WiFi' || data[i].iface === 'Ethernet') {
                        callback(data[i].ip4, data[i].iface);
                    }
                }
            });
            return [2 /*return*/];
        });
    });
}
function getNetworkStat(iface, callback) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            si.networkStats(iface)
                .then(function (data) {
                var tx_bytes = data[0].tx_sec;
                var rx_bytes = data[0].rx_sec;
                callback(tx_bytes, rx_bytes);
            });
            return [2 /*return*/];
        });
    });
}
function updateListingByIp(client, updatedItem) {
    var result = client.db("monitor_data").collection("dataSchema")
        .updateOne({ ip_address: updatedItem.ip_address }, { $set: updatedItem }, { upsert: true });
}
