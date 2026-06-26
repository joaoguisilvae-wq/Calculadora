export default async function getConversors() {
  const response = await fetch(
    "http://localhost:8080/conversors/getConversors",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch conversors: ${response.status}`);
  }

  return await response.json();
}
