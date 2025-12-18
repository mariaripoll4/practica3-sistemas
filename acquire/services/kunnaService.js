require("dotenv").config();

const KUNNA_URL = process.env.KUNNA_URL;
const ALIAS = process.env.ALIAS;

async function fetchKunna(timeStart, timeEnd) {

  const headers = { "Content-Type": "application/json" };

  // Construimos el body que se enviará a kunna
  const body = {
    time_start: timeStart.toISOString(),
    time_end: timeEnd.toISOString(),
    filters: [
      { filter: "name", values: ["1d"] },
      { filter: "alias", values: [ALIAS] }
    ],
    limit: 100,
    count: false,
    order: "DESC"
  };

  // Llamamos a la API externa (kunna)
  const response = await fetch(KUNNA_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`KUNNA_BAD_STATUS:${response.status}`);
  }

  const json = await response.json();
  const result = json.result;

  if (!result || !Array.isArray(result.columns) || !Array.isArray(result.values)) {
    throw new Error("KUNNA_INVALID_RESULT");
  }

  return result; // { columns, values }
}

module.exports = { fetchKunna };
