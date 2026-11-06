/* eslint-disable @typescript-eslint/no-explicit-any */

export class BluetoothThermalPrinter {
  private device: any = null;
  private characteristic: any = null;

  async connect(): Promise<void> {
    if (typeof window === 'undefined' || !('bluetooth' in navigator)) {
      throw new Error('Web Bluetooth no está disponible. Usa Chrome o Edge en Android, o Bluefy en iOS.');
    }

    this.device = await (navigator as any).bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [
        '000018f0-0000-1000-8000-00805f9b34fb', // Impresoras térmicas estándar
        'e7810a71-73ae-499d-8c15-faa9aef0c3f2',
        '49535343-fe7d-4ae5-8fa9-9fafd205e455', // POS-80 / POS-58 genéricas
      ],
    });

    const server = await this.device.gatt?.connect();
    if (!server) throw new Error('No se pudo conectar al servidor GATT de la impresora.');

    const services = await server.getPrimaryServices();
    for (const service of services) {
      const chars = await service.getCharacteristics();
      this.characteristic = chars.find(
        (c: any) => c.properties.write || c.properties.writeWithoutResponse
      );
      if (this.characteristic) break;
    }

    if (!this.characteristic) {
      throw new Error('No se encontró el canal de escritura en la impresora seleccionada.');
    }
  }

  async printTicket(data: Uint8Array): Promise<void> {
    if (!this.characteristic) throw new Error('Impresora no inicializada.');
    
    // Fragmentar en paquetes de 100 bytes para evitar desbordar el búfer BLE
    const chunkSize = 100;
    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      await this.characteristic.writeValue(chunk);
    }
  }

  disconnect(): void {
    if (this.device && this.device.gatt?.connected) {
      this.device.gatt.disconnect();
    }
  }
}
// Generador de bytes ESC/POS básico
export function buildEscPosPayload(lines: { text: string; align?: 'left' | 'center' | 'right'; bold?: boolean }[]): Uint8Array {
  const encoder = new TextEncoder();
  const bytes: number[] = [];

  // Inicializar impresora (ESC @)
  bytes.push(0x1b, 0x40);

  for (const line of lines) {
    // Alineación: 0 = left, 1 = center, 2 = right
    const alignCode = line.align === 'center' ? 1 : line.align === 'right' ? 2 : 0;
    bytes.push(0x1b, 0x61, alignCode);

    // Negrita
    bytes.push(0x1b, 0x45, line.bold ? 1 : 0);

    // Texto con salto de línea
    const encodedText = encoder.encode(line.text + '\n');
    bytes.push(...Array.from(encodedText));
  }

  // Corte de papel / avance de 4 líneas (GS V 66 0)
  bytes.push(0x1d, 0x56, 0x42, 0x00);

  return new Uint8Array(bytes);
}