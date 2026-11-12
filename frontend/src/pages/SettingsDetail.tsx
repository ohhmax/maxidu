import { useState } from 'preact/hooks';
import { route } from 'preact-router';
import { apiFetch } from '../api/client';
import { Card } from '../components/ui/Card';
import { SettingRow } from '../components/ui/SettingRow';
import { Toggle } from '../components/ui/Toggle';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { SubNavBar } from '../components/layout/SubNavBar';
import { BottomNav } from '../components/layout/BottomNav';

export type SettingRowConfig =
  | {
      type: 'clickable';
      key: string;
      label: string;
      sublabel: string;
      modalType: 'text' | 'select' | 'number';
      options?: string[];
    }
  | {
      type: 'toggle';
      key: string;
      label: string;
      sublabel: string;
      apiField: string;
      defaultChecked?: boolean;
    }
  | {
      type: 'info';
      label: string;
      valueId: string;
      defaultValue?: string;
    };

export interface SettingsPageConfig {
  title: string;
  badge?: string;
  rows: SettingRowConfig[];
}

export const SETTINGS_PAGES: Record<string, SettingsPageConfig> = {
  network: {
    title: 'Network & DHCP',
    badge: '10.0.0.1/24',
    rows: [
      { type: 'clickable', key: 'device_hostname', label: 'Device Hostname', sublabel: 'Maxnet-Gateway', modalType: 'text' },
      { type: 'clickable', key: 'custom_mac', label: 'Bridge LAN MAC Address (br-lan)', sublabel: 'Default Factory Hardware MAC in use', modalType: 'text' },
      { type: 'clickable', key: 'lan_ip', label: 'Gateway IP Address', sublabel: '10.0.0.1', modalType: 'text' },
      { type: 'clickable', key: 'net_mask', label: 'Subnet Mask / CIDR', sublabel: '255.255.255.0 (/24)', modalType: 'select', options: ['255.255.255.0 (/24)', '255.255.0.0 (/16)', '255.255.255.128 (/25)', '255.255.255.192 (/26)'] },
      { type: 'clickable', key: 'net_gateway', label: 'Default Upstream Gateway', sublabel: 'None (Direct br-lan)', modalType: 'text' },
      { type: 'clickable', key: 'net_mtu', label: 'Interface MTU Size', sublabel: '1500 bytes', modalType: 'number' },
      { type: 'toggle', key: 'dhcp_enable', label: 'DHCP Server Daemon', sublabel: 'Enable automatic IPv4 address allocation to connected clients', apiField: 'dhcp_enable', defaultChecked: true },
      { type: 'clickable', key: 'dhcp_pool', label: 'DHCP Address Pool', sublabel: 'Start 100 • Limit 150 • Lease 12h', modalType: 'text' },
      { type: 'clickable', key: 'custom_dns', label: 'Custom DNS Nameservers', sublabel: '1.1.1.1 8.8.8.8', modalType: 'text' },
      { type: 'toggle', key: 'ipv6_enable', label: 'IPv6 Dual-Stack Support', sublabel: 'Enable native IPv6 packet routing and client SLAAC addressing', apiField: 'ipv6_enable', defaultChecked: true },
      { type: 'info', label: 'Assigned IPv6 Addresses', valueId: 'ipv6_addrs', defaultValue: 'fd00::1/60 • 2409:40c1:...' },
      { type: 'clickable', key: 'ipv6_wan_mode', label: 'WAN IPv6 Assignment', sublabel: 'DHCPv6-PD & SLAAC (Automatic)', modalType: 'select', options: ['DHCPv6-PD & SLAAC (Automatic)', 'Static IPv6', 'Disabled'] },
      { type: 'toggle', key: 'ipv6_ra', label: 'Router Advertisement (RA / SLAAC)', sublabel: 'Announce router presence and network prefix for client autoconfig', apiField: 'ipv6_ra', defaultChecked: true },
      { type: 'toggle', key: 'ipv6_dhcp6', label: 'DHCPv6 Stateful Server', sublabel: 'Issue stateful IPv6 address leases and DNS options directly', apiField: 'ipv6_dhcp6', defaultChecked: false },
      { type: 'clickable', key: 'ipv6_ula', label: 'IPv6 ULA Prefix', sublabel: 'fd00::/48 • Unique local address scope', modalType: 'text' },
      { type: 'toggle', key: 'flow_offload', label: 'Software Flow Offloading', sublabel: 'Bypass kernel routing stack for ultra-high throughput', apiField: 'flow_offload', defaultChecked: true },
      { type: 'toggle', key: 'tcp_bbr', label: 'TCP BBR Congestion Control', sublabel: 'Google BBR congestion control algorithm for max speeds', apiField: 'tcp_bbr', defaultChecked: true },
    ],
  },
  interfaces: {
    title: 'Interfaces',
    badge: 'WAN / LAN',
    rows: [
      { type: 'clickable', key: 'wan_protocol', label: 'WAN Protocol', sublabel: 'DHCP Client (Automatic IP)', modalType: 'select', options: ['DHCP Client (Automatic IP)', 'Static IP', 'PPPoE', 'Disabled'] },
      { type: 'clickable', key: 'wan_static_ip', label: 'Static WAN IP', sublabel: '192.168.1.2/24', modalType: 'text' },
      { type: 'clickable', key: 'wan_gateway', label: 'WAN Default Gateway', sublabel: '192.168.1.1', modalType: 'text' },
      { type: 'clickable', key: 'wan_dns', label: 'WAN DNS Servers', sublabel: '1.1.1.1, 8.8.8.8', modalType: 'text' },
      { type: 'clickable', key: 'wan_mac_clone', label: 'WAN MAC Address Cloning', sublabel: 'Default Factory Hardware MAC', modalType: 'text' },
      { type: 'clickable', key: 'wan_mtu', label: 'WAN MTU Size', sublabel: '1500 bytes', modalType: 'number' },
      { type: 'info', label: 'Physical Ethernet Port 1 (WAN)', valueId: 'wan_port_status', defaultValue: '1000 Mbps Full-Duplex • Link Up' },
      { type: 'info', label: 'Physical Ethernet Port 2 (LAN)', valueId: 'lan_port_status', defaultValue: '1000 Mbps Full-Duplex • Link Up' },
      { type: 'toggle', key: 'igmp_snoop', label: 'IGMP Snooping', sublabel: 'Filter multicast streams on LAN bridge to prevent flooding', apiField: 'igmp_snoop', defaultChecked: true },
    ],
  },
  'usb-wan': {
    title: 'USB WAN',
    badge: 'Multi-Link',
    rows: [
      { type: 'toggle', key: 'usb_wan_enable', label: 'USB WAN Tethering', sublabel: 'Enable USB tethering modem as primary or secondary WAN gateway', apiField: 'usb_wan_enable', defaultChecked: true },
      { type: 'clickable', key: 'usb_modem_iface', label: 'Tethering Interface', sublabel: 'usb0 (Auto-detected)', modalType: 'select', options: ['usb0 (Auto-detected)', 'usb1', 'eth2'] },
      { type: 'toggle', key: 'load_balance', label: 'Multi-WAN Load Balancing', sublabel: 'Distribute connections across physical WAN and USB modems', apiField: 'load_balance', defaultChecked: true },
      { type: 'clickable', key: 'usb_failover_watchdog', label: 'Failover Ping Watchdog', sublabel: 'Interval: 5s • Target: 1.1.1.1 • Max packet loss: 3', modalType: 'text' },
      { type: 'clickable', key: 'usb_ttl_override', label: 'TTL / HL Value Override', sublabel: 'TTL 64 (Bypass carrier hotspot restrictions)', modalType: 'number' },
      { type: 'toggle', key: 'rndis_autoload', label: 'USB RNDIS / NCM Auto-Load', sublabel: 'Automatically load Linux kernel modules for Android handsets', apiField: 'rndis_autoload', defaultChecked: true },
    ],
  },
  pppoe: {
    title: 'PPPoE Broadband',
    badge: 'Broadband',
    rows: [
      { type: 'toggle', key: 'pppoe_client_enable', label: 'PPPoE Client Dialer', sublabel: 'Connect to ISP using PPPoE client daemon', apiField: 'pppoe_client_enable', defaultChecked: false },
      { type: 'clickable', key: 'pppoe_username', label: 'PPPoE Username', sublabel: 'user@isp.broadband', modalType: 'text' },
      { type: 'clickable', key: 'pppoe_password', label: 'PPPoE Password', sublabel: '••••••••', modalType: 'text' },
      { type: 'clickable', key: 'pppoe_service', label: 'PPPoE Service Name', sublabel: 'Auto / ISP Default', modalType: 'text' },
      { type: 'clickable', key: 'pppoe_ac', label: 'Access Concentrator (AC)', sublabel: 'Auto / ISP Default', modalType: 'text' },
      { type: 'clickable', key: 'pppoe_mtu', label: 'PPPoE MTU / MRU Size', sublabel: '1492 bytes', modalType: 'number' },
      { type: 'info', label: 'PPPoE Dialer Status', valueId: 'pppoe_status', defaultValue: 'DISCONNECTED' },
      { type: 'toggle', key: 'pppoe_server', label: 'PPPoE Concentrator Server', sublabel: 'Host a PPPoE broadband server on LAN ports for downstream routers', apiField: 'pppoe_server', defaultChecked: false },
    ],
  },
  'lan-clients': {
    title: 'DHCP Clients',
    badge: 'Leases',
    rows: [
      { type: 'info', label: 'Active DHCP Leases', valueId: 'active_leases_count', defaultValue: '4 Active Clients' },
      { type: 'info', label: 'Static IP Reservations', valueId: 'static_leases_count', defaultValue: '2 Devices Configured' },
      { type: 'clickable', key: 'add_static_lease', label: 'Add Static Lease Reservation', sublabel: 'Tap to bind MAC address to specific IPv4 address', modalType: 'text' },
      { type: 'toggle', key: 'dhcp_authoritative', label: 'Authoritative DHCP Server', sublabel: 'Speed up lease assignment for newly connected client devices', apiField: 'dhcp_authoritative', defaultChecked: true },
      { type: 'clickable', key: 'dhcp_lease_time', label: 'Default Lease Duration', sublabel: '12 hours', modalType: 'select', options: ['1 hour', '6 hours', '12 hours', '24 hours', '7 days'] },
    ],
  },
  'topo-layers': {
    title: 'Network Topology',
    badge: 'L2 / L3',
    rows: [
      { type: 'clickable', key: 'topo_mode', label: 'Topology Hierarchy Mode', sublabel: 'Layer 2 Bridge + Layer 3 Mesh', modalType: 'select', options: ['Layer 2 Bridge + Layer 3 Mesh', 'Pure Layer 2 Bridge', 'Pure Layer 3 Routed'] },
      { type: 'toggle', key: 'lldp_enable', label: 'LLDP Neighbor Discovery', sublabel: 'Auto-discover managed switches, routers, and access points', apiField: 'lldp_enable', defaultChecked: true },
      { type: 'clickable', key: 'lan_port1_role', label: 'LAN Port 1 Role', sublabel: 'Trunk Port (All VLANs)', modalType: 'select', options: ['Trunk Port (All VLANs)', 'Access Port (VLAN 1)', 'Mirror Port'] },
      { type: 'clickable', key: 'lan_port2_role', label: 'LAN Port 2 Role', sublabel: 'Access Port (VLAN 1)', modalType: 'select', options: ['Access Port (VLAN 1)', 'Trunk Port (All VLANs)', 'Disabled'] },
      { type: 'toggle', key: 'isolate_clients', label: 'Client AP Isolation', sublabel: 'Prevent wireless and wired clients from communicating peer-to-peer', apiField: 'isolate_clients', defaultChecked: false },
    ],
  },
  security: {
    title: 'Security & Firewall',
    badge: 'Firewall',
    rows: [
      { type: 'toggle', key: 'syn_flood', label: 'SYN Flood Protection', sublabel: 'Drop malicious SYN packets and mitigate TCP SYN DDoS attacks', apiField: 'syn_flood', defaultChecked: true },
      { type: 'toggle', key: 'block_wan_ping', label: 'Block WAN ICMP Ping', sublabel: 'Make router invisible to external internet port scanners', apiField: 'block_wan_ping', defaultChecked: true },
      { type: 'toggle', key: 'block_wan_web', label: 'Block WAN Web Access', sublabel: 'Restrict web management UI to local LAN connections only', apiField: 'block_wan_web', defaultChecked: true },
      { type: 'toggle', key: 'drop_invalid', label: 'Drop Invalid Packets', sublabel: 'Discard malformed and forged state packets before processing', apiField: 'drop_invalid', defaultChecked: true },
      { type: 'clickable', key: 'fw_ssh_port', label: 'SSH Management Port', sublabel: 'Port 22', modalType: 'number' },
      { type: 'clickable', key: 'fw_http_port', label: 'HTTP Web Port', sublabel: 'Port 80', modalType: 'number' },
      { type: 'clickable', key: 'fw_https_port', label: 'HTTPS Web Port', sublabel: 'Port 443', modalType: 'number' },
      { type: 'toggle', key: 'isolate_subnets', label: 'Subnet Isolation', sublabel: 'Isolate guest networks and IoT device subnets from main LAN', apiField: 'isolate_subnets', defaultChecked: true },
    ],
  },
  tailscale: {
    title: 'Tailscale VPN',
    badge: 'WireGuard',
    rows: [
      { type: 'toggle', key: 'tailscale_enable', label: 'Tailscale VPN Daemon', sublabel: 'Enable zero-config mesh VPN overlay network', apiField: 'tailscale_enable', defaultChecked: true },
      { type: 'clickable', key: 'tailscale_auth_key', label: 'Pre-Authentication Key', sublabel: 'tskey-auth-••••••••', modalType: 'text' },
      { type: 'clickable', key: 'tailscale_hostname', label: 'Tailscale Machine Name', sublabel: 'maxnet-gateway', modalType: 'text' },
      { type: 'toggle', key: 'tailscale_exit_node', label: 'Advertise Exit Node', sublabel: 'Allow remote Tailscale devices to route internet through router', apiField: 'tailscale_exit_node', defaultChecked: true },
      { type: 'toggle', key: 'tailscale_subnets', label: 'Advertise Subnet Routes', sublabel: 'Expose 10.0.0.0/24 LAN subnet to Tailscale mesh peers', apiField: 'tailscale_subnets', defaultChecked: true },
      { type: 'info', label: 'Tailscale IPv4 Address', valueId: 'tailscale_ip', defaultValue: '100.64.0.12' },
      { type: 'info', label: 'Tailscale Status', valueId: 'tailscale_status', defaultValue: 'CONNECTED • NODE ACTIVE' },
    ],
  },
  gaming: {
    title: 'Gaming Mode & QoS',
    badge: 'eSports QoS',
    rows: [
      { type: 'toggle', key: 'gaming_mode', label: 'Gaming Acceleration Engine', sublabel: 'Prioritize gaming UDP packets for ultra-low latency & zero jitter', apiField: 'gaming_mode', defaultChecked: true },
      { type: 'clickable', key: 'gaming_algo', label: 'Active Queue Management (AQM)', sublabel: 'CAKE (Bufferbloat Killer)', modalType: 'select', options: ['CAKE (Bufferbloat Killer)', 'FQ-CoDel', 'HTB'] },
      { type: 'clickable', key: 'gaming_bandwidth_down', label: 'Download Bandwidth Limit', sublabel: '1000 Mbps (0 for unlimited)', modalType: 'number' },
      { type: 'clickable', key: 'gaming_bandwidth_up', label: 'Upload Bandwidth Limit', sublabel: '500 Mbps (0 for unlimited)', modalType: 'number' },
      { type: 'toggle', key: 'dscp_tagging', label: 'DSCP CS6 / EF High-Priority Tagging', sublabel: 'Mark gaming packets for immediate zero-queue scheduling', apiField: 'dscp_tagging', defaultChecked: true },
      { type: 'toggle', key: 'irq_affinity', label: 'CPU Core Interrupt Steering', sublabel: 'Bind network hardware interrupts to highest-speed CPU core', apiField: 'irq_affinity', defaultChecked: true },
    ],
  },
  'adb-device': {
    title: 'ADB Devices',
    badge: 'Android',
    rows: [
      { type: 'toggle', key: 'adb_enable', label: 'ADB Server Daemon', sublabel: 'Enable Android Debug Bridge daemon for connected smartphones', apiField: 'adb_enable', defaultChecked: true },
      { type: 'info', label: 'Connected Handset Model', valueId: 'adb_device_model', defaultValue: 'Google Pixel 9 Pro (Android 15)' },
      { type: 'info', label: 'Battery Level & State', valueId: 'adb_battery', defaultValue: '94% • Charging (AC)' },
      { type: 'clickable', key: 'adb_port', label: 'Wireless ADB TCP/IP Port', sublabel: 'Port 5555', modalType: 'number' },
      { type: 'toggle', key: 'adb_autotether', label: 'Auto-Trigger USB Tethering', sublabel: 'Automatically enable USB tethering modem upon handset connection', apiField: 'adb_autotether', defaultChecked: true },
    ],
  },
  'smb-storage': {
    title: 'Network Storage',
    badge: 'Samba 4',
    rows: [
      { type: 'toggle', key: 'smb_enable', label: 'Samba 4 File Server', sublabel: 'Enable Windows / macOS / Linux SMB network file sharing', apiField: 'smb_enable', defaultChecked: true },
      { type: 'clickable', key: 'smb_workgroup', label: 'SMB Workgroup', sublabel: 'WORKGROUP', modalType: 'text' },
      { type: 'clickable', key: 'smb_share_name', label: 'Primary Share Name', sublabel: 'MaxNet-Storage', modalType: 'text' },
      { type: 'clickable', key: 'smb_share_path', label: 'Mounted Storage Path', sublabel: '/mnt/sda1', modalType: 'text' },
      { type: 'toggle', key: 'smb_guest', label: 'Allow Anonymous Guest Access', sublabel: 'Permit local clients to browse and read files without password', apiField: 'smb_guest', defaultChecked: true },
      { type: 'info', label: 'Mounted USB Disks', valueId: 'usb_storage_status', defaultValue: 'SanDisk 256GB SSD (/mnt/sda1) • 182GB Free' },
    ],
  },
  webhooks: {
    title: 'Webhooks & Alerts',
    badge: 'Alerts',
    rows: [
      { type: 'toggle', key: 'webhook_enable', label: 'Webhook Alert Forwarding', sublabel: 'Forward router alerts and system events to external webhook bots', apiField: 'webhook_enable', defaultChecked: true },
      { type: 'clickable', key: 'webhook_service', label: 'Notification Provider', sublabel: 'Telegram Bot', modalType: 'select', options: ['Telegram Bot', 'Discord Webhook', 'ntfy.sh Topic', 'Slack'] },
      { type: 'clickable', key: 'webhook_bot_token', label: 'Bot API Token', sublabel: '123456789:ABCdefGHIjklMNOpqr...', modalType: 'text' },
      { type: 'clickable', key: 'webhook_chat_id', label: 'Chat ID / Channel Topic', sublabel: '@maxnet_router_alerts', modalType: 'text' },
      { type: 'toggle', key: 'notify_wan', label: 'Alert on WAN Disconnect', sublabel: 'Send instant notification when internet gateway disconnects', apiField: 'notify_wan', defaultChecked: true },
      { type: 'toggle', key: 'notify_client', label: 'Alert on New DHCP Client', sublabel: 'Send message when unrecognized MAC address connects to LAN', apiField: 'notify_client', defaultChecked: true },
      { type: 'toggle', key: 'notify_cpu', label: 'Alert on High CPU Load', sublabel: 'Notify if CPU utilization exceeds 90% for more than 2 minutes', apiField: 'notify_cpu', defaultChecked: false },
    ],
  },
  notifications: {
    title: 'Notifications',
    badge: 'Events',
    rows: [
      { type: 'info', label: 'Total Logged Events', valueId: 'total_events_count', defaultValue: '34 System Events' },
      { type: 'toggle', key: 'inapp_alerts', label: 'In-App Toast Alerts', sublabel: 'Display popup alerts in web dashboard on critical router events', apiField: 'inapp_alerts', defaultChecked: true },
      { type: 'clickable', key: 'notification_retention', label: 'Event Retention Window', sublabel: '7 Days (Auto-purge older entries)', modalType: 'select', options: ['24 Hours', '3 Days', '7 Days', '30 Days'] },
      { type: 'toggle', key: 'sound_alerts', label: 'Audio Alert Chimes', sublabel: 'Play subtle audio tone when security intrusion is blocked', apiField: 'sound_alerts', defaultChecked: false },
    ],
  },
  logs: {
    title: 'System Logs',
    badge: 'Kernel',
    rows: [
      { type: 'info', label: 'Kernel Ring Buffer Status', valueId: 'kernel_log_status', defaultValue: 'Ring Buffer Active • 0 Errors' },
      { type: 'clickable', key: 'log_level', label: 'System Log Severity', sublabel: 'Info (Standard logging)', modalType: 'select', options: ['Debug (Verbose)', 'Info (Standard logging)', 'Warning', 'Error Only'] },
      { type: 'clickable', key: 'log_buffer_size', label: 'Ring Buffer Size', sublabel: '64 KB Memory Buffer', modalType: 'select', options: ['32 KB', '64 KB', '128 KB', '256 KB'] },
      { type: 'toggle', key: 'remote_syslog', label: 'Remote Syslog Server (RFC 5424)', sublabel: 'Stream kernel logread events to central syslog server', apiField: 'remote_syslog', defaultChecked: false },
      { type: 'clickable', key: 'syslog_host', label: 'Remote Syslog Target Host', sublabel: '10.0.0.5:514 (UDP)', modalType: 'text' },
    ],
  },
  packages: {
    title: 'Packages & OPKG',
    badge: 'Software',
    rows: [
      { type: 'info', label: 'Package Manager Core', valueId: 'opkg_version', defaultValue: 'OPKG v0.5.0-3' },
      { type: 'info', label: 'Total Installed Packages', valueId: 'installed_pkgs_count', defaultValue: '128 Packages' },
      { type: 'clickable', key: 'opkg_repo', label: 'Custom Feed Repository URL', sublabel: 'https://downloads.openwrt.org/releases/packages', modalType: 'text' },
      { type: 'toggle', key: 'opkg_autoupdate', label: 'Check Feed Updates on Boot', sublabel: 'Automatically refresh package repository indexes on gateway boot', apiField: 'opkg_autoupdate', defaultChecked: true },
    ],
  },
  'sys-info': {
    title: 'Device Info',
    badge: 'Hardware',
    rows: [
      { type: 'info', label: 'Hardware Architecture', valueId: 'hw_arch', defaultValue: 'MediaTek MT7621AT (MIPS 1004Kc Dual-Core)' },
      { type: 'info', label: 'CPU Clock Speed', valueId: 'cpu_clock', defaultValue: '880 MHz • 4 Hardware Threads' },
      { type: 'info', label: 'System RAM Capacity', valueId: 'ram_capacity', defaultValue: '512 MB DDR3-1200' },
      { type: 'info', label: 'Flash Storage Available', valueId: 'flash_storage', defaultValue: '32 MB SPI NAND Flash' },
      { type: 'info', label: 'System Uptime', valueId: 'uptime', defaultValue: '14 days, 6 hours, 22 mins' },
      { type: 'info', label: 'Linux Kernel Version', valueId: 'kernel_version', defaultValue: 'Linux 6.6.58 (OpenWrt 23.05)' },
    ],
  },
  maintenance: {
    title: 'Maintenance',
    badge: 'Operations',
    rows: [
      { type: 'clickable', key: 'reboot_gateway', label: 'Reboot Gateway', sublabel: 'Safely restart router system services and operating system', modalType: 'text' },
      { type: 'clickable', key: 'usb_power_cycle', label: 'USB Port Power Reset', sublabel: 'Power cycle 5V USB bus to hardware reboot connected LTE modems', modalType: 'text' },
      { type: 'clickable', key: 'backup_config', label: 'Backup Configuration Archive', sublabel: 'Download encrypted .tar.gz archive of router configurations', modalType: 'text' },
      { type: 'clickable', key: 'factory_reset', label: 'Factory Defaults Reset', sublabel: 'Permanently destroy user settings and restore initial defaults', modalType: 'text' },
    ],
  },
  webui: {
    title: 'Web UI & Display',
    badge: 'Appearance',
    rows: [
      { type: 'clickable', key: 'ui_theme', label: 'Color Appearance Theme', sublabel: 'Dark Cyberpunk (Default)', modalType: 'select', options: ['Dark Cyberpunk (Default)', 'Light High-Contrast'] },
      { type: 'clickable', key: 'telemetry_interval', label: 'Telemetry Refresh Interval', sublabel: '3 Seconds (Real-time)', modalType: 'select', options: ['1 Second (Fastest)', '3 Seconds (Real-time)', '5 Seconds', '10 Seconds'] },
      { type: 'toggle', key: 'smooth_anim', label: 'Hardware Accelerated Animations', sublabel: 'Enable fluid UI transitions and 60fps graph animations', apiField: 'smooth_anim', defaultChecked: true },
      { type: 'toggle', key: 'compact_mode', label: 'Compact Card Density', sublabel: 'Reduce card spacing for dense dashboard display', apiField: 'compact_mode', defaultChecked: false },
    ],
  },
  'device-info': {
    title: 'About Developer',
    badge: 'Credits',
    rows: [
      { type: 'info', label: 'Lead Firmware Engineer', valueId: 'dev_name', defaultValue: 'Mahendra Mali - Max' },
      { type: 'info', label: 'Architecture & OS Design', valueId: 'dev_role', defaultValue: 'MAXNET ENTERPRISE ROUTER OS' },
      { type: 'info', label: 'GitHub Repository', valueId: 'dev_github', defaultValue: 'https://github.com/ohhmax' },
      { type: 'info', label: 'Support & Donations', valueId: 'dev_support', defaultValue: 'UPI: 9824584454@ybl' },
      { type: 'info', label: 'License & Copyright', valueId: 'dev_license', defaultValue: 'Copyright (c) 2026 Mahendra Mali' },
    ],
  },
};

