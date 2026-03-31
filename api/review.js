export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Read the NVIDIA API Key from the Vercel backend environment
  const NVIDIA_API_KEY = process.env.VITE_NVIDIA_API_KEY || process.env.NVIDIA_API_KEY;

  if (!NVIDIA_API_KEY) {
    return res.status(500).json({ error: 'NVIDIA API key configuration is missing on the server.' });
  }

  try {
    // Forward the exact same body from the frontend to NVIDIA securely
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NVIDIA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    // Send NVIDIA's response back to the frontend
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy Error:', error);
    return res.status(500).json({ error: 'Internal Server Error while communicating with NVIDIA API.' });
  }
}
