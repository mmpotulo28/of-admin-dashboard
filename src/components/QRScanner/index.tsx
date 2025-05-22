import React, { useRef, useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

type QRScannerProps = {
  onScan: (code: string) => void;
};

export const QRScanner: React.FC<QRScannerProps> = ({ onScan }) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [code, setCode] = useState<string>('');

  useEffect(() => {
    const onScanSuccess = (decodedText: string): void => {
      setCode(decodedText);
      onScan(decodedText);
      scannerRef.current?.pause();
    };

    const onScanFailure = (error: string): void => {
      console.warn(`Code scan error = ${error}`);
    };

    if (scannerRef.current) {
      scannerRef.current.clear();
    }

    scannerRef.current = new Html5QrcodeScanner(
      'reader',
      { fps: 10, qrbox: 250 },
      false
    );

    scannerRef.current?.render(onScanSuccess, onScanFailure);

    return () => {
      scannerRef.current?.clear();
    };
  }, [onScan]);

  return (
    <div>
      <div id="reader" style={{ width: '300px' }} />
      <div>{code && <p>Scanned code: {code}</p>}</div>
    </div>
  );
};
