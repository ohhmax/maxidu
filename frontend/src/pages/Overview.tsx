import { useState, useEffect } from 'preact/hooks';
import { route } from 'preact-router';
import { apiFetch } from '../api/client';
import { useStore } from '../store/useStore';
import { Header } from '../components/layout/Header';
import { BottomNav } from '../components/layout/BottomNav';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';

interface ClientNode {
  ip: string;
  mac: string;
  hostname: string;
  deviceType?: 'phone' | 'laptop' | 'tv' | 'iot' | 'device';
  online?: boolean;
  rxRate?: string;
  txRate?: string;
}

export function Overview() {
  const { hostname, version, setHostname, setVersion } = useStore();

  const [cpuPct, setCpuPct] = useState<number>(14.2);
  const [ramPct, setRamPct] = useState<number>(38.5);
  const [tempC, setTempC] = useState<number>(41.0);
  const [rxRate, setRxRate] = useState<string>('12.4 MB/s');
  const [txRate, setTxRate] = useState<string>('2.1 MB/s');
  const [clients, setClients] = useState<ClientNode[]>([
    { ip: '10.0.0.101', mac: '00:1A:2B:3C:4D:5E', hostname: 'Pixel-9-Pro', deviceType: 'phone', online: true, rxRate: '8.4 MB/s', txRate: '1.2 MB/s' },
    { ip: '10.0.0.102', mac: '24:F5:A2:81:49:10', hostname: 'MacBook-Pro-M3', deviceType: 'laptop', online: true, rxRate: '3.6 MB/s', txRate: '0.8 MB/s' },
    { ip: '10.0.0.105', mac: 'BC:D0:74:23:AA:1F', hostname: 'Bravia-4K-TV', deviceType: 'tv', online: true, rxRate: '0.4 MB/s', txRate: '0.1 MB/s' },
    { ip: '10.0.0.112', mac: '50:C7:BF:00:11:22', hostname: 'Smart-Home-Hub', deviceType: 'iot', online: true, rxRate: '12 KB/s', txRate: '8 KB/s' },
  ]);

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<ClientNode | null>(null);

  // Status Poller every 3s
  useEffect(() => {
    let mounted = true;

    const pollStatus = async () => {
      try {
        const data = await apiFetch<any>('status');
        if (!mounted || !data) return;

        if (data.router) {
          if (typeof data.router.cpu_pct === 'number') setCpuPct(data.router.cpu_pct);
          if (data.router.memory?.used_pct !== undefined) setRamPct(data.router.memory.used_pct);
          if (typeof data.router.temp_c === 'number') setTempC(data.router.temp_c);
          if (data.router.hostname) setHostname(data.router.hostname);
        }

        if (data.firmware) setVersion(data.firmware);

        if (data.traffic) {
          if (data.traffic.rx_rate_str) setRxRate(data.traffic.rx_rate_str);
          if (data.traffic.tx_rate_str) setTxRate(data.traffic.tx_rate_str);
        }

        if (Array.isArray(data.clients) && data.clients.length > 0) {
          setClients(data.clients);
        }
      } catch (err) {
        // Silent catch for dev/mock mode
      }
    };

    pollStatus();
    const interval = setInterval(pollStatus, 3000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleResetZoom = () => {
    // Reset canvas view
    const canvas = document.getElementById('topologySvgCanvas');
    if (canvas) {
      canvas.style.transform = 'scale(1) translate(0px, 0px)';
    }
  };

  const handleSettingsNav = () => {
    route('/settings');
  };

  return (
    <div class="min-h-screen flex flex-col bg-[#090b10] text-[#e2e8f0] font-mono pb-20 md:pb-8 select-none">
      {/* Top Header */}
      <Header
        hostname={hostname}
        version={version}
        onReset={handleResetZoom}
        onNotifications={() => setNotificationsOpen(true)}
        onSettings={handleSettingsNav}
        notificationCount={0}
      />

      {/* Main Content Area */}
      <main class="flex-1 flex flex-col max-w-[1200px] w-full mx-auto px-4 py-4 gap-4">
        {/* Bandwidth Pipeline Box */}
        <div class="bg-[#0f1724]/90 border border-maxnet-border rounded-xl p-4 shadow-lg backdrop-blur-md">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse"></span>
              <span class="text-xs font-bold text-white uppercase tracking-wider">
                Multi-Link Pipeline Throughput
              </span>
            </div>
            <div class="flex items-center gap-3 text-xs">
              <span class="text-[#38bdf8] flex items-center gap-1 font-bold">
                <svg class="w-3.5 h-3.5 stroke-current fill-none" stroke-width="2.5" viewBox="0 0 24 24">
                  <path d="M12 19V5M5 12l7 7 7-7" />
                </svg>
                {rxRate}
              </span>
              <span class="text-[#10b981] flex items-center gap-1 font-bold">
                <svg class="w-3.5 h-3.5 stroke-current fill-none" stroke-width="2.5" viewBox="0 0 24 24">
                  <path d="M12 5v14M5 12l7-7 7 7" />
                </svg>
                {txRate}
              </span>
            </div>
          </div>

          {/* Graphical Pipeline Bars */}
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2 text-[11px] text-maxnet-dim">
              <span class="w-12 text-right">WAN 1</span>
              <div class="flex-1 bg-black/40 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div
                  class="bg-gradient-to-r from-[#38bdf8] to-[#0ea5e9] h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(56,189,248,0.5)]"
                  style={{ width: `${Math.min(100, Math.max(15, cpuPct * 2))}%` }}
                ></div>
              </div>
              <span class="text-[10px] text-white w-14 text-right">ONLINE</span>
            </div>

            <div class="flex items-center gap-2 text-[11px] text-maxnet-dim">
              <span class="w-12 text-right">USB0</span>
              <div class="flex-1 bg-black/40 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div
                  class="bg-gradient-to-r from-[#10b981] to-[#059669] h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                  style={{ width: '65%' }}
                ></div>
              </div>
              <span class="text-[10px] text-emerald-400 w-14 text-right">ACTIVE</span>
            </div>
          </div>
        </div>

        {/* SVG Network Topology Canvas */}
        <div class="relative flex-1 min-h-[460px] bg-[#0c0e17] border border-maxnet-border/80 rounded-2xl overflow-hidden shadow-2xl flex flex-col items-center justify-center p-4">
          <div class="absolute top-3 left-4 text-[10px] font-bold tracking-widest uppercase text-maxnet-dim/70 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            ACTIVE NETWORK TOPOLOGY
          </div>

          <div class="absolute top-3 right-4 flex items-center gap-2">
            <Badge color="sky">{clients.length} Clients</Badge>
          </div>

          {/* SVG Tree Diagram */}
          <div class="w-full h-full flex flex-col items-center justify-center py-6 overflow-x-auto">
            <div id="topologySvgCanvas" class="flex flex-col items-center transition-transform duration-200">
              {/* Node 1: WAN / Internet */}
              <div class="flex flex-col items-center group cursor-pointer">
                <div class="w-12 h-12 rounded-xl bg-[#0ea5e9]/10 border-2 border-[#0ea5e9]/50 flex items-center justify-center text-[#38bdf8] shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:scale-105 transition-all">
                  <svg class="w-6 h-6 stroke-current fill-none" stroke-width="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
                <span class="text-[11px] font-bold text-white mt-1">INTERNET / WAN</span>
                <span class="text-[9.5px] text-emerald-400 font-mono">1000 Mbps Full Duplex</span>
              </div>

              {/* Edge 1: Line to Router */}
              <div class="w-0.5 h-10 bg-gradient-to-b from-[#0ea5e9] to-[#38bdf8] my-1 opacity-70"></div>

              {/* Node 2: Central Router Gateway */}
              <div
                onClick={() => route('/settings/network')}
                class="flex flex-col items-center group cursor-pointer p-2.5 rounded-xl bg-[#111827] border border-[#38bdf8]/40 hover:border-[#38bdf8] shadow-[0_0_25px_rgba(56,189,248,0.25)] hover:scale-105 transition-all"
              >
                <div class="w-14 h-14 rounded-xl bg-[#38bdf8]/20 flex items-center justify-center text-[#38bdf8]">
                  <svg class="w-8 h-8 stroke-current fill-none" stroke-width="2" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="8" rx="2" />
                    <rect x="2" y="14" width="20" height="8" rx="2" />
                    <line x1="6" y1="6" x2="6.01" y2="6" />
                    <line x1="6" y1="18" x2="6.01" y2="18" />
                  </svg>
                </div>
                <span class="text-xs font-black text-white mt-1 uppercase tracking-wide">
                  {hostname || 'MAXNET GATEWAY'}
                </span>
                <span class="text-[10px] text-[#38bdf8] font-mono">10.0.0.1 (br-lan)</span>
              </div>

              {/* Edge 2: Splitting Lines to Clients */}
              <div class="w-0.5 h-8 bg-[#38bdf8]/50 my-1"></div>
              <div
                class="h-0.5 bg-[#38bdf8]/40 mb-3"
                style={{ width: `${Math.max(260, clients.length * 110)}px` }}
              ></div>

              {/* Node 3: Connected Clients Row */}
              <div class="flex items-start justify-center gap-4 sm:gap-6 flex-wrap px-4">
                {clients.map((client) => (
                  <div
                    key={client.mac}
                    onClick={() => setSelectedNode(client)}
                    class="flex flex-col items-center group cursor-pointer p-2 rounded-xl bg-[#131622] hover:bg-[#1a1f30] border border-white/10 hover:border-[#38bdf8]/60 transition-all duration-200 min-w-[100px] text-center"
                  >
                    <div class="w-10 h-10 rounded-lg bg-white/5 group-hover:bg-[#38bdf8]/15 flex items-center justify-center text-white/80 group-hover:text-[#38bdf8] transition-colors">
                      {client.deviceType === 'laptop' ? (
                        <svg class="w-5 h-5 stroke-current fill-none" stroke-width="2" viewBox="0 0 24 24">
                          <rect x="3" y="4" width="18" height="12" rx="2" />
                          <line x1="2" y1="20" x2="22" y2="20" />
                        </svg>
                      ) : client.deviceType === 'tv' ? (
                        <svg class="w-5 h-5 stroke-current fill-none" stroke-width="2" viewBox="0 0 24 24">
                          <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                          <polyline points="17 2 12 7 7 2" />
                        </svg>
                      ) : client.deviceType === 'iot' ? (
                        <svg class="w-5 h-5 stroke-current fill-none" stroke-width="2" viewBox="0 0 24 24">
                          <ellipse cx="12" cy="5" rx="9" ry="3" />
                          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                        </svg>
                      ) : (
                        <svg class="w-5 h-5 stroke-current fill-none" stroke-width="2" viewBox="0 0 24 24">
                          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                          <line x1="12" y1="18" x2="12.01" y2="18" />
                        </svg>
                      )}
                    </div>
                    <span class="text-[11px] font-bold text-white mt-1 max-w-[110px] truncate">
                      {client.hostname || 'Client'}
                    </span>
                    <span class="text-[9.5px] text-maxnet-dim font-mono">{client.ip}</span>
                    {client.rxRate && (
                      <span class="text-[8.5px] text-[#38bdf8] font-mono mt-0.5">
                        &darr; {client.rxRate}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Telemetry Dock at Bottom */}
          <div class="w-full max-w-[380px] bg-[#111624]/90 backdrop-blur-md border border-white/15 rounded-xl px-4 py-2 flex items-center justify-around shadow-xl mt-3">
            <div class="flex items-center gap-2">
              <svg class="w-3.5 h-3.5 stroke-[#38bdf8] fill-none" stroke-width="2" viewBox="0 0 24 24">
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <rect x="9" y="9" width="6" height="6" />
                <path d="M9 1v3m6-3v3M9 20v3m6-3v3M20 9h3m-3 6h3M1 9h3m-3 6h3" />
              </svg>
              <span class="text-[11px] text-maxnet-dim">CPU</span>
              <span class="text-xs font-bold text-[#38bdf8]">{cpuPct.toFixed(1)}%</span>
            </div>

            <div class="w-px h-4 bg-white/15"></div>

            <div class="flex items-center gap-2">
              <svg class="w-3.5 h-3.5 stroke-[#10b981] fill-none" stroke-width="2" viewBox="0 0 24 24">
                <path d="M6 19v-3m4 3v-6m4 3v-2m4 5V5" />
                <rect x="2" y="3" width="20" height="18" rx="2" />
              </svg>
              <span class="text-[11px] text-maxnet-dim">RAM</span>
              <span class="text-xs font-bold text-[#10b981]">{ramPct.toFixed(1)}%</span>
            </div>

            <div class="w-px h-4 bg-white/15"></div>

            <div class="flex items-center gap-2">
              <svg class="w-3.5 h-3.5 stroke-[#f59e0b] fill-none" stroke-width="2" viewBox="0 0 24 24">
                <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
              </svg>
              <span class="text-[11px] text-maxnet-dim">TEMP</span>
              <span class="text-xs font-bold text-[#f59e0b]">{tempC.toFixed(1)}°C</span>
            </div>
          </div>
        </div>
      </main>

      {/* Node Details Modal */}
      {selectedNode && (
        <Modal
          open={!!selectedNode}
          onClose={() => setSelectedNode(null)}
          title={selectedNode.hostname || 'Device Node'}
          description="Connected LAN Device Telemetry"
          badge="ONLINE"
        >
          <div class="flex flex-col gap-3 text-xs font-mono">
            <div class="flex justify-between py-1.5 border-b border-white/5">
              <span class="text-maxnet-dim">IP Address</span>
              <span class="text-white font-bold">{selectedNode.ip}</span>
            </div>
            <div class="flex justify-between py-1.5 border-b border-white/5">
              <span class="text-maxnet-dim">MAC Address</span>
              <span class="text-white font-bold">{selectedNode.mac}</span>
            </div>
            <div class="flex justify-between py-1.5 border-b border-white/5">
              <span class="text-maxnet-dim">Link Protocol</span>
              <span class="text-emerald-400 font-bold">DHCP IPv4 Active</span>
            </div>
            {selectedNode.rxRate && (
              <div class="flex justify-between py-1.5 border-b border-white/5">
                <span class="text-maxnet-dim">Current Download</span>
                <span class="text-[#38bdf8] font-bold">{selectedNode.rxRate}</span>
              </div>
            )}
            {selectedNode.txRate && (
              <div class="flex justify-between py-1.5 border-b border-white/5">
                <span class="text-maxnet-dim">Current Upload</span>
                <span class="text-[#10b981] font-bold">{selectedNode.txRate}</span>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Notifications Center Modal */}
      <Modal
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        title="Notifications"
        description="Router events and security logs"
        badge="SYS LOGS"
      >
        <div class="flex flex-col gap-2.5 text-xs font-mono max-h-[300px] overflow-y-auto">
          <div class="p-2.5 rounded-lg bg-white/5 border border-white/10 flex flex-col gap-1">
            <div class="flex items-center justify-between">
              <span class="font-bold text-[#38bdf8]">System Startup</span>
              <span class="text-[10px] text-maxnet-dim">Just now</span>
            </div>
            <span class="text-white/80">MaxNet Gateway OS initialized successfully.</span>
          </div>
          <div class="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex flex-col gap-1">
            <div class="flex items-center justify-between">
              <span class="font-bold text-emerald-400">WAN Connected</span>
              <span class="text-[10px] text-maxnet-dim">2m ago</span>
            </div>
            <span class="text-white/80">DHCP lease acquired on physical WAN interface.</span>
          </div>
        </div>
      </Modal>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab="overview"
        onTabChange={(tab) => {
          if (tab === 'settings') route('/settings');
        }}
      />
    </div>
  );
}

export default Overview;
