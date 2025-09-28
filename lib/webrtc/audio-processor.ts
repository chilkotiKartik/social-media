// Advanced audio processing with noise cancellation
export class AudioProcessor {
  private audioContext: AudioContext | null = null
  private sourceNode: MediaStreamAudioSourceNode | null = null
  private gainNode: GainNode | null = null
  private compressorNode: DynamicsCompressorNode | null = null
  private filterNode: BiquadFilterNode | null = null
  private analyserNode: AnalyserNode | null = null
  private destinationStream: MediaStream | null = null

  constructor() {
    this.initializeAudioContext()
  }

  private initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      console.log("[v0] Audio context initialized")
    } catch (error) {
      console.error("[v0] Error initializing audio context:", error)
    }
  }

  // Process audio stream with noise cancellation and enhancement
  async processAudioStream(inputStream: MediaStream): Promise<MediaStream> {
    if (!this.audioContext) {
      throw new Error("Audio context not initialized")
    }

    try {
      // Create source node from input stream
      this.sourceNode = this.audioContext.createMediaStreamSource(inputStream)

      // Create gain node for volume control
      this.gainNode = this.audioContext.createGain()
      this.gainNode.gain.value = 1.0

      // Create compressor for dynamic range control
      this.compressorNode = this.audioContext.createDynamicsCompressor()
      this.compressorNode.threshold.value = -24
      this.compressorNode.knee.value = 30
      this.compressorNode.ratio.value = 12
      this.compressorNode.attack.value = 0.003
      this.compressorNode.release.value = 0.25

      // Create high-pass filter to remove low-frequency noise
      this.filterNode = this.audioContext.createBiquadFilter()
      this.filterNode.type = "highpass"
      this.filterNode.frequency.value = 80 // Remove frequencies below 80Hz
      this.filterNode.Q.value = 1

      // Create analyser for audio visualization
      this.analyserNode = this.audioContext.createAnalyser()
      this.analyserNode.fftSize = 256
      this.analyserNode.smoothingTimeConstant = 0.8

      // Create destination for processed stream
      const destination = this.audioContext.createMediaStreamDestination()

      // Connect the audio processing chain
      this.sourceNode
        .connect(this.filterNode)
        .connect(this.compressorNode)
        .connect(this.gainNode)
        .connect(this.analyserNode)
        .connect(destination)

      this.destinationStream = destination.stream

      // Add video tracks from original stream if they exist
      const videoTracks = inputStream.getVideoTracks()
      videoTracks.forEach((track) => {
        this.destinationStream!.addTrack(track)
      })

      console.log("[v0] Audio processing chain created")
      return this.destinationStream
    } catch (error) {
      console.error("[v0] Error processing audio stream:", error)
      return inputStream // Return original stream if processing fails
    }
  }

  // Apply noise gate to reduce background noise
  applyNoiseGate(threshold = -40) {
    if (!this.gainNode || !this.analyserNode) return

    const bufferLength = this.analyserNode.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const checkAudioLevel = () => {
      this.analyserNode!.getByteFrequencyData(dataArray)

      // Calculate average audio level
      const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength
      const dbLevel = 20 * Math.log10(average / 255)

      // Apply noise gate
      if (dbLevel < threshold) {
        this.gainNode!.gain.setTargetAtTime(0, this.audioContext!.currentTime, 0.01)
      } else {
        this.gainNode!.gain.setTargetAtTime(1, this.audioContext!.currentTime, 0.01)
      }

      requestAnimationFrame(checkAudioLevel)
    }

    checkAudioLevel()
  }

  // Get audio level for visualization
  getAudioLevel(): number {
    if (!this.analyserNode) return 0

    const bufferLength = this.analyserNode.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    this.analyserNode.getByteFrequencyData(dataArray)

    const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength
    return average / 255 // Normalize to 0-1
  }

  // Adjust gain
  setGain(value: number) {
    if (this.gainNode) {
      this.gainNode.gain.setTargetAtTime(value, this.audioContext!.currentTime, 0.01)
      console.log("[v0] Gain set to:", value)
    }
  }

  // Enable/disable audio processing
  setEnabled(enabled: boolean) {
    if (this.gainNode) {
      this.gainNode.gain.setTargetAtTime(enabled ? 1 : 0, this.audioContext!.currentTime, 0.01)
      console.log("[v0] Audio processing:", enabled ? "enabled" : "disabled")
    }
  }

  // Cleanup
  cleanup() {
    console.log("[v0] Cleaning up audio processor")

    if (this.sourceNode) {
      this.sourceNode.disconnect()
      this.sourceNode = null
    }

    if (this.gainNode) {
      this.gainNode.disconnect()
      this.gainNode = null
    }

    if (this.compressorNode) {
      this.compressorNode.disconnect()
      this.compressorNode = null
    }

    if (this.filterNode) {
      this.filterNode.disconnect()
      this.filterNode = null
    }

    if (this.analyserNode) {
      this.analyserNode.disconnect()
      this.analyserNode = null
    }

    if (this.audioContext && this.audioContext.state !== "closed") {
      this.audioContext.close()
      this.audioContext = null
    }

    this.destinationStream = null
  }
}
