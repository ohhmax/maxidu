# MAXNET UI Restoration: Test Infrastructure & E2E Validation Framework

## Overview
The MAXNET E2E Test Suite provides opaque-box, requirement-driven automated verification for the restored MAXNET cybernetic gateway frontend and OpenWrt backend services. The test harness is written in pure Node.js v26 utilizing built-in Web Standards (`fetch`, `crypto.subtle`, `WebSocket`), requiring zero third-party npm packages.

## Test Philosophy & Methodology
- **Opaque-Box & Requirement-Driven**: Tests validate system behavior through external HTTP, WebSocket, and DOM interfaces derived directly from `ORIGINAL_REQUEST.md` and user specifications, strictly independent of internal implementation artifacts.
- **Systematic 4-Tier Hierarchy**: Category-Partition feature equivalence partitioning, Boundary Value Analysis (BVA), Pairwise combinatorial testing, and Real-World workload application scenarios.
- **Zero-Dependency Native Execution**: Built using modern Node.js v26 web standards for maximum portability, speed (<5s full suite run), and zero npm dependency drift.
- **Fail-Safe & Idempotent**: All mutation tests include automated state capture and rollback teardown hooks to ensure tests leave router UCI configurations pristine.

## Test Matrix & Tiers

| Tier | Name | Target Scope | Key Verification Points | Threshold |
|------|------|--------------|-------------------------|-----------|
| **Tier 1** | **Feature Coverage** | Build artifacts, 21 CGI endpoints, WebCrypto RSA-OAEP, ttyd terminal, SVG topology, USB WAN, settings | Status 200, JSON schema integrity, SPKI import, RSA-OAEP handshake, WebSocket protocol, bundle size <200KB | ≥ 11 tests |
| **Tier 2** | **Boundary & Negative Cases** | Nonce replay, malformed crypto, brute-force lockout, MTU boundaries, invalid tokens | Nonce replay rejected, invalid password attempts tracked, lockout warning, malformed cipher handled cleanly | ≥ 7 tests |
| **Tier 3** | **Cross-Feature Workflows** | Auth lifecycle, settings mutation, USB multipath modes, traffic deltas | Challenge -> login -> list_sessions -> logout, non-destructive config read/write, delta throughput calculation | ≥ 5 tests |
| **Tier 4** | **System E2E & Deployment** | Live uhttpd deployment, headless DOM rendering, terminal stream, latency | Clean HTTP 200 asset delivery, Chromium headless DOM mounting, bidirectional shell echo, RTT <5ms | ≥ 4 tests |

## Prerequisites & Environment
- **Node.js**: v20+ (verified with native v26.13.0 built-ins).
- **Target Router**: `10.0.0.1` (configurable via `ROUTER_IP`).
- **Target Ports**: Port 80 (uhttpd HTTP), Port 7681 (ttyd WebSocket), Port 22 (SSH).
- **Credentials**: Username `root`, Password `1024` (configurable via `ROUTER_PASS`).
- **Headless Browser**: Optional for Tier 4 DOM dump (`/home/max/.local/bin/chromium`).

## CLI Invocation & Commands

### Quick Run
```bash
# Run all test tiers sequentially
node tests/e2e/runner.js --all

# Or via executable bash wrapper
./tests/e2e/run.sh --all
```

### Targeted Tier Execution
```bash
# Run Tier 1 (Feature Coverage)
node tests/e2e/runner.js --tier 1

# Run Tier 2 (Boundary & Corner Cases)
node tests/e2e/runner.js --tier 2

# Run Tier 3 (Cross-Feature Workflows)
node tests/e2e/runner.js --tier 3

# Run Tier 4 (System E2E & Live Deployment)
node tests/e2e/runner.js --tier 4
```

### Execution Options & Flags
```bash
# Custom target IP and root password
node tests/e2e/runner.js --target 10.0.0.1 --pass 1024 --all

# Output TAP v13 test stream for CI/CD
node tests/e2e/runner.js --all --tap

# Verbose logging with payload dumps
node tests/e2e/runner.js --tier 1 --verbose

# Per-test timeout configuration (in ms)
node tests/e2e/runner.js --all --timeout 6000
```

## Exit Codes & Output Format
- **Exit Code 0**: 100% of executed test cases passed cleanly.
- **Exit Code 1**: One or more test cases failed or timed out.
- **Console Reporting**:
  - Colorized ANSI test table showing test ID, title, elapsed execution time, and PASS/FAIL badge.
  - Test summary block with total tests, passed, failed, skipped, and total elapsed duration.
  - Full stack trace and diagnostic diff on test failures.

