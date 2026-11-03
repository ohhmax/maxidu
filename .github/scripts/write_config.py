#!/usr/bin/env python3
"""Writes minimal OpenWrt .config for JioRouter AX6000 (JIDU6J11-6811 / JIDU6811)
Specialized build: USB 3.0 High-Speed Tethering + ADB + LAN + SSH (NO LuCI, NO Wi-Fi)
"""
import sys

config = [
    "CONFIG_TARGET_qualcommbe=y",
    "CONFIG_TARGET_qualcommbe_ipq95xx=y",
    "CONFIG_TARGET_qualcommbe_ipq95xx_DEVICE_jiorouter_ax6000-jidu6j11-6811=y",
    "CONFIG_TARGET_qualcommbe_ipq95xx_DEVICE_jiorouter_ax6000-jidu6j11-6911=y",
    "CONFIG_TARGET_qualcommbe_ipq95xx_DEVICE_jio_jidu6811=y",
    "CONFIG_TARGET_ROOTFS_INITRAMFS=y",
    "CONFIG_TARGET_INITRAMFS_FORCE=y",
    "CONFIG_KERNEL_GZIP=y",
    "CONFIG_DEVEL=y",
    "CONFIG_CCACHE=y",

    # Explicitly strip kernel debug symbols & bloat to keep vmlinux lean & fast
    "CONFIG_KALLSYMS_ALL=n",
    "CONFIG_DEBUG_INFO=n",
    "CONFIG_DEBUG_INFO_NONE=y",
    "CONFIG_DYNAMIC_DEBUG=n",
    "CONFIG_SLUB_DEBUG=n",
    "CONFIG_DEBUG_BUGVERBOSE=n",
    "CONFIG_LOCK_DEBUGGING_SUPPORT=n",

    # Essential built-in SoC clock controllers, ethernet & PPE flow acceleration
    "CONFIG_PACKAGE_kmod-qcom-gcc-ipq9574=y",
    "CONFIG_PACKAGE_kmod-qcom-nsscc-ipq9574=y",
    "CONFIG_PACKAGE_kmod-pcs-qcom-ipq9574=y",
    "CONFIG_PACKAGE_kmod-qcom-ppe=y",

    # GPIO, LEDs, Buttons & Triggers
    "CONFIG_PACKAGE_kmod-leds-gpio=y",
    "CONFIG_PACKAGE_kmod-gpio-button-hotplug=y",
    "CONFIG_PACKAGE_kmod-ledtrig-netdev=y",

    # High-Performance USB 3.0 & Mobile Tethering Stack (RNDIS + NCM + CDC Ether)
    "CONFIG_PACKAGE_kmod-usb3=y",
    "CONFIG_PACKAGE_kmod-usb-dwc3=y",
    "CONFIG_PACKAGE_kmod-usb-dwc3-qcom=y",
    "CONFIG_PACKAGE_kmod-usb-net=y",
    "CONFIG_PACKAGE_kmod-usb-net-rndis=y",
    "CONFIG_PACKAGE_kmod-usb-net-cdc-ether=y",
    "CONFIG_PACKAGE_kmod-usb-net-cdc-ncm=y",

    # Android Debug Bridge (ADB)
    "CONFIG_PACKAGE_adb=y",

    # Networking, Firewall & Hardware Flow Offloading
    "CONFIG_PACKAGE_firewall4=y",
    "CONFIG_PACKAGE_nftables=y",
    "CONFIG_PACKAGE_kmod-nft-offload=y",
    "CONFIG_PACKAGE_kmod-shortcut-fe=y",
    "CONFIG_PACKAGE_kmod-shortcut-fe-cm=y",

    # CLI Management & System tools (NO LuCI WebUI, NO Wi-Fi)
    "CONFIG_PACKAGE_busybox=y",
    "CONFIG_PACKAGE_dropbear=y",
    "CONFIG_PACKAGE_mtd=y",
    "CONFIG_PACKAGE_uboot-envtools=y",
    "CONFIG_PACKAGE_ethtool=y",
    "CONFIG_PACKAGE_iperf3=y",
    "CONFIG_PACKAGE_htop=y",
    "CONFIG_PACKAGE_curl=y",
]

out = sys.argv[1] if len(sys.argv) > 1 else ".config"
with open(out, 'w') as f:
    f.write('\n'.join(config) + '\n')

print("Written", out)
