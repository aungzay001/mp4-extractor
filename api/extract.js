export default async function handler(req, res) {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    res.status(400).json({ error: "No URL provided" });
    return;
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const html = await response.text();

    const mp4 = html.match(/https?:\/\/[^"'\\s]+\.mp4/gi) || [];
    const m3u8 = html.match(/https?:\/\/[^"'\\s]+\.m3u8/gi) || [];

    const links = [...new Set([...mp4, ...m3u8])];

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json({
      success: true,
      count: links.length,
      links
    });

  } catch (e) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch target"
    });
  }
}
