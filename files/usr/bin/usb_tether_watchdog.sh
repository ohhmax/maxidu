#!/bin/sh
# USB 3.0 Tethering Self-Healing Watchdog (Intelligent State Guard)
export HOME=/root
export ADB_MDNS_OPENSCREEN=0

FAIL_COUNT=0

while true; do
    sleep 10

    # 1. Check if external internet is alive
    if ping -c 2 -W 3 8.8.8.8 >/dev/null 2>&1; then
        FAIL_COUNT=0
        continue
    fi

    # 2. Check if local phone gateway is alive (from ip route)
    GW=$(ip route show default dev usb0 2>/dev/null | awk '{print $3}' | head -n 1)
    if [ -n "$GW" ] && ping -c 1 -W 2 "$GW" >/dev/null 2>&1; then
        # USB link to phone is healthy; WAN cellular is just temporarily latent/busy
        FAIL_COUNT=0
        continue
    fi

    FAIL_COUNT=$((FAIL_COUNT + 1))
    logger -t usb_watchdog "Gateway ping failed (fail count: $FAIL_COUNT)"

    # Require 3 consecutive failures (~30s) before taking intrusive actions
    if [ "$FAIL_COUNT" -ge 3 ]; then
        logger -t usb_watchdog "Link genuinely down, initiating smart recovery..."

        # Try DHCP lease renewal first
        if ifconfig usb0 >/dev/null 2>&1; then
            ethtool -K usb0 gro off gso off tso off 2>/dev/null || true
            ifconfig usb0 txqueuelen 5000 2>/dev/null || true
            ifup wan_usb
            sleep 5
            if ping -c 1 -W 2 8.8.8.8 >/dev/null 2>&1; then
                logger -t usb_watchdog "Recovered via ifup wan_usb"
                FAIL_COUNT=0
                continue
            fi
        fi

        # Check phone status via ADB
        if adb devices 2>/dev/null | grep -q "device$"; then
            USB_STATE=$(adb shell getprop sys.usb.state 2>/dev/null)
            logger -t usb_watchdog "Phone ADB detected. sys.usb.state: $USB_STATE"

            # ONLY tap tethering switch if RNDIS is NOT active
            case "$USB_STATE" in
                *rndis*)
                    logger -t usb_watchdog "RNDIS tethering already enabled on phone. Refreshing network only."
                    ifup wan_usb
                    ;;
                *)
                    logger -t usb_watchdog "RNDIS disabled on phone. Remotely enabling USB tethering..."
                    adb shell svc power stayon true 2>/dev/null || true
                    adb shell settings put global stay_on_while_plugged_in 7 2>/dev/null || true
                    adb shell dumpsys deviceidle disable 2>/dev/null || true
                    adb shell am start -a android.settings.TETHER_SETTINGS >/dev/null 2>&1
                    sleep 2
                    adb shell input tap 960 757
                    sleep 4
                    ifup wan_usb
                    ;;
            esac
        fi

        FAIL_COUNT=0
        sleep 15
    fi
done
