import { useState, useMemo } from 'preact/hooks';
import { route } from 'preact-router';
import { SearchBar } from '../components/layout/SearchBar';
import { SettingsNavCard } from '../components/ui/SettingsNavCard';
import { BottomNav } from '../components/layout/BottomNav';

export interface SettingsCardDef {
  id: string;
  title: string;
  description: string;
  iconColor: string;
  keywords: string;
  icon: any;
}

export const SETTINGS_CARD_LIST: SettingsCardDef[] = [
  {
    id: 'network',
    title: 'Network',
    description: 'Gateway IP, subnet mask, DNS, and DHCP pool',
    iconColor: '#38bdf8',
    keywords: 'network dhcp gateway ip subnet mask dns nameservers lease pool lan interface ipv6 slaac dhcpv6 ula flow offloading acceleration ppe mss mtu',
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    id: 'interfaces',
    title: 'Interfaces',
    description: 'Physical WAN protocol (DHCP / Static), physical Ethernet links, and bridge status',
    iconColor: '#0ea5e9',
    keywords: 'interfaces wan lan dhcp static custom mac clone mtu link physical ethernet usb0 br-lan',
    icon: (
      <svg viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="8" rx="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" />
        <line x1="6" y1="18" x2="6.01" y2="18" />
      </svg>
    ),
  },
  {
    id: 'usb-wan',
    title: 'USB WAN',
    description: 'Multi-device USB tethering, 4G/5G dongles, and load balancing',
    iconColor: '#0ea5e9',
    keywords: 'usb wan tethering multi-device load balancing rndis ncm ecm 4g 5g modem failover watchdog dongle usb0 usb1',
    icon: (
      <svg viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="8" rx="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" />
        <line x1="6" y1="18" x2="6.01" y2="18" />
        <path d="M10 12h4" />
      </svg>
    ),
  },
  {
    id: 'pppoe',
    title: 'PPPoE Broadband',
    description: 'PPPoE Client dialer and high-performance PPPoE Server concentrator',
    iconColor: '#06b6d4',
    keywords: 'pppoe broadband wan isp dialer client server credentials access concentrator ac chap pap pppd',
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M5 12.55a11 11 0 0 1 14.08 0" />
        <path d="M1.42 9a16 16 0 0 1 21.16 0" />
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <line x1="12" y1="20" x2="12.01" y2="20" />
      </svg>
    ),
  },
  {
    id: 'lan-clients',
    title: 'DHCP Clients',
    description: 'Active DHCP client leases, IP and MAC address allocations',
    iconColor: '#10b981',
    keywords: 'dhcp clients connected devices leases ip mac hostname allocation',
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: 'topo-layers',
    title: 'Network Topology',
    description: 'Port modes, Layer 2 AP, and client hierarchy',
    iconColor: '#38bdf8',
    keywords: 'topology layers port layer 2 layer 3 access point switch router ap hierarchy mapping lan1 lan2 lan3 lan4',
    icon: (
      <svg viewBox="0 0 24 24">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
  {
    id: 'security',
    title: 'Security',
    description: 'Firewall rules, SYN flood protection, and WAN isolation',
    iconColor: '#f59e0b',
    keywords: 'security firewall syn flood wan ping icmp protection drop isolation',
    icon: (
      <svg viewBox="0 0 24 24">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    id: 'tailscale',
    title: 'Tailscale VPN',
    description: 'Mesh VPN, exit node routing, and secure remote access',
    iconColor: '#06b6d4',
    keywords: 'tailscale vpn wireguard remote access mesh exit node subnet router auth key',
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    id: 'gaming',
    title: 'Gaming Mode',
    description: 'Low-latency QoS, bufferbloat killer, and CPU steering',
    iconColor: '#ec4899',
    keywords: 'gaming qos bufferbloat low ping latency dscp fastopen interrupt steering esports acceleration',
    icon: (
      <svg viewBox="0 0 24 24">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    id: 'adb-device',
    title: 'ADB Devices',
    description: 'Connected Android handsets, tethering modems, and hardware ADB controls',
    iconColor: '#38bdf8',
    keywords: 'adb devices android debugging phone handset hardware controls usb tethering tcpip wireless port forwarding',
    icon: (
      <svg viewBox="0 0 24 24">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
  },
  {
    id: 'smb-storage',
    title: 'Network Storage',
    description: 'Samba 4 file sharing and USB disk auto-mount',
    iconColor: '#c084fc',
    keywords: 'samba smb storage nas share usb drive disk mount file sharing windows mac',
    icon: (
      <svg viewBox="0 0 24 24">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
  },
  {
    id: 'webhooks',
    title: 'Webhooks',
    description: 'Telegram, Discord, and ntfy.sh instant alert forwarding for router events',
    iconColor: '#0ea5e9',
    keywords: 'webhooks alerts push telegram discord ntfy forward bot token chat id notifications',
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M22 2L11 13" />
        <path d="M22 2l-7 20-4-9-9-4 20-7z" />
      </svg>
    ),
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'System events, CPU spikes, PPPoE errors, new devices, and firmware updates',
    iconColor: '#f59e0b',
    keywords: 'notifications alerts logs events errors cpu spike pppoe dhcp new devices firmware updates',
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
  {
    id: 'diagnostics',
    title: 'Diagnostics',
    description: 'Ping latency tests, traceroute, and DNS reachability',
    iconColor: '#38bdf8',
    keywords: 'diagnostics tools ping traceroute nslookup reachability packet loss latency',
    icon: (
      <svg viewBox="0 0 24 24">
        <polyline points="4 17 10 11 14 15 20 9" />
        <line x1="20" y1="14" x2="20" y2="9" />
        <line x1="15" y1="9" x2="20" y2="9" />
      </svg>
    ),
  },
  {
    id: 'terminal-cli',
    title: 'Terminal',
    description: 'Interactive on-screen root shell console',
    iconColor: '#10b981',
    keywords: 'terminal cli console bash shell root command ssh ttyd execute',
    icon: (
      <svg viewBox="0 0 24 24">
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    ),
  },
  {
    id: 'logs',
    title: 'System Logs',
    description: 'Kernel dmesg ring buffer, logread, and system events',
    iconColor: '#06b6d4',
    keywords: 'logs system log kernel dmesg logread buffer events daemon syslog real-time',
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    id: 'packages',
    title: 'Packages',
    description: 'Installed packages, software repository, and plugin management',
    iconColor: '#38bdf8',
    keywords: 'packages software opkg apk install uninstall update repository plugins modules',
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    id: 'sys-info',
    title: 'Device Info',
    description: 'Hardware specs, CPU, RAM, thermal sensors, flash storage, and physical ports',
    iconColor: '#38bdf8',
    keywords: 'device info system hardware cpu ram memory temperature sensors thermals storage flash partitions wan ports interfaces uptime kernel model',
    icon: (
      <svg viewBox="0 0 24 24">
        <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
        <rect x="9" y="9" width="6" height="6" />
        <line x1="9" y1="1" x2="9" y2="4" />
        <line x1="15" y1="1" x2="15" y2="4" />
        <line x1="9" y1="20" x2="9" y2="23" />
        <line x1="15" y1="20" x2="15" y2="23" />
        <line x1="20" y1="9" x2="23" y2="9" />
        <line x1="20" y1="14" x2="23" y2="14" />
        <line x1="1" y1="9" x2="4" y2="9" />
        <line x1="1" y1="14" x2="4" y2="14" />
      </svg>
    ),
  },
  {
    id: 'maintenance',
    title: 'Maintenance',
    description: 'System reboot, USB power cycle, backup, and factory reset',
    iconColor: '#ef4444',
    keywords: 'maintenance reboot restart shutdown firmware upgrade backup restore factory reset logcat dmesg logs',
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
        <line x1="12" y1="2" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    id: 'webui',
    title: 'Web UI',
    description: 'Dark/Light themes, telemetry refresh, and display options',
    iconColor: '#a855f7',
    keywords: 'webui theme dark light appearance refresh rate poll interval display customization font',
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="12" x2="12" y2="3" />
        <line x1="12" y1="12" x2="12" y2="21" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ),
  },
  {
    id: 'device-info',
    title: 'About Developer',
    description: 'Lead engineer, system architecture, and firmware engineering credits',
    iconColor: '#8b5cf6',
    keywords: 'about developer max mahendra mali firmware architecture openwrt kernel ohhmax github',
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export function Settings() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCards = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return SETTINGS_CARD_LIST;

    return SETTINGS_CARD_LIST.filter(
      (c) =>
        c.title.toLowerCase().includes(term) ||
        c.description.toLowerCase().includes(term) ||
        c.keywords.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const handleCardClick = (id: string) => {
    if (id === 'terminal-cli') {
      route('/terminal');
    } else if (id === 'diagnostics') {
      route('/diagnostics');
    } else {
      route(`/settings/${id}`);
    }
  };

  return (
    <div class="min-h-screen flex flex-col bg-[#090b10] text-[#e2e8f0] font-mono pb-20 md:pb-8 select-none">
      <main class="flex-1 max-w-[1000px] w-full mx-auto px-4 py-4 flex flex-col">
        {/* Search Bar at Top */}
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onBack={() => route('/')}
          placeholder="Search settings..."
        />

        {/* Settings Navigation Cards Grid */}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-2">
          {filteredCards.length > 0 ? (
            filteredCards.map((card) => (
              <SettingsNavCard
                key={card.id}
                icon={card.icon}
                iconColor={card.iconColor}
                title={card.title}
                description={card.description}
                onClick={() => handleCardClick(card.id)}
              />
            ))
          ) : (
            <div class="col-span-full py-12 text-center text-maxnet-dim font-mono text-xs">
              No matching settings found for "{searchTerm}"
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab="settings"
        onTabChange={(tab) => {
          if (tab === 'overview') route('/');
        }}
      />
    </div>
  );
}

export default Settings;
