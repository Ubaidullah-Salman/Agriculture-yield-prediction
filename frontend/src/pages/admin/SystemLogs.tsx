import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Activity, RefreshCw, Terminal, Search } from 'lucide-react';
import { api } from '../../services/api';

interface LogData {
    logs: string[];
}

export function SystemLogs() {
    const [logs, setLogs] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    const fetchLogs = async (query = '') => {
        setLoading(true);
        try {
            const endpoint = query ? `/admin/logs?q=${encodeURIComponent(query)}` : '/admin/logs';
            const data = await api.get<LogData>(endpoint);
            setLogs(data.logs);
        } catch (error) {
            console.error('Failed to fetch logs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFilter(value);
        fetchLogs(value);
    };


    const getLogColor = (line: string) => {
        if (line.includes('ERROR') || line.includes('Exception')) return 'text-red-500';
        if (line.includes('WARNING')) return 'text-yellow-500';
        if (line.includes('INFO')) return 'text-blue-400';
        if (line.includes('DEBUG')) return 'text-gray-400';
        return 'text-foreground';
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
                <div>
                    <h1>System Activity Logs</h1>
                    <p className="text-muted-foreground mt-1">
                        Real-time backend activity and debugging information
                    </p>
                </div>
                <Button onClick={() => fetchLogs()} disabled={loading} className="flex items-center gap-2">
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh Logs
                </Button>
            </div>

            <Card className="border-none shadow-xl bg-[#0d1117]">
                <CardHeader className="border-b border-white/10 pb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle className="flex items-center gap-2 text-white">
                            <Terminal className="w-5 h-5 text-green-400" />
                            Live Terminal Output
                        </CardTitle>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <input
                                type="text"
                                placeholder="Filter logs (e.g., ERROR)..."
                                className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 w-full md:w-64"
                                value={filter}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="bg-black/40 font-mono text-sm h-[600px] overflow-y-auto p-4 space-y-1">
                        {loading && logs.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-white/40">
                                <RefreshCw className="w-8 h-8 animate-spin" />
                            </div>
                        ) : logs.length === 0 ? (
                            <div className="text-white/40 italic p-4 text-center">
                                No log entries found.
                            </div>
                        ) : (
                            logs.map((item, idx) => (
                                <div key={idx} className="flex gap-4 hover:bg-white/5 py-0.5 px-2 rounded group">
                                    <span className="text-white/20 select-none w-8 text-right shrink-0">{idx + 1}</span>
                                    <span className={`break-all ${getLogColor(item)}`}>{item}</span>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-blue-500/10 border-blue-500/20">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <Activity className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-xs text-blue-400 uppercase font-bold">Total Entries</p>
                            <p className="text-xl font-bold">{logs.length}</p>
                        </div>
                    </CardContent>
                </Card>
                {/* Additional log stats can go here */}
            </div>
        </div>
    );
}
