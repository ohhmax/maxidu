/* ==============================================================================
   MAXNET OS MODULE: ROOT TERMINAL
   Integrated xterm.js root shell emulator and WebSocket ttyd session manager
   Engineered & Developed by Mahendra Mali - Max (c) 2026
   Donation & Support via UPI: 9824584454@ybl
   GitHub: https://github.com/ohhmax | Email: max@maxnet.lan
   ============================================================================== */

const MaxnetTerminal = (function() {
    "use strict";

    // Module State & API references
    const moduleName = "terminal";

    return {
        name: moduleName,
        title: "Root Terminal",
        init: function() {
            console.log("[MAXNET] Initialized Root Terminal Module");
        }
    };
})();

if (typeof window !== "undefined") {
    window.MaxnetTerminal = MaxnetTerminal;
}
if (typeof module !== "undefined") {
    module.exports = MaxnetTerminal;
}
