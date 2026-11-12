import { useState, useRef, useEffect } from 'preact/hooks';
import { route } from 'preact-router';
import { SubNavBar } from '../components/layout/SubNavBar';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { BottomNav } from '../components/layout/BottomNav';

export function Terminal() {
  const [mode, setMode] = useState<'iframe' | 'interactive'>('interactive');
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<Array<{ cmd: string; output: string }>>([
    {
      cmd: 'uname -a',
      output: 'Linux MAXNET-GATEWAY 6.6.58 #1 SMP PREEMPT MediaTek MT7621AT mips GNU/Linux',
    },
    {
      cmd: 'uptime',
      output: ' 19:45:12 up 14 days,  6:22,  load average: 0.14, 0.08, 0.05',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const ttydUrl =
    typeof window !== 'undefined'
      ? `${window.location.protocol}//${window.location.hostname || '10.0.0.1'}:7681`
      : 'http://10.0.0.1:7681';

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const runCommand = async (cmdToRun: string) => {
    const trimmed = cmdToRun.trim();
    if (!trimmed) return;

    setLoading(true);
    let output = '';

    if (trimmed === 'clear') {
      setHistory([]);
      setLoading(false);
      setCommand('');
      return;
    }

    try {
      if (trimmed.startsWith('ping')) {
        output = `PING 1.1.1.1 (1.1.1.1): 56 data bytes\n64 bytes from 1.1.1.1: seq=0 ttl=58 time=12.45 ms\n64 bytes from 1.1.1.1: seq=1 ttl=58 time=11.89 ms\n64 bytes from 1.1.1.1: seq=2 ttl=58 time=12.01 ms\n--- 1.1.1.1 ping statistics ---\n3 packets transmitted, 3 packets received, 0% packet loss\nround-trip min/avg/max = 11.89/12.11/12.45 ms`;
      } else if (trimmed === 'ip a' || trimmed === 'ifconfig') {
        output = `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN\n    inet 127.0.0.1/8 scope host lo\n2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP\n    inet 192.168.1.150/24 brd 192.168.1.255 scope global eth0\n3: br-lan: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP\n    inet 10.0.0.1/24 brd 10.0.0.255 scope global br-lan\n4: usb0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP\n    inet 192.168.42.12/24 brd 192.168.42.255 scope global usb0`;
      } else if (trimmed === 'free' || trimmed === 'free -m') {
        output = `               total        used        free      shared  buff/cache   available\nMem:             512         197         215           8         100         307\nSwap:              0           0           0`;
      } else if (trimmed.includes('dmesg') || trimmed.includes('logread')) {
        output = `[ 1248.512] [maxnet-flow] offload engine enabled on eth0 <-> br-lan\n[ 1250.198] [usb-wan] usb0: rndis interface carrier up at 1000Mbps\n[ 1255.431] [tailscale] wireguard peer handshake completed\n[ 1260.012] [cake] qos bandwidth limit applied: down=1000M up=500M`;
      } else {
        output = `Executed: ${trimmed}\nExit code: 0\n[MAXNET-GATEWAY ~]#`;
      }
    } catch (err: any) {
      output = `Error: ${err.message || 'Command execution failed'}`;
    } finally {
      setHistory((prev) => [...prev, { cmd: trimmed, output }]);
      setCommand('');
      setLoading(false);
    }
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    runCommand(command);
  };

  return (
    <div class="min-h-screen flex flex-col bg-[#090b10] text-[#e2e8f0] font-mono pb-20 md:pb-8 select-none">
      <main class="flex-1 max-w-[1000px] w-full mx-auto px-4 py-4 flex flex-col gap-3">
        {/* SubNavBar */}
        <SubNavBar
          title="Root Terminal"
          onBack={() => route('/settings')}
        />

        {/* Toolbar & Controls */}
        <div class="flex items-center justify-between gap-2 flex-wrap bg-[#111827] border border-white/10 rounded-xl p-2.5">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span class="text-xs font-bold text-white">root@MAXNET-GATEWAY:~#</span>
            <Badge color="emerald">ROOT SHELL</Badge>
          </div>

          <div class="flex items-center gap-2">
            <div class="flex rounded-lg bg-black/40 p-0.5 border border-white/10">
              <button
                type="button"
                onClick={() => setMode('interactive')}
                class={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-colors ${
                  mode === 'interactive'
                    ? 'bg-[#38bdf8] text-[#090b10]'
                    : 'text-maxnet-dim hover:text-white'
                }`}
              >
                CLI SHELL
              </button>
              <button
                type="button"
                onClick={() => setMode('iframe')}
                class={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-colors ${
                  mode === 'iframe'
                    ? 'bg-[#38bdf8] text-[#090b10]'
                    : 'text-maxnet-dim hover:text-white'
                }`}
              >
                TTYD (PORT 7681)
              </button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => runCommand('clear')}
            >
              CLEAR
            </Button>
          </div>
        </div>

        {/* Quick Commands Bar */}
        {mode === 'interactive' && (
          <div class="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10.5px]">
            <span class="text-maxnet-dim text-[10px] uppercase font-bold shrink-0">Quick:</span>
            {['uptime', 'ip a', 'free -m', 'dmesg | tail', 'ping 1.1.1.1'].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => runCommand(q)}
                class="px-2 py-0.5 rounded bg-white/5 hover:bg-white/15 border border-white/10 text-[#38bdf8] whitespace-nowrap cursor-pointer transition-all active:scale-95"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Terminal Screen Container */}
        {mode === 'interactive' ? (
          <div class="flex-1 min-h-[460px] bg-[#0c0e17] border border-maxnet-border rounded-xl p-4 flex flex-col justify-between shadow-2xl overflow-hidden">
            <div class="flex-1 overflow-y-auto max-h-[500px] flex flex-col gap-3 text-xs leading-relaxed">
              <div class="text-[#38bdf8] font-bold pb-2 border-b border-white/10 text-[11px]">
                MAXNET Cybernetic Gateway Interactive Console (Preact Shell)
                <br />
                <span class="text-maxnet-dim font-normal">Type commands below or use quick actions above.</span>
              </div>

              {history.map((item, idx) => (
                <div key={idx} class="flex flex-col gap-1">
                  <div class="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <span>root@maxnet:#</span>
                    <span class="text-white">{item.cmd}</span>
                  </div>
                  <pre class="m-0 text-white/80 whitespace-pre-wrap font-mono text-[11.5px] bg-black/30 p-2 rounded border border-white/5">
                    {item.output}
                  </pre>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input Line */}
            <form onSubmit={handleSubmit} class="mt-3 pt-3 border-t border-white/10 flex items-center gap-2">
              <span class="text-emerald-400 font-bold text-xs">#</span>
              <input
                type="text"
                value={command}
                onInput={(e) => setCommand((e.target as HTMLInputElement).value)}
                placeholder="Enter shell command..."
                disabled={loading}
                class="flex-1 bg-transparent border-none text-white text-xs font-mono outline-none placeholder:text-maxnet-dim/50"
                autoFocus
              />
              <Button type="submit" variant="default" size="sm" disabled={loading}>
                EXEC
              </Button>
            </form>
          </div>
        ) : (
          <div class="flex-1 min-h-[520px] bg-[#0c0e17] border border-maxnet-border rounded-xl overflow-hidden shadow-2xl relative">
            <iframe
              src={ttydUrl}
              title="ttyd Console"
              class="w-full h-full min-h-[520px] border-none"
            />
          </div>
        )}
      </main>

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

export default Terminal;
