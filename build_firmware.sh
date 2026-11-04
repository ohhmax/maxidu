#!/usr/bin/env bash
set -e

BASE_DIR="/home/max/Projects"
CUSTOM_DIR="${BASE_DIR}/maxidu"
BUILD_DIR="${BASE_DIR}/openwrt"

echo "========================================================"
echo " [*] MAXNET OPENWRT LOCAL FIRMWARE BUILD ENGINE"
echo "========================================================"

if [ ! -d "${BUILD_DIR}/.git" ]; then
    echo "[*] Cloning OpenWrt shallow repository..."
    git clone --depth 1 https://github.com/openwrt/openwrt.git "${BUILD_DIR}"
fi

cd "${BUILD_DIR}"

echo "[*] Syncing custom MaxNet files and DTS overlays..."
cp -r "${CUSTOM_DIR}/files" "${BUILD_DIR}/"
mkdir -p "${BUILD_DIR}/target/linux/qualcommbe/dts/qcom/"
cp -r "${CUSTOM_DIR}/target/linux/qualcommbe/"* "${BUILD_DIR}/target/linux/qualcommbe/"

echo "[*] Stripping debug symbols in target config-6.18..."
sed -i 's/CONFIG_DEBUG_INFO=y/# CONFIG_DEBUG_INFO is not set\nCONFIG_DEBUG_INFO_NONE=y/g' target/linux/qualcommbe/config-6.18 2>/dev/null || true
sed -i 's/CONFIG_DEBUG_BUGVERBOSE=y/# CONFIG_DEBUG_BUGVERBOSE is not set/g' target/linux/qualcommbe/config-6.18 2>/dev/null || true
sed -i 's/CONFIG_LOCK_DEBUGGING_SUPPORT=y/# CONFIG_LOCK_DEBUGGING_SUPPORT is not set/g' target/linux/qualcommbe/config-6.18 2>/dev/null || true
sed -i 's/CONFIG_ARM64_PTR_AUTH=y/# CONFIG_ARM64_PTR_AUTH is not set/g' target/linux/qualcommbe/config-6.18 2>/dev/null || true
sed -i 's/CONFIG_ARM64_PTR_AUTH_KERNEL=y/# CONFIG_ARM64_PTR_AUTH_KERNEL is not set/g' target/linux/qualcommbe/config-6.18 2>/dev/null || true
sed -i 's/CONFIG_ARM64_GCS=y/# CONFIG_ARM64_GCS is not set/g' target/linux/qualcommbe/config-6.18 2>/dev/null || true
sed -i 's/CONFIG_ARM64_SVE=y/# CONFIG_ARM64_SVE is not set/g' target/linux/qualcommbe/config-6.18 2>/dev/null || true

echo "[*] Registering JIDU6811 & JIDU6911 device profiles..."
python3 "${CUSTOM_DIR}/.github/scripts/add_device.py" target/linux/qualcommbe/image/ipq95xx.mk

echo "[*] Updating and installing OpenWrt package feeds..."
./scripts/feeds update -a
./scripts/feeds install -a

rm -rf tmp

echo "[*] Configuring .config..."
python3 "${CUSTOM_DIR}/.github/scripts/write_config.py" .config
make defconfig
python3 "${CUSTOM_DIR}/.github/scripts/write_config.py" .config
make defconfig

echo "[*] Downloading sources..."
make download -j$(nproc)

echo "[*] Compiling OpenWrt Firmware (this will take time)..."
make -j$(nproc)

echo "========================================================"
echo " [🎉] BUILD COMPLETE! Binaries located in:"
echo "      ${BUILD_DIR}/bin/targets/qualcommbe/ipq95xx/"
echo "========================================================"