## Directory Layout
```
tests/e2e/
├── harness.js                  # Shared test harness, assertion utilities & WebCrypto helpers
├── runner.js                   # Master CLI test runner & argument parser
├── run.sh                      # Executable bash launcher wrapper
├── tier1_features.test.js      # Tier 1: Feature Coverage test suite
├── tier2_boundaries.test.js    # Tier 2: Boundary & Corner Cases test suite
├── tier3_combinations.test.js  # Tier 3: Cross-Feature Interactions test suite
└── tier4_scenarios.test.js     # Tier 4: Real-World Application Scenarios test suite
```

## Test Inventory

### Tier 1: Feature Coverage
1. `T1.1_BUILD_ASSETS`: Production distribution in `files/www/dist/` contains valid `index.html`, CSS, and JS bundles totaling < 200 KB uncompressed.
2. `T1.2_CGI_AUTH`: `/cgi-bin/auth?action=challenge` returns valid 2048-bit RSA SPKI public key and single-use hex nonce.
3. `T1.3_CGI_ENDPOINTS`: All 21 POSIX CGI endpoints return HTTP 200 and parse as valid JSON / gzip tarball.
4. `T1.4_WEBCRYPTO_LOGIN`: WebCrypto RSA-OAEP SHA-256 encrypted login with password `1024` succeeds and issues active session token.
5. `T1.5_TTYD_WS_CONNECT`: WebSocket connection to `ws://10.0.0.1:7681/ws` with `tty` subprotocol accepts terminal handshake.
6. `T1.6_TOPOLOGY_TREE`: `/cgi-bin/topology_layers` returns 4-tier tree structure with root router, switch ports, and active clients.
7. `T1.7_USB_WAN_FLEET`: `/cgi-bin/usb_wan` exposes active modem slots, RSRP/SINR telemetry, and multipath routing state.
8. `T1.8_ADB_INSPECTOR`: `/cgi-bin/device` returns connected ADB devices, battery telemetry, and hardware controls.
9. `T1.9_TRAFFIC_TELEMETRY`: `/cgi-bin/status` reports real-time WAN/LAN byte counters, memory, CPU load, and temperature.
10. `T1.10_SETTINGS_GRID`: All 24 settings panels and 48 configuration keys are represented in frontend templates.
11. `T1.11_CYBERPUNK_THEMES`: Dark theme (`#080808`) and light theme (`#f4f4f5`) CSS custom properties are defined in stylesheets.

### Tier 2: Boundary & Negative Cases
1. `T2.1_NONCE_REPLAY_REJECTION`: Reusing a previously consumed challenge nonce fails with security replay error.
2. `T2.2_MALFORMED_CIPHERTEXT`: Sending invalid or corrupted RSA base64 payload returns decryption error without server crash.
3. `T2.3_INVALID_PASSWORD_COUNTER`: Attempting login with incorrect password decrements attempt counter and logs security warning.
4. `T2.4_UNAUTHORIZED_ACTION`: Invoking protected endpoints without valid token returns unauthorized status.
5. `T2.5_SPECIAL_CHARS_CONFIG`: Configuration values containing hyphens, underscores, dots, and spaces parse without shell injection.
6. `T2.6_MTU_BOUNDARIES`: MTU settings reject values below 576 or above 9000; correctly accepts 1400 (USB WAN standard).
7. `T2.7_MISSING_PARAMS`: CGI scripts handle missing query/POST parameters gracefully with descriptive error JSON.

### Tier 3: Cross-Feature Workflows
1. `T3.1_AUTH_LIFECYCLE`: Challenge -> RSA-OAEP encrypt -> login -> session verification -> session listing -> clean logout.
2. `T3.2_CONFIG_MUTATION_LIFECYCLE`: Read setting -> update non-destructive key (e.g. webhook label) -> verify readback -> restore original value.
3. `T3.3_USB_WAN_MODE_SWITCH`: Query multipath mode -> toggle between failover and balanced -> verify routing daemon state.
4. `T3.4_TRAFFIC_POLLING_DELTA`: Poll `/cgi-bin/status` at 2s interval, assert monotonic byte counter progression, and verify rate calculation.
5. `T3.5_DIAGNOSTICS_PIPELINE`: Trigger ping diagnostics to `127.0.0.1`, poll result status, and verify latency metrics.

### Tier 4: System E2E & Deployment
1. `T4.1_ROUTER_SERVING_VERIFICATION`: Target router `http://10.0.0.1/` serves `index.html` and assets with zero 404s.
2. `T4.2_HEADLESS_DOM_MOUNT`: Headless Chromium mounts cybernetic SPA into `#app`, verifying header, throughput cards, and topology elements.
3. `T4.3_NETWORK_STABILITY`: 50 consecutive ICMP ping packets sustain < 2ms RTT with 0% packet loss.
4. `T4.4_TERMINAL_BIDIRECTIONAL_STREAM`: Send interactive root shell command (`uname -a`) over WebSocket and verify returned Linux kernel banner.
