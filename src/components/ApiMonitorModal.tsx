import React, { useState, useEffect } from 'react';
import { X, Activity, CheckCircle2, AlertCircle, RefreshCw, Server, Send, Code2, Database } from 'lucide-react';

interface ApiMonitorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HealthData {
  status: string;
  timestamp: string;
  system: string;
  version: string;
  summary?: {
    liveOpenApisHealthy: boolean;
    totalServicesTracked: number;
  };
  livePublicServices?: Record<string, { service: string; ok: boolean; status: number; latencyMs: number; message: string }>;
  authenticatedServices?: Record<string, { service: string; status: string; message: string; endpoint: string }>;
}

export const ApiMonitorModal: React.FC<ApiMonitorModalProps> = ({ isOpen, onClose }) => {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [loadingHealth, setLoadingHealth] = useState(false);
  const [activeTab, setActiveTab] = useState<'health' | 'hdb' | 'realtime' | 'ura' | 'onemap' | 'mas'>('health');

  // Interactive API tester state
  const [testEndpoint, setTestEndpoint] = useState<string>('/api/hdb/resale?limit=5');
  const [testResult, setTestResult] = useState<any>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);

  const fetchHealth = async () => {
    setLoadingHealth(true);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealthData(data);
    } catch (err: any) {
      setHealthData({
        status: 'error',
        timestamp: new Date().toISOString(),
        system: 'EstatePulse SG API Gateway',
        version: '1.0.0',
        livePublicServices: {
          error: {
            service: 'Health Endpoint',
            ok: false,
            status: 500,
            latencyMs: 0,
            message: err.message,
          },
        },
      });
    } finally {
      setLoadingHealth(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHealth();
    }
  }, [isOpen]);

  const runTestQuery = async (endpoint: string) => {
    setTestEndpoint(endpoint);
    setTestLoading(true);
    setTestError(null);
    try {
      const res = await fetch(endpoint);
      const data = await res.json();
      setTestResult(data);
    } catch (err: any) {
      setTestError(err.message);
      setTestResult(null);
    } finally {
      setTestLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-neutral-200 relative my-auto">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-700" />
            <div>
              <h1 className="text-base font-bold text-neutral-900 font-display">
                Singapore Official Government APIs & Health Monitor
              </h1>
              <span className="text-[11px] text-neutral-500">
                Live gateway status for URA Space, OneMap SLA, HDB Resale, Real-Time SG, and MAS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchHealth}
              disabled={loadingHealth}
              className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
              title="Refresh Health"
            >
              <RefreshCw className={`w-4 h-4 ${loadingHealth ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Close API Monitor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          {/* Service Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-neutral-100 text-xs">
            <button
              onClick={() => setActiveTab('health')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'health'
                  ? 'bg-neutral-900 text-white font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>/api/health</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('hdb');
                runTestQuery('/api/hdb/resale?limit=5');
              }}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer ${
                activeTab === 'hdb'
                  ? 'bg-neutral-900 text-white font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              HDB Resale (Data.gov.sg)
            </button>
            <button
              onClick={() => {
                setActiveTab('realtime');
                runTestQuery('/api/realtime/weather/two-hr-forecast');
              }}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer ${
                activeTab === 'realtime'
                  ? 'bg-neutral-900 text-white font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              Real Time SG (Weather & Carpark)
            </button>
            <button
              onClick={() => {
                setActiveTab('ura');
                runTestQuery('/api/ura/transactions?batch=1');
              }}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer ${
                activeTab === 'ura'
                  ? 'bg-neutral-900 text-white font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              URA Space (Transactions & Lots)
            </button>
            <button
              onClick={() => {
                setActiveTab('onemap');
                runTestQuery('/api/onemap/search?searchVal=raffles%20place');
              }}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer ${
                activeTab === 'onemap'
                  ? 'bg-neutral-900 text-white font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              OneMap SLA (Geocoding & Routes)
            </button>
            <button
              onClick={() => {
                setActiveTab('mas');
                runTestQuery('/api/mas/exchange-rates');
              }}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer ${
                activeTab === 'mas'
                  ? 'bg-neutral-900 text-white font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              MAS (SORA & Exchange Rates)
            </button>
          </div>

          {/* Health Dashboard Tab */}
          {activeTab === 'health' && (
            <div className="space-y-5">
              {/* Overall Status Banner */}
              <div
                className={`p-4 rounded-xl border flex items-center justify-between ${
                  healthData?.status === 'healthy'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50 border-amber-200 text-amber-950'
                }`}
              >
                <div className="flex items-center gap-3">
                  {healthData?.status === 'healthy' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                  )}
                  <div>
                    <h3 className="font-bold text-sm">
                      Gateway Status: {healthData?.status?.toUpperCase() || 'CHECKING...'}
                    </h3>
                    <p className="text-xs opacity-80">
                      Live Open Data services responding. Last probed at{' '}
                      {healthData?.timestamp ? new Date(healthData.timestamp).toLocaleTimeString() : '...'}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-semibold bg-white/80 px-2 py-1 rounded">
                  {healthData?.version}
                </span>
              </div>

              {/* Live Public Services Grid */}
              <div>
                <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                  Live Keyless Public Data Services
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {healthData?.livePublicServices &&
                    Object.entries(healthData.livePublicServices).map(([key, service]) => (
                      <div key={key} className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-neutral-900">{service.service}</span>
                          <span
                            className={`w-2 h-2 rounded-full ${
                              service.ok ? 'bg-emerald-500' : 'bg-red-500'
                            }`}
                          />
                        </div>
                        <div className="text-[11px] text-neutral-500 flex justify-between">
                          <span>Latency: {service.latencyMs}ms</span>
                          <span className="font-mono text-emerald-700">HTTP {service.status}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Authenticated Government APIs Status */}
              <div>
                <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                  Key-Managed & Partner Gateways
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {healthData?.authenticatedServices &&
                    Object.entries(healthData.authenticatedServices).map(([key, service]) => (
                      <div key={key} className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-neutral-900">{service.service}</span>
                          <span className="text-[10px] font-semibold text-neutral-600 bg-neutral-200/60 px-1.5 py-0.5 rounded">
                            {service.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 line-clamp-2 mt-1">{service.message}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Interactive API Tester Panel for Specific Services */}
          {activeTab !== 'health' && (
            <div className="space-y-4 text-xs">
              {/* Preset Buttons for Tab */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-neutral-500 font-semibold mr-1">Quick Presets:</span>
                {activeTab === 'hdb' && (
                  <>
                    <button
                      onClick={() => runTestQuery('/api/hdb/resale?limit=5')}
                      className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-md text-neutral-800 cursor-pointer"
                    >
                      First 5 Resale Txns
                    </button>
                    <button
                      onClick={() =>
                        runTestQuery('/api/hdb/resale?town=TAMPINES&flat_type=4%20ROOM&limit=5')
                      }
                      className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-md text-neutral-800 cursor-pointer"
                    >
                      Tampines 4-Room Filtered
                    </button>
                    <button
                      onClick={() => runTestQuery('/api/hdb/metadata')}
                      className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-md text-neutral-800 cursor-pointer"
                    >
                      Dataset Metadata
                    </button>
                  </>
                )}

                {activeTab === 'realtime' && (
                  <>
                    <button
                      onClick={() => runTestQuery('/api/realtime/weather/two-hr-forecast')}
                      className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-md text-neutral-800 cursor-pointer"
                    >
                      2-Hr Forecast
                    </button>
                    <button
                      onClick={() => runTestQuery('/api/realtime/weather/air-temperature')}
                      className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-md text-neutral-800 cursor-pointer"
                    >
                      Air Temperature
                    </button>
                    <button
                      onClick={() => runTestQuery('/api/realtime/weather/psi')}
                      className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-md text-neutral-800 cursor-pointer"
                    >
                      PSI Readings
                    </button>
                    <button
                      onClick={() => runTestQuery('/api/realtime/carpark-availability')}
                      className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-md text-neutral-800 cursor-pointer"
                    >
                      Carpark Lots (v1)
                    </button>
                    <button
                      onClick={() => runTestQuery('/api/realtime/taxi-availability')}
                      className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-md text-neutral-800 cursor-pointer"
                    >
                      Taxi Availability
                    </button>
                  </>
                )}

                {activeTab === 'ura' && (
                  <>
                    <button
                      onClick={() => runTestQuery('/api/ura/transactions?batch=1')}
                      className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-md text-neutral-800 cursor-pointer"
                    >
                      PMI_Resi_Transaction (Batch 1)
                    </button>
                    <button
                      onClick={() => runTestQuery('/api/ura/transactions?merge=true')}
                      className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-md text-neutral-800 cursor-pointer"
                    >
                      Merge All 4 Batches
                    </button>
                    <button
                      onClick={() => runTestQuery('/api/ura/carparks')}
                      className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-md text-neutral-800 cursor-pointer"
                    >
                      Car_Park_Availability
                    </button>
                    <button
                      onClick={() => runTestQuery('/api/ura/carpark-details')}
                      className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-md text-neutral-800 cursor-pointer"
                    >
                      Car_Park_Details
                    </button>
                  </>
                )}

                {activeTab === 'onemap' && (
                  <>
                    <button
                      onClick={() => runTestQuery('/api/onemap/search?searchVal=raffles%20place')}
                      className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-md text-neutral-800 cursor-pointer"
                    >
                      Search: Raffles Place
                    </button>
                    <button
                      onClick={() => runTestQuery('/api/onemap/search?searchVal=orchard%20road')}
                      className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-md text-neutral-800 cursor-pointer"
                    >
                      Search: Orchard Road
                    </button>
                    <button
                      onClick={() => runTestQuery('/api/onemap/revgeocode?location=1.3,103.8')}
                      className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-md text-neutral-800 cursor-pointer"
                    >
                      Rev Geocode (1.3, 103.8)
                    </button>
                    <button
                      onClick={() =>
                        runTestQuery(
                          '/api/onemap/route?start=1.320981,103.844150&end=1.326762,103.8559&routeType=walk'
                        )
                      }
                      className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-md text-neutral-800 cursor-pointer"
                    >
                      Route: Walk
                    </button>
                  </>
                )}

                {activeTab === 'mas' && (
                  <>
                    <button
                      onClick={() => runTestQuery('/api/mas/exchange-rates')}
                      className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-md text-neutral-800 cursor-pointer"
                    >
                      SGD Exchange Rates
                    </button>
                    <button
                      onClick={() => runTestQuery('/api/mas/interest-rates')}
                      className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-md text-neutral-800 cursor-pointer"
                    >
                      Daily SORA & Compounded Rates
                    </button>
                  </>
                )}
              </div>

              {/* Query Input Bar */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={testEndpoint}
                  onChange={(e) => setTestEndpoint(e.target.value)}
                  className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg font-mono text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
                <button
                  onClick={() => runTestQuery(testEndpoint)}
                  disabled={testLoading}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{testLoading ? 'Fetching...' : 'Send Request'}</span>
                </button>
              </div>

              {/* Result Viewer */}
              <div className="bg-neutral-900 text-neutral-100 rounded-xl p-4 font-mono text-xs max-h-96 overflow-y-auto border border-neutral-800">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800 mb-2 text-neutral-400">
                  <div className="flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Response Payload</span>
                  </div>
                  {testResult && (
                    <span className="text-[10px] text-emerald-400">HTTP 200 OK</span>
                  )}
                  {testError && (
                    <span className="text-[10px] text-red-400">Error: {testError}</span>
                  )}
                </div>

                {testLoading ? (
                  <div className="py-8 text-center text-neutral-500">Querying government API endpoint...</div>
                ) : testResult ? (
                  <pre className="whitespace-pre-wrap break-all text-[11px] text-neutral-200">
                    {JSON.stringify(testResult, null, 2)}
                  </pre>
                ) : testError ? (
                  <div className="text-red-400 py-4">{testError}</div>
                ) : (
                  <div className="py-8 text-center text-neutral-500">Select a preset or click "Send Request" to test endpoint</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
