module.exports = async function handler(req, res) {
  try {
    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

    if (!GOOGLE_SCRIPT_URL) {
      return res.status(500).json({
        error: "GOOGLE_SCRIPT_URL nije podešen."
      });
    }

    const separator = GOOGLE_SCRIPT_URL.includes("?") ? "&" : "?";
    const url = `${GOOGLE_SCRIPT_URL}${separator}get_status=1`;

    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Greška pri čitanju statusa.");
    }

    const data = await response.json();

    res.setHeader("Cache-Control", "no-store");

    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
};
