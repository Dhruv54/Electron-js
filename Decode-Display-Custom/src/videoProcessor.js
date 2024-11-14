const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

class VideoProcessor {
    constructor() {
        this.frameRate = 30;
        this.mrdHeader = {
            version: 1,
            frameCount: 0,
            fps: this.frameRate,
            width: 0,
            height: 0,
            createdAt: new Date().toISOString()
        };
    }

    async processVideo(videoPath) {
        console.log(`Starting video processing for: ${videoPath}`);
        return new Promise((resolve, reject) => {
            const frames = [];
            const outputPath = videoPath.replace('.mp4', '.mrd');
            console.log(`Output will be saved to: ${outputPath}`);
            
            ffmpeg(videoPath)
                .fps(this.frameRate)
                .on('end', () => {
                    console.log('FFmpeg processing completed, creating MRD file...');
                    this.createMRDFile(frames, outputPath);
                    resolve(outputPath);
                })
                .on('error', (err) => {
                    console.error('FFmpeg error:', err);
                    reject(err);
                })
                .on('progress', (progress) => {
                    console.log(`FFmpeg Processing: ${progress.percent}% done`);
                    console.log(`Frame: ${progress.frames}, FPS: ${progress.currentFps}`);
                })
                .frames()
                .save('./temp/%d.png');
        });
    }

    createMRDFile(frames, outputPath) {
        console.log(`Creating MRD file with ${frames.length} frames`);
        const fileStream = fs.createWriteStream(outputPath);
        
        console.log('Writing header:', this.mrdHeader);
        fileStream.write(JSON.stringify(this.mrdHeader));
        fileStream.write('\n---HEADER_END---\n');

        // Write frames
        frames.forEach(frame => {
            const frameHeader = {
                timestamp: frame.timestamp,
                size: frame.size
            };
            fileStream.write(JSON.stringify(frameHeader));
            fileStream.write('\n');
            fileStream.write(frame.data);
            fileStream.write('\n---FRAME_END---\n');
        });

        fileStream.end();
    }
}