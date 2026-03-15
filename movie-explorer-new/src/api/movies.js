const API_BASE = 'https://api.tvmaze.com'

function mapShow(raw) {
  return {
    id: raw.id,
    title: raw.name,
    year: raw.premiered ? raw.premiered.slice(0, 4) : 'N/A',
    rating: raw.rating?.average ?? null,
    genres: raw.genres ?? [],
    image: raw.image?.medium ?? '',
    backdrop: raw.image?.original ?? raw.image?.medium ?? '',
    runtime: raw.runtime ?? null,
    language: raw.language ?? '',
    status: raw.status ?? '',
    schedule: raw.schedule ?? {},
    summary: raw.summary ? raw.summary.replace(/<[^>]+>/g, '') : '',
  }
}

export async function fetchAllShows() {
  const response = await fetch(`${API_BASE}/shows`)

  if (!response.ok) {
    throw new Error('Neuspješno dohvaćanje filmova.')
  }

  const data = await response.json()
  return data.map(mapShow)
}

export async function fetchShowById(id) {
  const response = await fetch(`${API_BASE}/shows/${id}`)

  if (!response.ok) {
    throw new Error('Neuspješno dohvaćanje detalja filma.')
  }

  const data = await response.json()
  return mapShow(data)
}

