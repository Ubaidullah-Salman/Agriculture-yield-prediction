import React, { useState, useEffect } from 'react';
import { Signal, Wifi, WifiOff, Globe, Info } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function NetworkStatus() {
    const { user } = useAuth();
    const [latency, setLatency] = useState<number | null>(null);
    const [quality, setQuality] = useState<'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Offline'>('Offline');
    const [ispInfo, setIspInfo] = useState<{ isp: string, region: string } | null>(null);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        if (!user) return;

        const measureLatency = async () => {
            const start = performance.now();
            try {
                const token = localStorage.getItem('token');
                // We use the health check or a small endpoint to measure latency
                const response = await fetch('/api/health', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const end = performance.now();
                const duration = Math.round(end - start);
                setLatency(duration);

                // Determine quality
                let q: 'Excellent' | 'Good' | 'Fair' | 'Poor' = 'Excellent';
                if (duration > 500) q = 'Poor';
                else if (duration > 300) q = 'Fair';
                else if (duration > 150) q = 'Good';
                setQuality(q);

                // Report to backend (sampled)
                if (Math.random() < 0.2) { // 20% chance to report per check to save bandwidth
                    await fetch('/api/admin/network/report', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            latency: duration,
                            region: 'Auto', // Let backend detect or use client side if available
                            isp: 'Auto',
                            quality: q
                        })
                    });
                }

                // Fetch ISP info if not yet available
                if (!ispInfo) {
                    // We can get this from a dedicated endpoint or it might be in the user object
                    // Let's assume the user object has region/city for 이제
                    setIspInfo({
                        isp: 'Detected',
                        region: user.location || 'Local'
                    });
                }
            } catch (error) {
                setQuality('Offline');
                setLatency(null);
            }
        };

        measureLatency();
        const interval = setInterval(measureLatency, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, [user]);

    const getStatusColor = () => {
        switch (quality) {
            case 'Excellent': return 'text-green-500';
            case 'Good': return 'text-blue-500';
            case 'Fair': return 'text-yellow-500';
            case 'Poor': return 'text-orange-500';
            default: return 'text-red-500';
        }
    };

    if (!user) return null;

    return (
        <div className="relative flex items-center gap-2">
            <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-accent transition-colors ${getStatusColor()}`}
            >
                {quality === 'Offline' ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
                <span className="text-[10px] font-bold uppercase hidden md:inline">
                    {quality} {latency ? `(${latency}ms)` : ''}
                </span>
            </button>

            {showTooltip && (
                <div className="absolute top-10 right-0 w-48 bg-card border border-border shadow-xl rounded-lg p-3 z-50 animate-in fade-in slide-in-from-top-1">
                    <h4 className="text-xs font-bold border-b border-border pb-2 mb-2 flex items-center gap-2">
                        <Signal className="w-3 h-3" />
                        Network Diagnostics
                    </h4>
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px]">
                            <span className="text-muted-foreground">Latency:</span>
                            <span className="font-medium">{latency ? `${latency} ms` : 'N/A'}</span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                            <span className="text-muted-foreground">Quality:</span>
                            <span className={`font-bold ${getStatusColor()}`}>{quality}</span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                            <span className="text-muted-foreground">Region:</span>
                            <span className="font-medium">{ispInfo?.region || 'Detecting...'}</span>
                        </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-border">
                        <p className="text-[9px] text-muted-foreground italic">
                            * Real-time metrics used for connectivity analysis.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
