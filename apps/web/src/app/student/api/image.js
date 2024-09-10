// import { join } from 'path';
// import { createReadStream, statSync } from 'fs';

// export default async function handler(req, res) {
//   const { imageName } = req.query;
//   const imageDirectory = join(process.cwd(), 'src/landingpage/images'); // Ensure this path is correct
//   const imagePath = join(imageDirectory, imageName);

//   // Debugging information
//   console.log('Image Directory:', imageDirectory);
//   console.log('Image Path:', imagePath);

//   try {
//     const stat = statSync(imagePath);
    
//     // Set appropriate headers
//     res.setHeader('Content-Type', 'image/png'); // Change this if images are not PNG
//     res.setHeader('Content-Length', stat.size);
    
//     // Stream the image file
//     const stream = createReadStream(imagePath);
//     stream.pipe(res);
//   } catch (error) {
//     console.error('Error:', error.message); // Log the error message
//     res.status(404).json({ message: 'Image not found' });
//   }
// }
