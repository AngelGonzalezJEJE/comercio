const uploadToPinata = async (fileBuffer, fileName) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  // Initialize FormData and add file data
  let data = new FormData();
  data.append('file', fileBuffer, fileName);

  // Metadata and options setup
  const metadata = JSON.stringify({
      name: fileName,
      keyvalues: {
          exampleKey: 'exampleValue'
      }
  });
  data.append('pinataMetadata', metadata);
  
  const options = JSON.stringify({
      cidVersion: 0,
  });
  data.append('pinataOptions', options);

  try {
      const response = await fetch(url, {
          method: 'POST',
          body: data,
          headers: {
              'pinata_api_key': process.env.PINATA_API_KEY, // Recommended to use environment variables
              'pinata_secret_api_key': process.env.PINATA_SECRET_API_KEY
          }
      });

      // Check for successful response
      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Error uploading file: ${response.statusText}, ${errorData.error}`);
      }

      // Parse and return response data
      const responseData = await response.json();
      return responseData;

  } catch (error) {
      console.error('Error uploading file to Pinata:', error);
      throw error;
  }
};

module.exports= uploadToPinata
