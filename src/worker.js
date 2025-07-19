import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

/**
 * The DEBUG flag will do two things that help during development:
 * 1. we will skip caching on the edge, which makes it easier to
 *    debug.
 * 2. we will return an error message on exception in your Response rather
 *    than the default 404.html page.
 */
const DEBUG = false

addEventListener('fetch', event => {
  try {
    event.respondWith(handleEvent(event))
  } catch (e) {
    if (DEBUG) {
      return event.respondWith(
        new Response(e.message || e.toString(), {
          status: 500,
        }),
      )
    }
    event.respondWith(new Response('Internal Error', { status: 500 }))
  }
})

async function handleEvent(event) {
  const url = new URL(event.request.url)
  let options = {}

  /**
   * You can add custom logic to how we fetch your assets
   * by configuring the function `mapRequestToAsset`
   */
  // options.mapRequestToAsset = req => {
  //   console.log('mapRequestToAsset called:', req.url)
  //   if (req.url.endsWith('/')) {
  //     return new Request(`${req.url}index.html`, req)
  //   }
  //   return req
  // }

  try {
    if (DEBUG) {
      // customize caching
      options.cacheControl = {
        bypassCache: true,
      }
    }
    
    // Handle SEO files with proper content types
    if (url.pathname.endsWith('.xml')) {
      const response = await getAssetFromKV(event, options)
      return new Response(response.body, {
        ...response,
        headers: {
          ...response.headers,
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=86400',
        },
      })
    }
    
    if (url.pathname.endsWith('.txt')) {
      const response = await getAssetFromKV(event, options)
      return new Response(response.body, {
        ...response,
        headers: {
          ...response.headers,
          'Content-Type': 'text/plain',
          'Cache-Control': 'public, max-age=86400',
        },
      })
    }
    
    // Handle HTML files with proper caching
    if (url.pathname.endsWith('.html') || url.pathname === '/') {
      const response = await getAssetFromKV(event, options)
      return new Response(response.body, {
        ...response,
        headers: {
          ...response.headers,
          'Cache-Control': 'public, max-age=3600',
        },
      })
    }
    
    // Handle static assets with long-term caching
    if (url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
      const response = await getAssetFromKV(event, options)
      return new Response(response.body, {
        ...response,
        headers: {
          ...response.headers,
          'Cache-Control': 'public, max-age=31536000',
        },
      })
    }

    return await getAssetFromKV(event, options)
  } catch (e) {
    // if an error is thrown try to serve the asset at 404.html
    if (!DEBUG) {
      try {
        let notFoundResponse = await getAssetFromKV(event, {
          mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/404.html`, req),
        })

        return new Response(notFoundResponse.body, { ...notFoundResponse, status: 404 })
      } catch (e) {}
    }

    return new Response(e.message || e.toString(), { status: 500 })
  }
}

/**
 * Here's one example of how to modify a request to
 * allow you to modify the cfCacheKey and cacheTtl used
 * for the request.
 */
// async function cacheKeyModifier(request) {
//   const url = new URL(request.url)
//   const customKey = `${url.origin}${url.pathname}?${url.searchParams}`
//   const customTtl = 60 * 60 * 24 * 365 // 1 year
//   return { cfCacheKey: customKey, cacheTtl: customTtl }
// }

/**
 * The following code is optional and can be removed if not needed.
 * It allows you to bind a variable to the incoming request, which
 * can be used to change the context of the asset being served.
 */
// async function mapRequestToAsset(request) {
//   const url = new URL(request.url)
//   const pathname = url.pathname
//   const lastSegment = pathname.split('/').pop()
//   const isFile = lastSegment.includes('.')
//   if (!isFile) {
//     // if the pathname doesn't look like a file, serve index.html
//     return new Request(`${url.origin}/index.html`, request)
//   }
//   return request
// } 