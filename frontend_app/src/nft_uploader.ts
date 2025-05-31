import fs from 'fs';
import path from 'path';
import PinataClient, { PinataPinResponse } from '@pinata/sdk';

// Define interfaces for better type safety
interface PinataMetadata {
    name: string;
    keyvalues?: Record<string, string | number | Date>;
}

interface PinFileOptions {
    pinataMetadata?: PinataMetadata;
    pinataOptions?: {
        cidVersion?: 0 | 1;
        wrapWithDirectory?: boolean;
    };
}

interface NftMetadata {
    name: string;
    description: string;
    image: string;
}

interface UploadResult {
    file: string;
    imageCid: string;
    metadataCid: string;
}

const apiKeyLines: string[] = fs.readFileSync('api_key.txt', 'utf-8').split('\n');
const pinataApiKey: string = apiKeyLines.find(line => line.startsWith('API Key:'))?.replace('API Key:', '').trim() || '';
const pinataSecretApiKey: string = apiKeyLines.find(line => line.startsWith('API Secret:'))?.replace('API Secret:', '').trim() || '';

if (!pinataApiKey || !pinataSecretApiKey) {
    console.error("API Key or API Secret not found in api_key.txt. Please ensure the file exists and is correctly formatted.");
    process.exit(1);
}

const pinata = new PinataClient(pinataApiKey, pinataSecretApiKey);

const imagesDir: string = path.join('examples');
const files: string[] = fs.readdirSync(imagesDir).filter(f => /\.(png|jpg|jpeg|gif)$/i.test(f));

async function uploadImagesAndMetadata(): Promise<UploadResult[]> {
  const results: UploadResult[] = [];
  for (const file of files) {
    const filePath: string = path.join(imagesDir, file);
    const readableStream: fs.ReadStream = fs.createReadStream(filePath);

    // Upload image to Pinata
    const imgOptions: PinFileOptions = {
      pinataMetadata: { name: file }
    };
    const imgRes: PinataPinResponse = await pinata.pinFileToIPFS(readableStream, imgOptions);
    const imageCid: string = imgRes.IpfsHash;

    // Create metadata
    const metadata: NftMetadata = {
      name: path.parse(file).name,
      description: `NFT image for ${file}`,
      image: `ipfs://${imageCid}`
    };

    const metaOptions: PinFileOptions = {
        pinataMetadata: { name: `${path.parse(file).name}-metadata` }
    };
    const metaRes: PinataPinResponse = await pinata.pinJSONToIPFS(metadata, metaOptions);
    const metadataCid: string = metaRes.IpfsHash;

    results.push({ file, imageCid, metadataCid });
    console.log({ file, imageCid, metadataCid });
  }
  fs.writeFileSync('output.json', JSON.stringify(results, null, 2));
  console.log('Results saved to output.json');
  return results;
}

uploadImagesAndMetadata().catch(console.error);
