import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Routes publiques
  const publicPaths = ['/login', '/register']
  
  // Vérifier si le chemin est public
  const isPublicPath = publicPaths.includes(pathname)

  // Récupérer le token depuis les cookies
  const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '')

  // Si l'utilisateur n'est pas connecté et essaie d'accéder à une route protégée
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Si l'utilisateur est connecté et essaie d'accéder à login/register
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
