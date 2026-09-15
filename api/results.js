module.exports = async function handler(req, res) {
  try {
    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

    if (!GOOGLE_SCRIPT_URL) {
      return res.status(500).json({
        error: "GOOGLE_SCRIPT_URL nije podešen na Vercelu."
      });
    }

    const separator = GOOGLE_SCRIPT_URL.includes("?") ? "&" : "?";
    const url = `${GOOGLE_SCRIPT_URL}${separator}get_json=1`;

    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
      headers: {
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      return res.status(502).json({
        error: "Apps Script nije vratio uspešan odgovor.",
        status: response.status
      });
    }

    const data = await response.json();

    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
    );

    return res.status(200).json(data);

  } catch (error) {
    console.error("Apps Script proxy error:", error);

    return res.status(500).json({
      error: "Greška pri povezivanju sa Apps Scriptom.",
      details: error && error.message ? error.message : String(error)
    });
  }
};
