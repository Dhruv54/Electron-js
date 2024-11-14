class MRDPlayer {
    constructor() {
        console.log('Initializing MRD Player');
        this.currentFrame = 0;
        this.frames = [];
        this.canvas = document.getElementById('frameCanvas');
        this.ctx = this.canvas.getContext('2d');
    }

    async loadMRDFile(filePath) {
        console.log(`Loading MRD file from: ${filePath}`);
        const data = await fs.promises.readFile(filePath, 'utf8');
        const sections = data.split('---HEADER_END---');
        
        // Parse header
        this.header = JSON.parse(sections[0]);
        console.log('Parsed header:', this.header);
        
        // Parse frames
        const framesData = sections[1].split('---FRAME_END---');
        console.log(`Found ${framesData.length} frames in file`);
        
        this.frames = framesData.map((frameData, index) => {
            if (index % 10 === 0) console.log(`Processing frame ${index}...`);
            const [headerStr, imageData] = frameData.split('\n');
            return {
                header: JSON.parse(headerStr),
                data: imageData
            };
        });

        console.log('Finished loading MRD file');
        this.displayFrame(0);
    }

    displayFrame(index) {
        console.log(`Attempting to display frame ${index}`);
        if (index < 0 || index >= this.frames.length) {
            console.warn(`Invalid frame index: ${index}`);
            return;
        }
        
        const frame = this.frames[index];
        console.log(`Displaying frame ${index}, timestamp: ${frame.header.timestamp}`);
        const img = new Image();
        img.onload = () => {
            this.ctx.drawImage(img, 0, 0);
        };
        img.src = frame.data;
        this.currentFrame = index;
    }

    nextFrame() {
        this.displayFrame(this.currentFrame + 1);
    }

    previousFrame() {
        this.displayFrame(this.currentFrame - 1);
    }
}