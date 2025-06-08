"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const framer_motion_1 = require("framer-motion");
const PageTransition = ({ children }) => {
    return (<framer_motion_1.AnimatePresence mode="wait">
      <framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{
            type: "spring",
            stiffness: 260,
            damping: 20
        }}>
        {children}
      </framer_motion_1.motion.div>
    </framer_motion_1.AnimatePresence>);
};
exports.default = PageTransition;
