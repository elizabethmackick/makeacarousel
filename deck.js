const FB_URL = 'https://makeacarousel-default-rtdb.firebaseio.com';

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const slug = url.searchParams.get('slug');
  if (!slug) {
    return new Response(JSON.stringify({ error: 'Missing slug' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const res = await fetch(FB_URL + '/decks/' + encodeURIComponent(slug) + '.json');
  const data = await res.json();

  if (data === null) {
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { slug, data } = body;

    if (!slug || !data) {
      return new Response(JSON.stringify({ error: 'Missing slug or data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if slug exists
    const checkRes = await fetch(FB_URL + '/decks/' + encodeURIComponent(slug) + '.json');
    const existing = await checkRes.json();

    if (existing !== null) {
      return new Response(JSON.stringify({ error: 'taken' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Write to Firebase
    const writeRes = await fetch(FB_URL + '/decks/' + encodeURIComponent(slug) + '.json', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!writeRes.ok) {
      const errText = await writeRes.text();
      return new Response(JSON.stringify({ error: 'Firebase error: ' + errText }), {
        status: writeRes.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ ok: true, slug }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