interface SettingsDetailProps {
  page?: string;
}

export function SettingsDetail({ page }: SettingsDetailProps) {
  const pageKey = page || 'network';
  const pageDef = SETTINGS_PAGES[pageKey] || {
    title: 'Settings',
    badge: 'CONFIG',
    rows: [],
  };

  const [rowValues, setRowValues] = useState<Record<string, string>>({});
  const [toggleValues, setToggleValues] = useState<Record<string, boolean>>({});
  const [activeModal, setActiveModal] = useState<Extract<SettingRowConfig, { type: 'clickable' }> | null>(null);
  const [modalInputValue, setModalInputValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveText, setSaveText] = useState<string | null>(null);

  const handleToggleChange = async (key: string, apiField: string, newVal: boolean) => {
    setToggleValues((prev) => ({ ...prev, [key]: newVal }));
    setSaving(true);
    setSaveText('Saving changes...');

    try {
      await apiFetch('system', {
        method: 'POST',
        body: JSON.stringify({ [apiField]: newVal ? '1' : '0' }),
      });
      setSaveText('Changes saved');
    } catch {
      setSaveText('Saved locally');
    } finally {
      setTimeout(() => {
        setSaving(false);
        setSaveText(null);
      }, 1500);
    }
  };

  const openModal = (row: Extract<SettingRowConfig, { type: 'clickable' }>) => {
    setActiveModal(row);
    setModalInputValue(rowValues[row.key] || row.sublabel);
  };

  const handleSaveModal = async () => {
    if (!activeModal) return;

    const row = activeModal;
    const val = modalInputValue;
    setRowValues((prev) => ({ ...prev, [row.key]: val }));
    setActiveModal(null);

    setSaving(true);
    setSaveText('Applying configuration...');

    try {
      await apiFetch('system', {
        method: 'POST',
        body: JSON.stringify({ [row.key]: val }),
      });
      setSaveText('Configuration updated');
    } catch {
      setSaveText('Saved locally');
    } finally {
      setTimeout(() => {
        setSaving(false);
        setSaveText(null);
      }, 1500);
    }
  };

  return (
    <div class="min-h-screen flex flex-col bg-[#090b10] text-[#e2e8f0] font-mono pb-20 md:pb-8 select-none">
      <main class="flex-1 max-w-[1000px] w-full mx-auto px-4 py-4 flex flex-col gap-4">
        {/* SubNavBar */}
        <SubNavBar
          title={pageDef.title}
          onBack={() => route('/settings')}
          saving={saving}
          saveText={saveText || undefined}
        />

        {/* Content Card */}
        <Card title={pageDef.title} badge={pageDef.badge || 'CONFIG'} badgeColor="sky">
          <div class="flex flex-col">
            {pageDef.rows.map((row, idx) => {
              if (row.type === 'toggle') {
                const isChecked =
                  toggleValues[row.key] !== undefined
                    ? toggleValues[row.key]
                    : !!row.defaultChecked;

                return (
                  <SettingRow key={idx} label={row.label} sublabel={row.sublabel} arrow={false}>
                    <Toggle
                      checked={isChecked}
                      onChange={(checked) => handleToggleChange(row.key, row.apiField, checked)}
                    />
                  </SettingRow>
                );
              }

              if (row.type === 'clickable') {
                const currentVal = rowValues[row.key] || row.sublabel;

                return (
                  <SettingRow
                    key={idx}
                    label={row.label}
                    sublabel={currentVal}
                    onClick={() => openModal(row)}
                  />
                );
              }

              if (row.type === 'info') {
                return (
                  <SettingRow
                    key={idx}
                    label={row.label}
                    sublabel={row.defaultValue}
                    arrow={false}
                  />
                );
              }

              return null;
            })}
          </div>
        </Card>
      </main>

      {/* Edit Modal */}
      {activeModal && (
        <Modal
          open={!!activeModal}
          onClose={() => setActiveModal(null)}
          title={`Edit ${activeModal.label}`}
          description="Adjust configuration parameter"
          badge="SETTING"
          footer={
            <div class="flex items-center justify-end gap-3 w-full">
              <Button variant="ghost" size="md" onClick={() => setActiveModal(null)}>
                CANCEL
              </Button>
              <Button variant="default" size="md" onClick={handleSaveModal}>
                SAVE
              </Button>
            </div>
          }
        >
          <div class="flex flex-col gap-3 py-2">
            <label class="text-[11px] font-bold uppercase text-maxnet-dim">
              {activeModal.label}
            </label>

            {activeModal.modalType === 'select' && activeModal.options ? (
              <select
                value={modalInputValue}
                onChange={(e) => setModalInputValue((e.target as HTMLSelectElement).value)}
                class="w-full bg-[#111827] border border-white/20 focus:border-[#38bdf8] text-white px-3 py-2.5 rounded-lg text-xs font-mono outline-none cursor-pointer"
              >
                {activeModal.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : activeModal.modalType === 'number' ? (
              <input
                type="number"
                value={modalInputValue}
                onInput={(e) => setModalInputValue((e.target as HTMLInputElement).value)}
                class="w-full bg-[#111827] border border-white/20 focus:border-[#38bdf8] text-white px-3 py-2.5 rounded-lg text-xs font-mono outline-none"
              />
            ) : (
              <input
                type="text"
                value={modalInputValue}
                onInput={(e) => setModalInputValue((e.target as HTMLInputElement).value)}
                class="w-full bg-[#111827] border border-white/20 focus:border-[#38bdf8] text-white px-3 py-2.5 rounded-lg text-xs font-mono outline-none"
              />
            )}
          </div>
        </Modal>
      )}

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab="settings"
        onTabChange={(tab) => {
          if (tab === 'overview') route('/');
          if (tab === 'settings') route('/settings');
        }}
      />
    </div>
  );
}

export default SettingsDetail;
