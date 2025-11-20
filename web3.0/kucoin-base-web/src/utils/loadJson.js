export default async function loadJson(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error(`Error loading JSON ${url}:`, error);
  }
}
