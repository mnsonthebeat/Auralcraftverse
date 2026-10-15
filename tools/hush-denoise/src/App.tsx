import { useEffect, useRef, useState } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import coreURL from '@ffmpeg/core?url';
import wasmURL from '@ffmpeg/core/wasm?url';
import {
  Activity,
  AudioWaveform,
  CircleHelp,
  Download,
  FileAudio,
  Gauge,
  Headphones,
  Info,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Square,
  Upload,
  Waves,
  Zap,
} from 'lucide-react';
import './index.css';

type AudioInfo = {
  name: string;
  type: string;
  size: string;
  duration: number;
  sampleRate: number;
  channels: number;
};
type SourceProfile = 'music' | 'singing' | 'speech' | 'podcast';
type Analysis = {
  noiseFloor: number;
  peak: number;
  rms: number;
  lufs: number;
  crest: number;
  clipping: number;
  hum: number;
  hiss: number;
  sibilance: number;
  dynamic: number;
};

const defaultAnalysis: Analysis = {
  noiseFloor: -90,
  peak: -90,
  rms: -90,
  lufs: -90,
  crest: 0,
  clipping: 0,
  hum: 0,
  hiss: 0,
  sibilance: 0,
  dynamic: 0,
};
function measureAudio(decoded: AudioBuffer) {
  const points = 110, fftSize = 2048;
  const mono = new Float32Array(decoded.length);
  let peak=0, sumSquares=0, clipped=0;
  for(let c=0;c<decoded.numberOfChannels;c++){const data=decoded.getChannelData(c);for(let i=0;i<data.length;i++){const v=data[i];mono[i]+=v/decoded.numberOfChannels;peak=Math.max(peak,Math.abs(v));sumSquares+=v*v;if(Math.abs(v)>=0.999)clipped++;}}
  const sampleCount=Math.max(1,decoded.length*decoded.numberOfChannels), rms=Math.sqrt(sumSquares/sampleCount);
  const peakDb=20*Math.log10(Math.max(peak,1e-7)), rmsDb=20*Math.log10(Math.max(rms,1e-7));
  // Estimate quiet-section level from every channel independently so out-of-phase stereo material cannot cancel in the mono analysis signal.
  const frameSize=Math.max(1,Math.floor(decoded.sampleRate*0.1)), frames:number[]=[];
  for(let start=0;start<decoded.length;start+=frameSize){const end=Math.min(decoded.length,start+frameSize);let e=0;for(let c=0;c<decoded.numberOfChannels;c++){const channel=decoded.getChannelData(c);for(let i=start;i<end;i++)e+=channel[i]*channel[i];}frames.push(Math.sqrt(e/Math.max(1,(end-start)*decoded.numberOfChannels)));}
  const sorted=[...frames].sort((x,y)=>x-y), floor=sorted[Math.floor(sorted.length*0.1)]||1e-7;
  const noiseFloor=Math.max(-90,20*Math.log10(Math.max(floor,1e-7)));
  const loud=frames.filter(v=>v>floor*2), loudRms=loud.length?Math.sqrt(loud.reduce((s,v)=>s+v*v,0)/loud.length):rms;
  const dynamic=Math.max(0,20*Math.log10(Math.max(loudRms,1e-7)/Math.max(floor,1e-7)));
  const waveform=Array.from({length:points},(_,i)=>{const start=Math.floor(i*mono.length/points),end=Math.max(start+1,Math.floor((i+1)*mono.length/points));let p=0;for(let j=start;j<Math.min(end,mono.length);j++)p=Math.max(p,Math.abs(mono[j]));return Math.max(4,Math.min(98,p*100));});
  const input=new Float32Array(fftSize), windowStart=Math.max(0,Math.floor((mono.length-fftSize)/2));
  for(let i=0;i<fftSize;i++){const v=mono[Math.min(mono.length-1,windowStart+i)]||0;input[i]=v*(0.5-0.5*Math.cos(2*Math.PI*i/(fftSize-1)));}
  const magnitudes=new Float32Array(fftSize/2);let maxMagnitude=1e-9;
  for(let k=1;k<fftSize/2;k++){let re=0,im=0;for(let n=0;n<fftSize;n++){const ph=2*Math.PI*k*n/fftSize;re+=input[n]*Math.cos(ph);im-=input[n]*Math.sin(ph);}const mag=Math.hypot(re,im);magnitudes[k]=mag;maxMagnitude=Math.max(maxMagnitude,mag);}
  const nyquist=decoded.sampleRate/2;
  const energy=(lowHz:number,highHz:number)=>{const lo=Math.max(1,Math.floor(lowHz*fftSize/decoded.sampleRate)),hi=Math.min(fftSize/2-1,Math.ceil(highHz*fftSize/decoded.sampleRate));let e=0;for(let k=lo;k<=hi;k++)e+=magnitudes[k]*magnitudes[k];return e;};
  const humEnergy=energy(45,65)+energy(95,125), lowEnergy=energy(20,300), speechEnergy=energy(300,Math.min(4000,nyquist)), highEnergy=energy(6000,Math.min(18000,nyquist)), sibEnergy=energy(3500,Math.min(10000,nyquist));
  const hum=Math.min(100,Math.round(100*Math.min(1,(humEnergy/Math.max(lowEnergy,1e-12))*4)));
  const hiss=Math.min(100,Math.round(100*(highEnergy/Math.max(highEnergy+speechEnergy,1e-12))*1.4));
  const sibilance=Math.min(100,Math.round(100*(sibEnergy/Math.max(sibEnergy+speechEnergy,1e-12))*1.7));
  const spectrum=Array.from({length:84},(_,band)=>{const minHz=20*Math.pow(Math.max(1,nyquist/20),band/84),maxHz=20*Math.pow(Math.max(1,nyquist/20),(band+1)/84),lo=Math.max(1,Math.floor(minHz*fftSize/decoded.sampleRate)),hi=Math.min(fftSize/2-1,Math.ceil(maxHz*fftSize/decoded.sampleRate));let sum=0,count=0;for(let k=lo;k<=hi;k++){sum+=magnitudes[k];count++;}return Math.max(3,Math.min(96,12+84*Math.sqrt((sum/Math.max(1,count))/maxMagnitude)));});
  return {waveform,spectrum,analysis:{noiseFloor:Number(noiseFloor.toFixed(1)),peak:Number(peakDb.toFixed(1)),rms:Number(rmsDb.toFixed(1)),lufs:Number(rmsDb.toFixed(1)),crest:Number((peakDb-rmsDb).toFixed(1)),clipping:Number((100*clipped/sampleCount).toFixed(2)),hum,hiss,sibilance,dynamic:Number(dynamic.toFixed(1))} satisfies Analysis};
}
function diagnosticSummary(analysis: Analysis) {
  const findings:string[]=[];
  if(analysis.hum>=25) findings.push(analysis.hum>=55?'strong mains hum':'possible mains hum');
  if(analysis.hiss>=25) findings.push(analysis.hiss>=55?'prominent high-frequency noise':'elevated high-frequency noise');
  if(analysis.sibilance>=30) findings.push('sibilance concentration');
  if(analysis.clipping>0.05) findings.push('clipping');
  if(analysis.noiseFloor>-45) findings.push('raised noise floor');
  return findings.length?findings.join(' · '):'No dominant defect detected · gentle cleanup may be sufficient';
}


