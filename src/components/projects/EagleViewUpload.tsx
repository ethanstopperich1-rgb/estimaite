import { useState, useCallback } from 'react';
import { Upload, FileText, Check, AlertCircle, Loader2, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { parseEagleViewPDF } from '../../parser/parser';
import type { RoofMeasurements } from '../../parser/types';

interface EagleViewUploadProps {
  onMeasurementsExtracted: (measurements: RoofMeasurements) => void;
  initialMeasurements?: RoofMeasurements | null;
}

type UploadState = 'idle' | 'uploading' | 'parsing' | 'success' | 'error';

export function EagleViewUpload({
  onMeasurementsExtracted,
  initialMeasurements,
}: EagleViewUploadProps) {
  const [state, setState] = useState<UploadState>(initialMeasurements ? 'success' : 'idle');
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [measurements, setMeasurements] = useState<RoofMeasurements | null>(
    initialMeasurements ?? null
  );
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        setError('Please upload a PDF file');
        setState('error');
        return;
      }

      setFileName(file.name);
      setState('parsing');
      setError(null);
      setWarnings([]);

      try {
        const result = await parseEagleViewPDF(file, { debug: false });

        if (result.success && result.measurements) {
          setMeasurements(result.measurements);
          setWarnings(result.warnings ?? []);
          setState('success');
          onMeasurementsExtracted(result.measurements);
        } else {
          setError(result.error ?? 'Failed to parse PDF');
          setWarnings(result.warnings ?? []);
          setState('error');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setState('error');
      }
    },
    [onMeasurementsExtracted]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleReset = useCallback(() => {
    setState('idle');
    setError(null);
    setWarnings([]);
    setFileName(null);
    setMeasurements(null);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          EagleView Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        {state === 'idle' && (
          <div
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${isDragging
                ? 'border-accent bg-accent/10'
                : 'border-navy-600 hover:border-navy-500'
              }
            `}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-500" />
            <p className="text-gray-300 mb-2">
              Drag and drop your EagleView PDF here
            </p>
            <p className="text-gray-500 text-sm mb-4">or</p>
            <label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleInputChange}
                className="hidden"
              />
              <Button type="button" variant="secondary" as="span">
                Browse Files
              </Button>
            </label>
          </div>
        )}

        {state === 'parsing' && (
          <div className="text-center py-8">
            <Loader2 className="w-12 h-12 mx-auto mb-4 text-accent animate-spin" />
            <p className="text-gray-300">Extracting measurements from {fileName}...</p>
          </div>
        )}

        {state === 'error' && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-400 font-medium">Failed to parse PDF</p>
                <p className="text-gray-400 text-sm mt-1">{error}</p>
              </div>
            </div>
            {warnings.length > 0 && (
              <div className="text-sm text-gray-500">
                {warnings.map((w, i) => (
                  <p key={i}>• {w}</p>
                ))}
              </div>
            )}
            <Button onClick={handleReset} variant="secondary">
              Try Again
            </Button>
          </div>
        )}

        {state === 'success' && measurements && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
              <Check className="w-5 h-5 text-emerald-400" />
              <div className="flex-1">
                <p className="text-emerald-400 font-medium">
                  Measurements extracted successfully
                </p>
                {fileName && (
                  <p className="text-gray-400 text-sm">{fileName}</p>
                )}
              </div>
              <button
                onClick={handleReset}
                className="p-1 hover:bg-navy-700 rounded"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {warnings.length > 0 && (
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-400 text-sm font-medium mb-1">Warnings:</p>
                {warnings.map((w, i) => (
                  <p key={i} className="text-gray-400 text-sm">• {w}</p>
                ))}
              </div>
            )}

            <MeasurementsSummary measurements={measurements} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MeasurementsSummary({ measurements }: { measurements: RoofMeasurements }) {
  const items = [
    { label: 'Property', value: `${measurements.propertyAddress}, ${measurements.city}, ${measurements.state} ${measurements.zipCode}` },
    { label: 'Total Area', value: `${measurements.totalRoofArea.toLocaleString()} sq ft` },
    { label: 'Facets', value: measurements.totalFacets.toString() },
    { label: 'Pitch', value: measurements.predominantPitch },
    { label: 'Ridge', value: `${measurements.ridgeLength} ft` },
    { label: 'Hip', value: `${measurements.hipLength} ft` },
    { label: 'Valley', value: `${measurements.valleyLength} ft` },
    { label: 'Rake', value: `${measurements.rakeLength} ft` },
    { label: 'Eave', value: `${measurements.eaveLength} ft` },
    { label: 'Penetrations', value: measurements.totalPenetrations.toString() },
  ];

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
      {items.map(({ label, value }) => (
        <div key={label} className="flex justify-between py-1 border-b border-navy-700">
          <span className="text-gray-500">{label}</span>
          <span className="text-gray-200 font-medium">{value}</span>
        </div>
      ))}
    </div>
  );
}
