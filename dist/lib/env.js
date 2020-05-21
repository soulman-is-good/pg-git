'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const CWD = process.cwd();
module.exports = (filepath) => {
    const ENV_FILE = filepath || path_1.default.join(CWD, '.env');
    if (fs_1.default.existsSync(ENV_FILE)) {
        dotenv_1.default.config({ path: ENV_FILE });
    }
    else {
        dotenv_1.default.config();
    }
};
//# sourceMappingURL=env.js.map