"""Prepare the supplied recordings: python3 tools/prepare-bird-audio.py --ffmpeg /path/to/ffmpeg.

Requires FFmpeg with libmp3lame. Originals remain untouched at the repository root.
No resampling of playback speed, compression, noise gate or pitch correction.
"""

import argparse
from array import array
import hashlib
import json
import math
from pathlib import Path
import subprocess
import sys


ROOT = Path(__file__).resolve().parents[1]
RECIPES = [
]


def decode(ffmpeg, path, start=0, end=None):
    filters = f"atrim=start={start}"
    if end is not None:
        filters += f":end={end}"
    raw = subprocess.check_output([
        ffmpeg, "-v", "error", "-i", str(path), "-af", filters,
        "-ac", "1", "-ar", "48000", "-f", "f32le", "-",
    ])
    samples = array("f")
    samples.frombytes(raw)
    if sys.byteorder != "little":
        samples.byteswap()
    return samples


def levels(samples):
    if not samples:
        raise ValueError("Empty excerpt")
    peak = max(abs(x) for x in samples)
    rms = math.sqrt(sum(x * x for x in samples) / len(samples))
    if rms == 0:
        raise ValueError("Silent excerpt")
    return 20 * math.log10(peak), 20 * math.log10(rms)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--ffmpeg", default="ffmpeg")
    args = parser.parse_args()
    # Check all sources before writing any output.
    for source, _, _, _ in RECIPES:
        if not (ROOT / source).is_file():
            parser.error(f"Missing original: {source}")
    report = []
    for source, name, start, end in RECIPES:
        original = ROOT / source
        output = ROOT / "src/assets/audio" / f"{name}.mp3"
        peak, rms = levels(decode(args.ffmpeg, original, start, end))
        # Match the existing birds' range while reserving headroom for MP3 overshoot.
        gain = min(-23 - rms, -5 - peak)
        duration = end - start
        filters = (
            f"atrim=start={start}:end={end},asetpts=PTS-STARTPTS,"
            f"volume={gain:.6f}dB,afade=t=in:d=0.02,"
            f"afade=t=out:st={duration - 0.02:.6f}:d=0.02"
        )
        subprocess.run([
            args.ffmpeg, "-v", "error", "-y", "-i", str(original),
            "-map_metadata", "-1", "-af", filters, "-ac", "1", "-ar", "44100",
            "-codec:a", "libmp3lame", "-b:a", "128k", str(output),
        ], check=True)
        samples = decode(args.ffmpeg, output)
        out_peak, out_rms = levels(samples)
        if out_peak > -3 or any(abs(x) >= 1 for x in samples):
            raise ValueError(f"Insufficient headroom: {output}")
        report.append({
            "source": source, "source_sha256": hashlib.sha256(original.read_bytes()).hexdigest(),
            "output": output.name, "start": start, "end": end,
            "gain_db": round(gain, 2), "duration_s": round(len(samples) / 48000, 3),
            "peak_dbfs": round(out_peak, 2), "rms_dbfs": round(out_rms, 2),
            "bytes": output.stat().st_size,
        })
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
