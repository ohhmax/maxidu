<div align="center">

# MaxNet OpenWrt for Jio AirFiber IDU
### JIDU6811 / JIDU6J11 (Qualcomm IPQ9574 / IPQ9554)
#### Specialized Branch: `usb-lan-adb` (USB 3.0 SuperSpeed + LAN + ADB + Port 80 Web Monitor)

Official high-performance OpenWrt **Linux 6.18 (AArch64 64-bit)** firmware engineered specifically for high-speed mobile tethering, pure Gigabit LAN routing, and remote ADB modem management.

[![Build Status](https://github.com/ohhmax/maxidu/actions/workflows/maxnet.yml/badge.svg)](https://github.com/ohhmax/maxidu/actions/workflows/maxnet.yml)
[![Release](https://img.shields.io/github/v/release/ohhmax/maxidu?color=blue&label=release)](https://github.com/ohhmax/maxidu/releases/latest)
[![License](https://img.shields.io/github/license/ohhmax/maxidu?color=lightgrey)](LICENSE)

</div>

---

## 📑 Table of Contents

- [⚡ Specialized Edition Features (`usb-lan-adb`)](#-specialized-edition-features-usb-lan-adb)
- [📊 Hardware Specifications & Subsystem Status](#-hardware-specifications--subsystem-status)
- [🔑 Default Firmware Settings](#-default-firmware-settings)
- [🖥️ Port 80 Monochrome Web Monitor](#️-port-80-monochrome-web-monitor)
- [🛠️ Kernel Fix: High-Speed Multi-Packet Aggregation](#️-kernel-fix-high-speed-multi-packet-aggregation)
- [📦 Installation & Flashing Instructions](#-installation--flashing-instructions)
  - [Method A: SSH Flash via Terminal (Fastest)](#method-a-ssh-flash-via-terminal-fastest)
  - [Method B: RAM Boot via TFTP in U-Boot](#method-b-ram-boot-via-tftp-in-u-boot)
- [💡 Connected ADB Device & 5G Management](#-connected-adb-device--5g-management)
- [❓ FAQ & Technical Notes](#-faq--technical-notes)

---

## ⚡ Specialized Edition Features (`usb-lan-adb`)

This branch is a streamlined, enterprise-grade firmware tailored specifically for users who connect a 5G/4G smartphone or USB modem as their primary WAN gateway:

1. **SuperSpeed USB 3.0 (5000 Mbps) with Multi-Packet Aggregation:**
   - Custom Linux 6.18 kernel patch (`0800-net-usb-rndis_host-support-superspeed-aggregation.patch`).
   - Fixes the classic Linux `rndis_host` bug where downlink speeds exceeding 45 MB/s (>360 Mbps) trigger packet drops (`rx_errors`) and `EVENT_RX_KILL` interface crashes.
   - Tested and verified at full line rate (>135 Mbps single stream, multi-stream gigabit bursts) with **0 packet drops and 0 errors across millions of packets**.

2. **Firmware-Level Zero-Wi-Fi Architecture (Maximum Free RAM):**
   - Completely removes Wi-Fi drivers (`ath11k`, `mac80211`, `cfg80211`) and proprietary firmware blobs (~30 MB).
   - Qualcomm Hexagon Q6 wireless coprocessor (`q6v5_wcss`) and radios (`wifi0`, `wifi1`) are permanently disabled at Device Tree (`DTS`) and kernel level.
   - Reclaims ~150–200 MB of system RAM previously consumed by Host Memory Buffers (HMB), leaving **~300+ MB of RAM free** for line-rate routing and caching.

3. **Built-in Android Debug Bridge (ADB):**
   - Native ADB client and daemon integrated into the rootfs.
   - Pre-installed authorization keys allowing passwordless, zero-touch remote management of roof-mounted or headless smartphones.
   - Query live 5G signal metrics (RSRP, SINR, RSRQ, Band n77), battery health, thermals, and reboot device via CLI.

4. **Zero-Overhead Monochrome Web Monitor on Port 80:**
   - Ultra-clean, dark terminal-style dashboard accessible at `http://10.0.0.1/`.
   - Strictly monochrome (grayscale, black/white, zero emojis) with monospace typography.
   - **Pure On-Demand Execution:** Zero background loops, no cron jobs, 0.00% background CPU utilization, and `< 1.1 MB` RAM consumption.

5. **Qualcomm PPE Hardware Acceleration:**
   - 4x Gigabit LAN ports (`lan1`–`lan4`) accelerated with Qualcomm Packet Processing Engine (PPE) hardware offload.

---

## 📊 Hardware Specifications & Subsystem Status

| Subsystem | Status | Technical Details |
| :--- | :---: | :--- |
| **SoC / CPU** | 🟢 Active | Qualcomm IPQ9574 (Quad-Core ARM Cortex-A73 @ 2.2 GHz, AArch64 64-bit) |
| **System Memory** | 🟢 Optimized | 512 MB DDR4 RAM (~300+ MB Free, Zero Wi-Fi DMA Overhead) |
| **Storage (Flash)** | 🟢 Active | 256 MB Winbond SPI NAND (`/overlay` with ~173 MB free space) |
| **USB 3.0 Subsystem** | 🟢 SuperSpeed | Locked SuperSpeed 5000 Mbps (`dwc3-qcom`), MTU 1400 |
| **Ethernet LAN** | 🟢 Active | 4x Gigabit LAN (Yellow Ports, `lan1`–`lan4`) bridged to `br-lan` with PPE hardware NAT |
| **Ethernet WAN** | 🟢 Ready | 1x 2.5G/1G WAN (Blue Port, `wan`) |
| **Wi-Fi Subsystems** | ⚪ Disabled | Permanently disabled at DTS/Firmware level to optimize RAM & thermals |
| **Web Monitor** | 🟢 Active | Lightweight Port 80 Monochrome Dashboard (`http://10.0.0.1/`) |
| **SSH Management** | 🟢 Active | Port 22 (`root@10.0.0.1`), Dropbear with blank password default |
| **ADB Management** | 🟢 Active | Local ADB daemon + wrapper (`adb devices`, `adb shell`) |

---

## 🔑 Default Firmware Settings

| Setting | Default Value | Notes |
| :--- | :--- | :--- |
| **Router LAN IP** | `10.0.0.1` | Subnet: `255.255.255.0` (`/24`), Secondary Alias: `10.0.0.254` |
| **Web Monitor (Port 80)** | **[http://10.0.0.1](http://10.0.0.1)** | Instant monochrome status monitor (No login required) |
| **SSH Access** | `ssh root@10.0.0.1` | Port `22` (No password required by default) |
| **WAN Interface** | `wan_usb` (`usb0`) | Automatic DHCP client for USB 3.0 mobile tethering |
| **ADB Service** | Port `5037` | Managed locally via `adb` CLI command on the router |

---

## 🖥️ Port 80 Monochrome Web Monitor

Access **`http://10.0.0.1/`** in any web browser connected to a LAN port:

```text
+-----------------------------------------------------------------------------+
| MAXNET // GATEWAY MONITOR                                                   |
| USB 3.0 LAN + 5G SA MODEM • ZERO BACKGROUND OVERHEAD                        |
|                                         [ ] AUTO-REFRESH (10s)  [ REFRESH ] |
+-----------------------------------------------------------------------------+
| [01] 5G MODEM (ADB) [SM-G990B2]       | [02] ROUTER SYSTEM         [ONLINE] |
| ------------------------------------- | ----------------------------------- |
| NETWORK / RAT : Jio True5G [NR_SA]    | SOC / PLATFORM: IPQ9574 [LINUX 6.18]|
| 5G BAND       : BAND N77 (3.5 GHZ)    | UPTIME        : 14H 22M             |
| SIGNAL METRICS: |||| RSRP: -99 DBM    | LOAD AVG      : 0.00 / 0.02 / 0.00  |
| BATTERY LEVEL : 99% [FULL / TRICKLE]  | SOC TEMP      : 49.3 C              |
| BATTERY TEMP  : 34.2 C / 4248 MV      | SYSTEM MEMORY : 310 MB FREE (68%)   |
| INTERNAL STOR : 218 GB FREE / 224 GB  | OVERLAY FLASH : 173 MB FREE / 178 MB|
+-----------------------------------------------------------------------------+
| [03] USB 3.0 TETHER INTERFACE (usb0)                    [SUPERSPEED 5000 MBPS]|
| --------------------------------------------------------------------------- |
| RX VOLUME: 1,493.96 MB (1,219,337 PKTS)  | TX VOLUME: 80.81 MB (359,493 PKTS)|
| ERROR COUNTERS: 0 ERR / 0 DROP           | LINK MTU : 1400 BYTES [FQ_CODEL]  |
+-----------------------------------------------------------------------------+
```

### Key Technical Properties:
* **Zero Background Overhead:** Data is polled ONLY when a user opens the page or hits `[ REFRESH ]`. When the tab is closed, CPU utilization remains `0.00%`.
* **Microfootprint Web Server:** Powered by OpenWrt's native `uhttpd` utilizing only ~1.1 MB RAM.
* **Strict Monochrome:** Pure `#000000` dark background, `#ffffff` typography, and `#242424` borders without emojis.

---

## 🛠️ Kernel Fix: High-Speed Multi-Packet Aggregation & RX Starvation Prevention

### The Root Cause:
1. **Multi-Frame Aggregation (`rndis_host`):** Stock Linux `rndis_host.c` assumes a 1:1 mapping between bulk IN USB transfers and network packets (`sk_buff`). Modern 5G smartphones (especially Samsung Galaxy devices on Android 14/15/16) aggregate dozens of Ethernet frames into single 32 KB transfers followed by zero padding. Stock drivers flag trailing zeros as length errors, accumulating `rx_errors` and halting the interface.
2. **RX Ring Starvation & Deadlock (`usbnet`):** Linux `usbnet.c` sets `rx_qlen = 5 * MAX_QUEUE_MEMORY / rx_urb_size`. For SuperSpeed 32 KB URBs, `rx_qlen` is only **13 URBs** (~416 KB). At sustained high throughput (>45 MB/s), any transient USB PHY jitter drains all 13 URBs within milliseconds. If an `-EPROTO` error triggers the 125ms throttle timer, `usbnet_bh()` skips replenishing URBs while the queue is empty, permanently starving the host controller ring and causing complete internet dropouts.

### The Two-Tiered Solution in MaxNet `usb-lan-adb`:
* **Patch `0800-net-usb-rndis_host-support-superspeed-aggregation.patch`:**
  - Enables `FLAG_MULTI_PACKET` on `rndis_info`.
  - Inner packet extraction loop in `rndis_rx_fixup()` that unpacks each concatenated frame into its own `sk_buff` and delivers it via `usbnet_skb_return()`.
  - Graceful termination on padding zeros without incrementing error counters.
* **Patch `0801-net-usb-usbnet-prevent-rx-queue-starvation.patch`:**
  - Expands SuperSpeed `rx_qlen` to at least **32 URBs (~1 MB depth)** and `tx_qlen` to 64 URBs.
  - Aggressive queue replenishment: `rx_alloc_submit()` refills up to `RX_QLEN` immediately whenever `dev->rxq.qlen == 0`.
  - Anti-deadlock bypass: in `usbnet_bh()`, if `dev->rxq.qlen == 0`, immediately submits replenishment URBs without waiting for the throttle timer.
  - Self-healing `EVENT_RX_HALT`: unblocks RX processing even if `usb_clear_halt()` encounters transient USB errors.
* **Self-Healing Watchdog:**
  - Automated detection and hardware-level USB bus rebind (`unbind` -> `bind` on `/sys/bus/usb/drivers/usb/*-*`) to reset xHCI controller rings and recover leases in under 3 seconds if connectivity ever stalls.

---

## 📦 Installation & Flashing Instructions

### Method A: SSH Flash via Terminal (Fastest)

If your router is already running OpenWrt:

1. Download the latest `sysupgrade.bin` from [Releases](https://github.com/ohhmax/maxidu/releases):
   ```bash
   curl -sL https://github.com/ohhmax/maxidu/releases/latest/download/sysupgrade.bin -o sysupgrade.bin
   ```

2. Transfer the image to the router's `/tmp` directory:
   ```bash
   cat sysupgrade.bin | ssh root@10.0.0.1 "cat > /tmp/sysupgrade.bin"
   ```

3. Flash the firmware permanently (wiping clean overlay):
   ```bash
   ssh root@10.0.0.1 "sysupgrade -v -n /tmp/sysupgrade.bin"
   ```

The router will write the flash memory, cleanly reboot within 30 seconds, and emerge with the new kernel and Web Monitor active.

---

### Method B: RAM Boot via TFTP in U-Boot

If setting up for the first time or recovering:

1. Connect PC via Ethernet cable to **LAN4 (or WAN)** and set static IP: `192.168.1.2/24`.
2. Place `initramfs.itb` in your TFTP server directory (`/srv/tftp/initramfs.itb`).
3. Connect UART serial adapter (115200 8N1) and stop autoboot in U-Boot.
4. Execute in U-Boot:
   ```text
   setenv ipaddr 192.168.1.10
   setenv serverip 192.168.1.2
   dcache off; icache off
   setenv fdt_high
   setenv initrd_high
   setenv bootargs "console=ttyMSM0,115200n8 earlycon"
   tftpboot 0x46000000 initramfs.itb
   bootm 0x46000000
   ```

---

## 💡 Connected ADB Device & 5G Management

From the router SSH terminal, manage the connected smartphone directly:

* **Verify Connection:**
  ```bash
  adb devices
  ```
* **Check 5G Cell Details & Signal:**
  ```bash
  adb shell "dumpsys telephony.registry | grep -m 1 mCellInfo="
  ```
* **Check Battery & Charging State:**
  ```bash
  adb shell "dumpsys battery | head -n 15"
  ```
* **Reboot Phone Remotely:**
  ```bash
  adb reboot
  ```

---

## ❓ FAQ & Technical Notes

#### Q: How can I change the router LAN IP?
Edit `/etc/config/network`:
```bash
uci set network.lan.ipaddr="192.168.1.1"
uci commit network
/etc/init.d/network restart
```

#### Q: Is LuCI Web UI included?
No. To maximize free memory, reduce attack surface, and prevent flash wear, LuCI is omitted. The lightweight Port 80 Web Monitor (`http://10.0.0.1/`) provides real-time system and modem diagnostics with zero overhead.

#### Q: Can I re-enable Wi-Fi?
If you require Wi-Fi, use the `main` branch of MaxNet. The `usb-lan-adb` branch intentionally disables Wi-Fi hardware to maximize RAM, lower thermal dissipation on roof deployments, and focus purely on wired Gigabit routing.

---

<div align="center">
Built for high-performance tethering & zero-compromise stability.
</div>
