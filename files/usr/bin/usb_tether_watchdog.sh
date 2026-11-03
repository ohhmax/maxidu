#!/bin/sh
# USB 3.0 Tethering Self-Healing Watchdog
export ADB_MDNS_OPENSCREEN=0

FAIL_COUNT=0

while true; do
    sleep 10
    
    # Check if internet gateway is alive
    if ping -c 1 -W 2 8.8.8.8 >/dev/null 2>&1; then
        FAIL_COUNT=0
        continue
    fi

    FAIL_COUNT=$((FAIL_COUNT + 1))
    
    # If 2 consecutive failures, take corrective action
    if [ "$FAIL_COUNT" -ge 2 ]; then
        logger -t usb_watchdog "Internet connectivity lost (fail count: $FAIL_COUNT), attempting self-healing..."
        
        # 1. Try DHCP renewal first if interface exists
        if ifconfig usb0 >/dev/null 2>&1; then
            ethtool -K usb0 gro off gso off tso off 2>/dev/null || true
            ifconfig usb0 txqueuelen 5000 2>/dev/null || true
            ifup wan_usb
            sleep 4
            if ping -c 1 -W 2 8.8.8.8 >/dev/null 2>&1; then
                logger -t usb_watchdog "Recovered via ifup wan_usb"
                FAIL_COUNT=0
                continue
            fi
        fi

        # 2. Check if ADB sees the phone on roof
        if adb devices 2>/dev/null | grep -q "device$"; then
            logger -t usb_watchdog "Phone reachable via ADB, remotely re-enabling USB tethering..."
            # Wake up and open tether settings
            adb shell svc power stayon true 2>/dev/null || true
            adb shell settings put global stay_on_while_plugged_in 7 2>/dev/null || true
            adb shell dumpsys deviceidle disable 2>/dev/null || true
            adb shell am start -a android.settings.TETHER_SETTINGS >/dev/null 2>&1
            sleep 1
            # Toggle tethering switch (X=960, Y=757)
            adb shell input tap 960 757
            sleep 2
            adb shell input tap 960 757
            sleep 3
            ifup wan_usb
        fi

        FAIL_COUNT=0
        sleep 10
    fi
done
