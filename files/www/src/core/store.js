/* ==============================================================================
   MAXNET CORE: REACTIVE APPLICATION STORE & RUNTIME STATE
   ============================================================================== */
let timer = null;
let blockedIps = new Set();
let clientSortMode = 'ip';
let cachedClients = [];
let cachedTotWanBytes = 0;

const MaxnetStore = {
  activeTab: 'overview',
  activeSettingPage: null,
  clientSort: 'ip',
  lastDataCache: null,
  subscribers: new Set(),

  subscribe: function(fn) {
    this.subscribers.add(fn);
    return () => this.subscribers.delete(fn);
  },

  notify: function() {
    this.subscribers.forEach(fn => {
      try { fn(this); } catch (e) { console.warn('[Store] Subscriber error:', e); }
    });
  }
};

if (typeof window !== 'undefined') {
  window.MaxnetStore = MaxnetStore;
}