function formatTime(value: number) {
  if (!Number.isFinite(value)) return '00:00';
  const m = Math.floor(value / 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor(value % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}

function db(value: number) {
  return `${value > 0 ? '+' : ''}${value.toFixed(1)} dB`;
}

function resampleChannel(input: Float32Array, fromRate: number, toRate: number) {
  if (fromRate === toRate) return new Float32Array(input);
  const length = Math.max(1, Math.round(input.length * toRate / fromRate));
  const output = new Float32Array(length);
  const scale = fromRate / toRate;
  for (let i = 0; i < length; i++) {
    const position = i * scale;
    const left = Math.floor(position);
    const right = Math.min(left + 1, input.length - 1);
    const mix = position - left;
    output[i] = input[left] * (1 - mix) + input[right] * mix;
  }
  return output;
}

function encodeWav(channels: Float32Array[], sampleRate: number) {
  const channelCount = channels.length;
  const sampleCount = channels[0]?.length || 0;
  const bytesPerSample = 3;
  const blockAlign = channelCount * bytesPerSample;
  const buffer = new ArrayBuffer(44 + sampleCount * blockAlign);
  const view = new DataView(buffer);
  const writeString = (offset: number, value: string) => { for (let i = 0; i < value.length; i++) view.setUint8(offset + i, value.charCodeAt(i)); };
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + sampleCount * blockAlign, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channelCount, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 24, true);
  writeString(36, 'data');
  view.setUint32(40, sampleCount * blockAlign, true);
  let offset = 44;
  for (let i = 0; i < sampleCount; i++) for (let c = 0; c < channelCount; c++) {
    const sample = Math.max(-1, Math.min(1, channels[c][i]));
    const value = sample < 0 ? Math.round(sample * 8388608) : Math.round(sample * 8388607);
    view.setUint8(offset, value & 255);
    view.setUint8(offset + 1, (value >> 8) & 255);
    view.setUint8(offset + 2, (value >> 16) & 255);
    offset += 3;
  }
  return new Blob([buffer], { type: 'audio/wav' });
}

async function reconstructShortRegion(file: File, startPercent: number, endPercent: number, strength: number) {
  const context = new AudioContext();
  const decoded = await context.decodeAudioData(await file.arrayBuffer());
  await context.close();
  const start = Math.max(0, Math.floor(decoded.length * Math.min(startPercent, endPercent) / 100));
  const end = Math.min(decoded.length, Math.ceil(decoded.length * Math.max(startPercent, endPercent) / 100));
  const maxSamples = Math.floor(decoded.sampleRate * 0.08);
  const repairEnd = Math.min(end, start + maxSamples);
  if (repairEnd <= start || strength <= 0) return file;
  const channels = Array.from({ length: decoded.numberOfChannels }, (_, c) => new Float32Array(decoded.getChannelData(c)));
  const fade = Math.min(Math.floor(decoded.sampleRate * 0.02), Math.floor((repairEnd - start) / 2));
  for (let c = 0; c < channels.length; c++) {
    const data = channels[c];
    const left = Math.max(0, start - fade);
    const right = Math.min(decoded.length - 1, repairEnd + fade);
    const leftValue = data[start];
    const rightValue = data[repairEnd - 1] ?? leftValue;
    for (let i = start; i < repairEnd; i++) {
      const t = (i - start) / Math.max(1, repairEnd - start - 1);
      const eased = t * t * (3 - 2 * t);
      const interpolated = leftValue * (1 - eased) + rightValue * eased;
      const repairMix = Math.max(0, Math.min(1, strength / 100));
      data[i] = data[i] * (1 - repairMix) + interpolated * repairMix;
    }
    for (let i = 0; i < fade; i++) {
      const t = i / Math.max(1, fade - 1);
      const k = start + i;
      if (k < repairEnd) data[k] = data[k] * t + data[left + i] * (1 - t);
      const rk = repairEnd + i;
      if (rk < right) data[rk] = data[rk] * t + data[repairEnd - 1] * (1 - t);
    }
  }
  return encodeWav(channels, decoded.sampleRate);
}

async function regenerativeRnnoise(file: File) {
  const { Rnnoise } = await import('@shiguredo/rnnoise-wasm');
  const audioContext = new AudioContext();
  const decoded = await audioContext.decodeAudioData(await file.arrayBuffer());
  await audioContext.close();
  const rnnoise = await Rnnoise.load();
  const outputChannels: Float32Array[] = [];
  for (let channel = 0; channel < decoded.numberOfChannels; channel++) {
    const source = resampleChannel(decoded.getChannelData(channel), decoded.sampleRate, 48000);
    const restored = new Float32Array(source.length);
    const state = rnnoise.createDenoiseState();
    const frameSize = 480;
    for (let offset = 0; offset < source.length; offset += frameSize) {
      const frame = new Float32Array(frameSize);
      frame.set(source.subarray(offset, Math.min(offset + frameSize, source.length)));
      state.processFrame(frame);
      restored.set(frame.subarray(0, Math.min(frameSize, restored.length - offset)), offset);
    }
    state.destroy();
    outputChannels.push(resampleChannel(restored, 48000, decoded.sampleRate));
  }
  return encodeWav(outputChannels, decoded.sampleRate);
}

async function deepFilterNetEnhance(file: File, strength: number) {
  const { DeepFilter } = await import('@lofcz/deepfilternet-web');
  const audioContext = new AudioContext();
  const decoded = await audioContext.decodeAudioData(await file.arrayBuffer());
  await audioContext.close();
  const outputChannels: Float32Array[] = [];
  const blend = Math.max(0, Math.min(1, strength));
  for (let channel = 0; channel < decoded.numberOfChannels; channel++) {
    const sourceOriginal = decoded.getChannelData(channel);
    const source = resampleChannel(sourceOriginal, decoded.sampleRate, 48000);
    const model = await DeepFilter.create();
    try {
      const frameSize = model.frameLength || 480;
      const restored = new Float32Array(source.length);
      for (let offset = 0; offset < source.length; offset += frameSize) {
        const frame = new Float32Array(frameSize);
        frame.set(source.subarray(offset, Math.min(offset + frameSize, source.length)));
        const clean = model.process(frame);
        restored.set(clean.subarray(0, Math.min(frameSize, restored.length - offset)), offset);
      }
      const resampled = resampleChannel(restored, 48000, decoded.sampleRate);
      const preserved = new Float32Array(Math.min(resampled.length, sourceOriginal.length));
      for (let i = 0; i < preserved.length; i++) preserved[i] = sourceOriginal[i] * (1 - blend) + resampled[i] * blend;
      outputChannels.push(preserved);
    } finally {
      model.destroy();
    }
  }
  return encodeWav(outputChannels, decoded.sampleRate);
}

async function isSupportedAudioFile(selected: File) {
  const extension = selected.name.split('.').pop()?.toLowerCase() || '';
  const supportedExtensions = new Set(['wav', 'mp3', 'flac', 'aif', 'aiff', 'ogg', 'oga', 'opus', 'm4a', 'aac']);
  const supportedMimeTypes = new Set(['audio/mp4', 'audio/x-m4a', 'audio/m4a']);
  if (selected.type.startsWith('audio/') || supportedMimeTypes.has(selected.type) || supportedExtensions.has(extension)) return true;

  // Some recorders provide Ogg/Opus or MPEG-4 audio with a generic or empty MIME type.
  try {
    const header = new Uint8Array(await selected.slice(0, 128).arrayBuffer());
    const text = new TextDecoder().decode(header);
    return (text.startsWith('OggS') && text.includes('OpusHead')) || text.slice(4, 8) === 'ftyp';
  } catch {
    return false;
  }
}

function Spectrum({ active, bars }: { active: boolean; bars: number[] }) {
  return (
    <div className={`spectrum ${active ? 'active' : ''}`} aria-label="Measured frequency spectrum">
      {bars.map((h, i) => (
        <span key={i} style={{ height: h + '%' }} />
      ))}
    </div>
  );
}

type NoiseProfile = { sampleRate: number; magnitudes: Float32Array };
const PROFILE_FFT_SIZE = 2048;
const PROFILE_HOP_SIZE = 512;
function fft(real: Float32Array, imag: Float32Array, inverse = false) {
  const n = real.length;
  for (let i = 1, j = 0; i < n; i++) { let bit = n >> 1; for (; j & bit; bit >>= 1) j ^= bit; j ^= bit; if (i < j) { [real[i], real[j]] = [real[j], real[i]]; [imag[i], imag[j]] = [imag[j], imag[i]]; } }
  for (let size = 2; size <= n; size <<= 1) { const angle = (inverse ? 2 : -2) * Math.PI / size; const stepRe = Math.cos(angle), stepIm = Math.sin(angle); for (let start = 0; start < n; start += size) { let wr = 1, wi = 0; const half = size >> 1; for (let j = 0; j < half; j++) { const even = start + j, odd = even + half; const tr = wr * real[odd] - wi * imag[odd], ti = wr * imag[odd] + wi * real[odd]; real[odd] = real[even] - tr; imag[odd] = imag[even] - ti; real[even] += tr; imag[even] += ti; const nextWr = wr * stepRe - wi * stepIm; wi = wr * stepIm + wi * stepRe; wr = nextWr; } } }
  if (inverse) for (let i = 0; i < n; i++) { real[i] /= n; imag[i] /= n; }
}
function captureNoiseProfile(decoded: AudioBuffer, start: number, end: number): NoiseProfile {
  const size = PROFILE_FFT_SIZE, bins = size / 2 + 1, magnitudes = new Float32Array(bins), real = new Float32Array(size), imag = new Float32Array(size); let frames = 0;
  for (let offset = start; offset < end; offset += PROFILE_HOP_SIZE) { real.fill(0); imag.fill(0); for (let c = 0; c < decoded.numberOfChannels; c++) { const channel = decoded.getChannelData(c); for (let i = 0; i < size && offset + i < end; i++) real[i] += channel[offset + i] / decoded.numberOfChannels * (0.5 - 0.5 * Math.cos(2 * Math.PI * i / (size - 1))); } fft(real, imag); for (let k = 0; k < bins; k++) magnitudes[k] += Math.hypot(real[k], imag[k]); frames++; if (offset + size >= end) break; }
  for (let k = 0; k < bins; k++) magnitudes[k] /= Math.max(1, frames);
  return { sampleRate: decoded.sampleRate, magnitudes };
}
async function applySpectralNoiseProfile(
  file: File,
  profile: NoiseProfile,
  reductionDb: number,
  onProgress?: (percent: number) => void
) {
  const context = new AudioContext();
  let decoded: AudioBuffer;
  try {
    decoded = await context.decodeAudioData(await file.arrayBuffer());
  } finally {
    await context.close();
  }

  if (decoded.sampleRate !== profile.sampleRate) {
    throw new Error('Noise profile sample rate does not match the source audio. Analyze the noise-only region again.');
  }

  const size = PROFILE_FFT_SIZE;
  const hop = PROFILE_HOP_SIZE;
  const bins = size / 2 + 1;
  const outputChannels: Float32Array[] = [];
  const strength = Math.max(0, Math.min(1, reductionDb / 30));
  const floorGain = Math.pow(10, -Math.max(0, reductionDb) / 20);
  const window = new Float32Array(size);

  for (let i = 0; i < size; i++) {
    window[i] = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / (size - 1));
  }

  const totalFrames = decoded.numberOfChannels * Math.ceil(decoded.length / hop);
  let completedFrames = 0;

  for (let c = 0; c < decoded.numberOfChannels; c++) {
    const source = decoded.getChannelData(c);
    const output = new Float32Array(source.length);
    const weights = new Float32Array(source.length);
    const real = new Float32Array(size);
    const imag = new Float32Array(size);
    // Reuse the gain buffers for each frame to avoid thousands of short-lived allocations.
    const rawGain = new Float32Array(bins);
    const smoothGain = new Float32Array(bins);

    for (let offset = 0; offset < source.length; offset += hop) {
      real.fill(0);
      imag.fill(0);
      for (let i = 0; i < size && offset + i < source.length; i++) {
        real[i] = source[offset + i] * window[i];
      }

      fft(real, imag);

      for (let k = 0; k < bins; k++) {
        const magnitude = Math.hypot(real[k], imag[k]);
        const estimatedNoise = profile.magnitudes[k];
        rawGain[k] = magnitude < 1e-8
          ? floorGain
          : Math.max(floorGain, Math.min(1, 1 - strength * estimatedNoise / magnitude));
      }

      for (let k = 0; k < bins; k++) {
        smoothGain[k] = (
          rawGain[Math.max(0, k - 1)] +
          2 * rawGain[k] +
          rawGain[Math.min(bins - 1, k + 1)]
        ) / 4;
      }

      for (let k = 0; k < bins; k++) {
        real[k] *= smoothGain[k];
        imag[k] *= smoothGain[k];
        if (k > 0 && k < size / 2) {
          real[size - k] = real[k];
          imag[size - k] = -imag[k];
        }
      }

      fft(real, imag, true);

      for (let i = 0; i < size && offset + i < source.length; i++) {
        const index = offset + i;
        output[index] += real[i] * window[i];
        weights[index] += window[i] * window[i];
      }

      completedFrames++;
      if (completedFrames % 48 === 0 || completedFrames === totalFrames) {
        onProgress?.(Math.round(completedFrames / totalFrames * 100));
        // Yield so the browser can repaint status and keep controls responsive during long files.
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      }
    }

    for (let i = 0; i < output.length; i++) {
      output[i] = weights[i] > 1e-8 ? output[i] / weights[i] : source[i];
    }
    outputChannels.push(output);
  }

  return encodeWav(outputChannels, decoded.sampleRate);
}

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [info, setInfo] = useState<AudioInfo | null>(null);
  const originalUrlRef = useRef<string | null>(null);
  const [analysis, setAnalysis] = useState<Analysis>(defaultAnalysis);
  const [waveform, setWaveform] = useState<number[]>([]);
  const [originalSpectrum, setOriginalSpectrum] = useState<number[]>([]);
  const [processedSpectrum, setProcessedSpectrum] = useState<number[]>([]);
  const [sourceAnalysis, setSourceAnalysis] = useState<Analysis>(defaultAnalysis);
  const [validation, setValidation] = useState('');
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [ffmpegReady, setFfmpegReady] = useState(false);
  const [status, setStatus] = useState('Ready');
  const [mode, setMode] = useState<'adaptive' | 'sample' | 'regenerative'>('regenerative');
  const [profile, setProfile] = useState<SourceProfile>('music');
  const [nr, setNr] = useState(12);
  const [nf, setNf] = useState(-50);
  const [gate, setGate] = useState(-48);
  const [hum, setHum] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [deesser, setDeesser] = useState(0);
  const [repair, setRepair] = useState(0);
  const [aB, setAB] = useState<'A' | 'B'>('A');
  const [playing, setPlaying] = useState(false);
  const [selection, setSelection] = useState([22, 37]);
  const [noiseSample, setNoiseSample] = useState([0, 10]);
  const [noiseSampleLevel, setNoiseSampleLevel] = useState<number | null>(null);
  const [noiseProfile, setNoiseProfile] = useState<NoiseProfile | null>(null);
  const [history, setHistory] = useState<number[][]>([]);
  const [autoRestoreReady, setAutoRestoreReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ffmpegRef = useRef<FFmpeg | null>(null);

  const loadFFmpeg = async () => {
    if (ffmpegRef.current && ffmpegReady) return ffmpegRef.current;
    const ffmpeg = new FFmpeg();
    ffmpeg.on('log', ({ message }) => {
      if (/Error|error|failed/i.test(message)) console.warn(message);
    });
    setStatus('Loading local processing engine…');
    await ffmpeg.load({
      coreURL,
      wasmURL,
    });
    ffmpegRef.current = ffmpeg;
    setFfmpegReady(true);
    setStatus('Engine ready · local processing');
    return ffmpeg;
  };

  const inspect = async (selected: File) => {
    const url = URL.createObjectURL(selected);
    const audio = new Audio(url);
    await new Promise<void>(resolve => {
      audio.onloadedmetadata = () => resolve();
      audio.onerror = () => resolve();
    });
    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    let sampleRate = 0;
    let channels = 0;
    try {
      const context = new AudioContext();
      const decoded = await context.decodeAudioData(await selected.arrayBuffer());
      sampleRate = decoded.sampleRate;
      channels = decoded.numberOfChannels;
      const measured = measureAudio(decoded);
      setSourceAnalysis(measured.analysis);
      setAnalysis(measured.analysis);
      setWaveform(measured.waveform);
      setOriginalSpectrum(measured.spectrum);
      setProcessedSpectrum([]);
      setValidation('');
      await context.close();
    } catch (error) {
      console.warn('Audio metadata decode unavailable; retaining browser metadata only', error);
    }
    setInfo({
      name: selected.name,
      type: selected.type || 'audio/*',
      size: `${(selected.size / 1048576).toFixed(2)} MB`,
      duration,
      sampleRate: sampleRate || 48000,
      channels: channels || 2,
    });
    URL.revokeObjectURL(url);
    setAutoRestoreReady(true);
    setStatus('Analysis complete · real waveform, spectrum and source metrics measured locally');
  };

  const buildSuggestedChain = () => {
    if (!file) return;
    const musicProfile = profile === 'music';
    const singingProfile = profile === 'singing';
    const estimatedNr = 5 + Math.max(0, analysis.hiss - 15) * 0.16 + Math.max(0, analysis.noiseFloor + 55) * 0.22;
    // Keep automatic settings deliberately gentle on musical sources; speech profiles retain their wider range.
    const suggestedNr = Math.round(musicProfile ? Math.max(4, Math.min(8, estimatedNr)) : singingProfile ? Math.max(4, Math.min(7, estimatedNr - 1)) : Math.max(4, Math.min(18, estimatedNr)));
    const suggestedGate = Math.round(Math.max(-58, Math.min(-32, analysis.noiseFloor - 5)));
    const suggestedDeesser = Math.round(Math.max(0, Math.min(70, (analysis.sibilance - 18) * 1.35)));
    const suggestedNf = musicProfile || singingProfile
      ? Math.round(Math.max(-65, Math.min(-45, analysis.noiseFloor - 3)))
      : Math.round(Math.max(-70, Math.min(-35, analysis.noiseFloor - 3)));
    setMode('regenerative');
    setNr(suggestedNr);
    setNf(suggestedNf);
    setGate(suggestedGate);
    setDeesser(suggestedDeesser);
    if (analysis.hum >= 25) setHum(0);
    setStatus(`Conservative Auto Restore chain built · ${diagnosticSummary(analysis)} · estimate uses the full recording, not a dedicated noise-only sample; A/B-check before export.`);
  };

  const analyzeNoiseSample = async () => {
    if (!file || processing) return;
    const startPercent = Math.min(noiseSample[0], noiseSample[1]);
    const endPercent = Math.max(noiseSample[0], noiseSample[1]);
    const durationSeconds = (endPercent - startPercent) / 100 * (info?.duration || 0);
    if (durationSeconds < 0.25) {
      setStatus('Noise sample too short · select at least 0.25 seconds of noise-only audio.');
      return;
    }
    try {
      setStatus('Analyzing selected noise-only region locally…');
      const context = new AudioContext();
      const decoded = await context.decodeAudioData(await file.arrayBuffer());
      const start = Math.max(0, Math.floor(decoded.length * startPercent / 100));
      const end = Math.min(decoded.length, Math.ceil(decoded.length * endPercent / 100));
      let sumSquares = 0;
      let count = 0;
      for (let channel = 0; channel < decoded.numberOfChannels; channel++) {
        const data = decoded.getChannelData(channel);
        for (let i = start; i < end; i++) {
          sumSquares += data[i] * data[i];
          count++;
        }
      }
      await context.close();
      const measuredDb = 20 * Math.log10(Math.max(Math.sqrt(sumSquares / Math.max(1, count)), 1e-7));
      const safeFloor = Math.round(Math.max(-80, Math.min(-20, measuredDb - 3)));
      const spectralProfile = captureNoiseProfile(decoded, start, end);
      setNoiseSampleLevel(Number(measuredDb.toFixed(1)));
      setNoiseProfile(spectralProfile);
      setNf(safeFloor);
      setMode('sample');
      setStatus('Noise profile captured from the selected region · ' + measuredDb.toFixed(1) + ' dBFS average level · Static mode can now use frequency-selective profile denoising. A/B-check musical detail before export.');
    } catch (error) {
      console.error(error);
      setStatus(`Noise sample analysis failed: ${error instanceof Error ? error.message : 'audio decode error'}`);
    }
  };

  const handleFile = async (selected: File) => {
    if (!(await isSupportedAudioFile(selected))) {
      setStatus('Unsupported audio file · choose WAV, MP3, FLAC, AIFF, OGG/OGA, OPUS, M4A or AAC');
      return;
    }
    if (originalUrlRef.current) URL.revokeObjectURL(originalUrlRef.current);
    originalUrlRef.current = URL.createObjectURL(selected);
    setFile(selected);
    setNoiseProfile(null);
    setNoiseSampleLevel(null);
    setProcessedUrl(null);
    setAB('A');
    setPlaying(false);
    await inspect(selected);
  };

  const processAudio = async (overrides?: { mode?: 'adaptive' | 'sample' | 'regenerative'; nr?: number; nf?: number; gate?: number; hum?: number; deesser?: number }) => {
    if (!file) return;
    const activeMode = overrides?.mode ?? mode;
    const activeProfile = profile;
    const activeNr = overrides?.nr ?? nr;
    const activeNf = overrides?.nf ?? nf;
    const activeGate = overrides?.gate ?? gate;
    const activeHum = overrides?.hum ?? hum;
    const activeDeesser = overrides?.deesser ?? deesser;
    setProcessing(true);
    setStatus(activeProfile === 'speech' || activeProfile === 'podcast' ? 'Loading local DeepFilterNet speech enhancement…' : 'Preparing local restoration pipeline…');
    try {
      const ffmpeg = await loadFFmpeg();
      const input = `input-${Date.now()}.${file.name.split('.').pop() || 'wav'}`;
      const output = `hush-${Date.now()}.wav`;
      let workingFile = file;
      const useCapturedProfile = activeMode === 'sample' && noiseProfile !== null && (activeProfile === 'music' || activeProfile === 'singing');
      if (useCapturedProfile && noiseProfile) {
        setStatus('Applying captured noise spectrum · conservative local frequency-selective denoising…');
        const profiled = await applySpectralNoiseProfile(workingFile, noiseProfile, activeNr, (percent) => {
          setStatus('Frequency-selective noise profiling · ' + percent + '% complete…');
        });
        workingFile = new File([profiled], 'profile-denoised-' + Date.now() + '.wav', { type: 'audio/wav' });
      }
      if (repair > 0) {
        setStatus('Reconstruction · repairing the selected short region locally…');
        const reconstructed = await reconstructShortRegion(file, selection[0], selection[1], repair);
        workingFile = reconstructed instanceof File ? reconstructed : new File([reconstructed], `reconstructed-${Date.now()}.wav`, { type: 'audio/wav' });
      }
      if (activeProfile === 'speech' || activeProfile === 'podcast') {
        setStatus('DeepFilterNet 3 · local speech enhancement at 48 kHz…');
        const restored = await deepFilterNetEnhance(workingFile, activeNr / 30);
        workingFile = new File([restored], `deepfilternet-${Date.now()}.wav`, { type: 'audio/wav' });
      }
      await ffmpeg.writeFile(input, await fetchFile(workingFile));
      // DeepFilterNet already performs speech denoising; avoid stacking a second spectral denoiser and gate on speech/podcast sources.
      const speechProfile = activeProfile === 'speech' || activeProfile === 'podcast';
      const filters: string[] = [];
      if (!speechProfile) {
        const effectiveNr = activeMode === 'regenerative' ? Math.min(activeNr, 8) : activeNr;
        const effectiveGate = activeMode === 'regenerative' ? Math.min(activeGate, -48) : activeGate;
        if (!useCapturedProfile) filters.push(
          `afftdn=nr=${effectiveNr}:nf=${activeNf}:tn=${activeMode === 'sample' ? '0' : '1'}:ad=0.5:rf=-38:gs=8`
        );
        // A gate can truncate instrument tails, room tone and reverb. Keep it off in the transparent/static paths and require an intentional stronger setting in Adaptive mode.
        if (activeMode === 'adaptive' && effectiveGate > -45)
          filters.push(
            `agate=threshold=${effectiveGate}dB:ratio=2:attack=10:release=150:range=-18dB`
          );
      }
      if (activeHum > 0) filters.push(`highpass=f=${activeHum === 1 ? 50 : 60}:p=2`);
      if (clicks > 0 || repair > 0) {
        const strength = Math.max(clicks, repair);
        const window = Math.round(20 + strength * 0.55);
        filters.push(`adeclick=w=${window}:o=75:t=2`);
      }
      if (activeDeesser > 0)
        filters.push(
          `deesser=i=${Math.min(0.95, activeDeesser / 100)}:m=0.5:f=0.45:s=0.5`
        );
      setStatus(speechProfile ? 'DeepFilterNet speech enhancement + optional targeted repair…' : activeProfile === 'music' || activeProfile === 'singing' ? 'Music-safe restoration · smoothed spectral denoising; gating only when explicitly raised in Adaptive…' : 'Denoising · spectral subtraction…');
      const command = ['-i', input];
      if (filters.length) command.push('-af', filters.join(','));
      command.push('-c:a', 'pcm_s24le', output);
      await ffmpeg.exec(command);
      const data = await ffmpeg.readFile(output);
      const bytes = data instanceof Uint8Array ? data : new TextEncoder().encode(data);
      const blob = new Blob([bytes.buffer], { type: 'audio/wav' });
      if (processedUrl) URL.revokeObjectURL(processedUrl);
      const nextUrl = URL.createObjectURL(blob);
      setProcessedUrl(nextUrl);
      const processedContext = new AudioContext();
      const processedDecoded = await processedContext.decodeAudioData(await blob.arrayBuffer());
      const measuredProcessed = measureAudio(processedDecoded);
      setProcessedSpectrum(measuredProcessed.spectrum);
      setAnalysis(measuredProcessed.analysis);
      const noiseImprovement = sourceAnalysis.noiseFloor - measuredProcessed.analysis.noiseFloor;
      const hfChange = sourceAnalysis.hiss - measuredProcessed.analysis.hiss;
      const peakSafe = measuredProcessed.analysis.clipping <= 0.05 && measuredProcessed.analysis.peak <= 0.1;
      const dynamicsChange = Math.abs(measuredProcessed.analysis.dynamic - sourceAnalysis.dynamic);
      const findings:string[]=[];
      if (noiseImprovement < 1 && (sourceAnalysis.noiseFloor > -55 || sourceAnalysis.hiss >= 25)) findings.push('limited noise reduction');
      if (hfChange > 35) findings.push('possible high-frequency loss');
      if (dynamicsChange > 8) findings.push('large dynamics change');
      if (!peakSafe) findings.push('clipping risk');
      setValidation(findings.length ? `Review before export · ${findings.join(' · ')}` : 'Validation passed · no major over-processing indicators detected');
      await processedContext.close();
      setAB('B');
      setStatus('Processed · re-analysis and validation completed from rendered audio');
    } catch (error) {
      console.error(error);
      setStatus(
        `Processing failed: ${error instanceof Error ? error.message : 'FFmpeg error'}`
      );
    } finally {
      setProcessing(false);
    }
  };

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio || !sourceUrl) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }
    setStatus(aB === 'B' ? 'Starting processed playback…' : 'Starting original playback…');
    audio.play()
      .then(() => {
        setPlaying(true);
        setStatus(aB === 'B' ? 'Playing · processed' : 'Playing · original');
      })
      .catch(error => {
        console.error(error);
        setPlaying(false);
        setStatus(`Playback failed: ${error instanceof Error ? error.message : 'browser audio error'}`);
      });
  };

  const sourceUrl = file
    ? aB === 'B' && processedUrl
      ? processedUrl
      : originalUrlRef.current
    : null;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !sourceUrl) return;
    audio.pause();
    audio.currentTime = 0;
    audio.src = sourceUrl;
    audio.load();
    setPlaying(false);
  }, [sourceUrl]);

  const exportAudio = () => {
    if (!processedUrl) return;
    const link = document.createElement('a');
    link.href = processedUrl;
    const baseName = (info?.name || 'audio').replace(/\.[^/.]+$/, '');
    link.download = `${baseName}-hush-denoise.wav`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setStatus('Export ready · processed WAV downloaded locally');
  };
  const quality =
    nr >= 20 || gate > -35
      ? 'AGGRESSIVE'
      : nr >= 10
        ? 'MODERATE'
        : 'TRANSPARENT';

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">
            <Waves size={19} />
          </div>
          <div>
            <strong>HUSH DENOISE</strong>
            <small>by Auralcraftverse</small>
          </div>
        </div>
        <div className="file-meta">
          {info ? (
            <>
              <FileAudio size={15} /> <span>{info.name}</span>
              <i /> <span>{info.sampleRate / 1000} kHz</span>
              <i />
              <span>{info.channels}ch</span>
            </>
          ) : (
            <span>NO SOURCE LOADED</span>
          )}
        </div>
        <div className="top-actions">
          <span className="privacy">
            <ShieldCheck size={14} /> LOCAL ONLY
          </span>
          <button className="icon-btn" title="Undo">
            <RotateCcw size={16} />
          </button>
          <button className="icon-btn" title="Redo">
            <RotateCw size={16} />
          </button>
          <button className="export" disabled={!processedUrl} onClick={exportAudio}>
            <Download size={15} /> Export
          </button>
        </div>
      </header>

      {!file ? (
        <section
          className="dropzone"
          onDragOver={e => e.preventDefault()}
          onDrop={e => {
            e.preventDefault();
            const f = e.dataTransfer.files[0];
            if (f) void handleFile(f);
          }}
        >
          <div className="drop-icon">
            <Upload size={25} />
          </div>
          <h1>
            Silence the noise.
            <br />
            <em>Keep the performance.</em>
          </h1>
          <p>
            Professional audio restoration, denoising and repair — processed
            locally on your device.
          </p>
          <label className="primary">
            <Upload size={16} /> Import Audio
            <input
              type="file"
              accept="audio/*,audio/opus,audio/ogg,application/ogg,audio/mp4,audio/x-m4a,audio/m4a,.wav,.mp3,.flac,.aif,.aiff,.ogg,.oga,.opus,.m4a,.aac"
              onChange={e => {
                const f = e.target.files?.[0];
                if (f) void handleFile(f);
              }}
            />
          </label>
          <div className="formats">
            WAV · MP3 · FLAC · AIFF · OGG/OGA · OPUS · M4A · AAC
          </div>
          <div className="local-note">
            <ShieldCheck size={14} /> Your audio stays on your device.
            Processing is performed locally.
          </div>
        </section>
      ) : (
        <>
          <section className="workspace">
            <div className="analysis-panel panel">
              <div className="panel-head">
                <span>ANALYSIS</span>
                <span className="live">
                  <span /> LIVE
                </span>
              </div>
              {(
                [
                  [
                    'Noise Floor',
                    db(analysis.noiseFloor),
                    analysis.noiseFloor < -55 ? 'ok' : 'warn',
                  ],
                  [
                    'Hum',
                    `${analysis.hum}%`,
                    analysis.hum < 10 ? 'ok' : 'warn',
                  ],
                  [
                    'Hiss',
                    `${analysis.hiss}%`,
                    analysis.hiss < 20 ? 'ok' : 'warn',
                  ],
                  [
                    'Clicks',
                    `${clicks ? 'detected' : 'low'}`,
                    clicks ? 'warn' : 'ok',
                  ],
                  [
                    'Sibilance',
                    `${analysis.sibilance}%`,
                    analysis.sibilance < 20 ? 'ok' : 'warn',
                  ],
                  [
                    'Clipping',
                    `${analysis.clipping}%`,
                    analysis.clipping === 0 ? 'ok' : 'bad',
                  ],
                  ['Dynamic Range', `${analysis.dynamic.toFixed(1)} dB`, 'ok'],
                  ['Loudness (RMS)', db(analysis.rms), 'ok'],
                  ['Peak', db(analysis.peak), analysis.peak < -1 ? 'ok' : 'warn'],
                  ['Crest Factor', analysis.crest.toFixed(1) + ' dB', 'ok'],
                ] as const
              ).map(([label, value, state]) => (
                <div className="metric" key={label}>
                  <span>{label}</span>
                  <b className={state}>{value}</b>
                </div>
              ))}
              <div className="qa-card">
                <div>
                  <Gauge size={15} /> AUTO RESTORE DIAGNOSIS
                </div>
                <strong>{diagnosticSummary(analysis)}</strong>
                <small>Whole-file estimate only — quiet musical passages can resemble noise. For Music or Singing, use gentle settings and A/B-check tails, cymbals and reverb before export.</small>
                <button className="auto-btn" onClick={buildSuggestedChain} disabled={!autoRestoreReady || processing}>
                  <Sparkles size={13} /> BUILD SUGGESTED CHAIN
                </button>
              </div>
            </div>

            <div className="center panel">
              <div className="panel-head">
                <span>SONIC WORKSPACE</span>
                <span className="route">
                  IMPORT <b>→</b> ANALYZE <b>→</b> PROFILE <b>→</b> CLEAN{' '}
                  <b>→</b> VALIDATE
                </span>
              </div>
              <div className="wave-area">
                <div className="axis">0 Hz</div>
                <div className="wave-grid">
                  {Array.from({ length: 13 }, (_, i) => (
                    <span key={i} />
                  ))}
                  <div className="waveform original">
                    {waveform.map((height, i) => (
                      <i key={i} style={{ height: height + '%' }} />
                    ))}
                  </div>
                                <div className="selection"
                    style={{
                      left: `${selection[0]}%`,
                      width: `${selection[1] - selection[0]}%`,
                    }}
                  >
                    <span>REPAIR REGION</span>
                  </div>
                </div>
                <div className="axis right">0 dB</div>
              </div>
              <div className="spectrum-title">
                <span>FREQUENCY SPECTRUM / SPECTRAL ENERGY</span>
                <span>
                  20 Hz <b>·</b> 20 kHz
                </span>
              </div>
              <div className="spectra">
                <div>
                  <small>ORIGINAL</small>
                  <Spectrum active={aB === 'A'} bars={originalSpectrum} />
                </div>
                <div>
                  <small>PROCESSED</small>
                  <Spectrum active={aB === 'B'} bars={processedSpectrum.length ? processedSpectrum : originalSpectrum} />
                </div>
              </div>
              <div className="timeline">
                <span>{formatTime(0)}</span>
                <div className="track">
                  <span className="progress" />
                </div>
                <span>{formatTime(info?.duration || 0)}</span>
              </div>
            </div>

            <aside className="clean-panel panel">
              <div className="panel-head">
                <span>CLEANING</span>
                <SlidersHorizontal size={15} />
              </div>
              <div className="section-label">SOURCE PROFILE</div>
              <div className="mode-tabs profile-tabs">
                <button className={profile === 'music' ? 'selected' : ''} onClick={() => setProfile('music')}>Music</button>
                <button className={profile === 'singing' ? 'selected' : ''} onClick={() => setProfile('singing')}>Singing</button>
                <button className={profile === 'speech' ? 'selected' : ''} onClick={() => setProfile('speech')}>Speech</button>
                <button className={profile === 'podcast' ? 'selected' : ''} onClick={() => setProfile('podcast')}>Podcast</button>
              </div>
              <div className="section-label">RESTORATION METHOD</div>
              <div className="mode-tabs">
                <button
                  className={mode === 'regenerative' ? 'selected' : ''}
                  onClick={() => setMode('regenerative')}
                  title="Artifact-shielded restoration that prioritizes natural transients and intelligibility"
                >
                  Regenerative
                </button>
                <button
                  className={mode === 'adaptive' ? 'selected' : ''}
                  onClick={() => setMode('adaptive')}
                >
                  Adaptive
                </button>
                <button
                  className={mode === 'sample' ? 'selected' : ''}
                  onClick={() => setMode('sample')}
                >
                  Static
                </button>
              </div>
              <div className="section-label">NOISE-ONLY SAMPLE</div>
              <small className="sample-help">Select a region containing only background noise — no notes, vocals, cymbals or reverb. Analyze it to capture an averaged frequency spectrum. In Static mode, Music and Singing use that profile for conservative frequency-selective denoising; re-analyze after changing source files.</small>
              <Control
                label="Sample Start"
                value={noiseSample[0]}
                min={0}
                max={99}
                unit="%"
                onChange={value => setNoiseSample(current => [Math.min(value, current[1] - 1), current[1]])}
              />
              <Control
                label="Sample End"
                value={noiseSample[1]}
                min={1}
                max={100}
                unit="%"
                onChange={value => setNoiseSample(current => [current[0], Math.max(value, current[0] + 1)])}
              />
              <button className="auto-btn" onClick={() => void analyzeNoiseSample()} disabled={!file || processing}>
                <Gauge size={13} /> ANALYZE NOISE-ONLY REGION
              </button>
              {noiseSampleLevel !== null && <div className="quality-inline">PROFILE CAPTURED · <b>{noiseSampleLevel.toFixed(1)} dBFS</b> · {noiseProfile ? noiseProfile.magnitudes.length + ' spectral bins' : 'NO PROFILE'} · STATIC FLOOR {nf} dB</div>}
              <Control
                label="Noise Reduction"
                value={nr}
                min={0}
                max={30}
                unit=" dB"
                onChange={setNr}
              />
              <Control
                label="Assumed Noise Floor"
                value={nf}
                min={-80}
                max={-20}
                unit=" dB"
                onChange={setNf}
              />
              <Control
                label="Noise Gate"
                value={gate}
                min={-70}
                max={-10}
                unit=" dB"
                onChange={setGate}
              />
              <div className="section-label">REPAIR</div>
              <ToggleControl
                label="Hum Reduction"
                value={hum}
                options={['OFF', '50 Hz', '60 Hz']}
                onChange={setHum}
              />
              <Control
                label="Click / Pop Repair"
                value={clicks}
                min={0}
                max={100}
                unit="%"
                onChange={setClicks}
              />
              <Control
                label="De-Esser"
                value={deesser}
                min={0}
                max={100}
                unit="%"
                onChange={setDeesser}
              />
              <Control
                label="Reconstruction"
                value={repair}
                min={0}
                max={100}
                unit="%"
                onChange={setRepair}
              />
              <div className="quality-inline">CURRENT PROFILE · <b>{quality}</b> · AUTO RESTORE uses measured diagnostics</div>
              {validation && <div className={`validation ${validation.startsWith('Validation passed') ? 'pass' : 'review'}`}><Gauge size={13} /><span>{validation}</span></div>}
              <div className="warning">
                <Info size={14} />
                <span>
                  DeepFilterNet 3 is used only for Speech and Podcast profiles; it is a speech-enhancement model, not a music-restoration model. Music and Singing use the conservative local DSP path. Reconstruction repairs only a short selected region (capped at 80 ms) using boundary continuity; it does not fabricate missing takes or claim perfect recovery.
                </span>
              </div>
              <button
                className="auto-restore-btn"
                onClick={() => {
                  if (!file) return;
                  const suggestedNr = Math.round(Math.max(4, Math.min(18, 5 + Math.max(0, analysis.hiss - 15) * 0.16 + Math.max(0, analysis.noiseFloor + 55) * 0.22)));
                  const suggestedNf = Math.round(Math.max(-70, Math.min(-35, analysis.noiseFloor - 3)));
                  const suggestedGate = Math.round(Math.max(-58, Math.min(-32, analysis.noiseFloor - 5)));
                  const suggestedDeesser = Math.round(Math.max(0, Math.min(70, (analysis.sibilance - 18) * 1.35)));
                  setMode('regenerative');
                  setNr(suggestedNr);
                  setNf(suggestedNf);
                  setGate(suggestedGate);
                  setDeesser(suggestedDeesser);
                  setHum(0);
                  void processAudio({ mode: 'regenerative', nr: suggestedNr, nf: suggestedNf, gate: suggestedGate, hum: 0, deesser: suggestedDeesser });
                }}
                disabled={!autoRestoreReady || processing}
              >
                <Zap size={16} /> AUTO RESTORE
              </button>
              <button
                className="clean-btn"
                onClick={() => void processAudio()}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <Activity size={16} className="spin" /> PROCESSING…
                  </>
                ) : (
                  <>
                    <Sparkles size={16} /> CLEAN AUDIO
                  </>
                )}
              </button>
            </aside>
          </section>
          <footer className="transport">
            <div className="transport-left">
              <button className="transport-btn" onClick={togglePlayback}>
                {playing ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button
                className="transport-btn"
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                    setPlaying(false);
                  }
                }}
              >
                <Square size={15} />
              </button>
              <span className="time">{playing ? 'PLAYING' : status}</span>
            </div>
            <div className="ab">
              <button
                className={aB === 'A' ? 'on' : ''}
                onClick={() => setAB('A')}
              >
                A <small>ORIGINAL</small>
              </button>
              <button
                className={aB === 'B' ? 'on' : ''}
                disabled={!processedUrl}
                onClick={() => setAB('B')}
              >
                B <small>PROCESSED</small>
              </button>
              <button onClick={() => setAB('A')}>
                <Headphones size={14} /> BYPASS
              </button>
            </div>
            <div className="transport-right">
              <button onClick={() => setMode('sample')}>STATIC MODE</button>
              <span>
                Selection {selection[0]}–{selection[1]}%
              </span>
            </div>
          </footer>
          <audio
            ref={audioRef}
            preload="auto"
            src={sourceUrl || undefined}
            onCanPlay={() => {
              if (!processing && !playing) setStatus(aB === 'B' ? 'Processed audio ready' : 'Original audio ready');
            }}
            onEnded={() => setPlaying(false)}
            onError={() => {
              setPlaying(false);
              setStatus('Playback failed · audio format could not be decoded by this browser');
            }}
          />
        </>
      )}
      <div className="statusbar">
        <span>
          <span className="dot" /> {status}
        </span>
        <span>HUSH DENOISE ENGINE · LOCAL AUDIO ANALYSIS</span>
        <span>
          <CircleHelp size={13} /> REAL SOURCE MEASUREMENTS · LOCAL ONLY
        </span>
      </div>
    </main>
  );
}

function Control({
  label,
  value,
  min,
  max,
  unit,
  onChange,
  disabled = false,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  return (
    <label className={`control ${disabled ? 'disabled' : ''}`}>
      <div>
        <span>{label}</span>
        <b>
          {value}
          {unit}
        </b>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        onChange={e => onChange(Number(e.target.value))}
      />
    </label>
  );
}
function ToggleControl({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: number;
  options: string[];
  onChange: (v: number) => void;
}) {
  return (
    <div className="toggle-control">
      <span>{label}</span>
      <div>
        {options.map((x, i) => (
          <button
            key={x}
            className={value === i ? 'active' : ''}
            onClick={() => onChange(i)}
          >
            {x}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
