import React from "react";
import Nav from "../Nav/Nav";
import { AnimatePresence, motion } from "framer-motion";

const MobileNav = () => {
  return (
    <AnimatePresence>
      <motion.nav
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="nav-mob--container"
      >
        <div className="nav-mob--items">
          <Nav />
        </div>
      </motion.nav>
    </AnimatePresence>
  );
};

export default MobileNav;
