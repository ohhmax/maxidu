/* ==============================================================================
   MAXNET OS MODULE: PPPOE CLIENT & SERVER
   PPPoE Broadband client dialer and multi-user PPPoE Server concentrator
   Engineered & Developed by Mahendra Mali - Max (c) 2026
   Donation & Support via UPI: 9824584454@ybl
   GitHub: https://github.com/ohhmax | Email: max@maxnet.lan
   ============================================================================== */

const MaxnetPppoe = (function() {
    "use strict";

    // Module State & API references
    const moduleName = "pppoe";

    return {
        name: moduleName,
        title: "PPPoE Client & Server",
        init: function() {
            console.log("[MAXNET] Initialized PPPoE Client & Server Module");
        }
    };
})();

if (typeof window !== "undefined") {
    window.MaxnetPppoe = MaxnetPppoe;
}
if (typeof module !== "undefined") {
    module.exports = MaxnetPppoe;
}
