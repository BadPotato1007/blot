import type { APIRoute } from 'astro'
import { getUserByEmail, makeLoginCode } from '../../../db/account'
import { isValidEmail, loginCodeTemplate, mail } from '../../../db/email'

export const POST: APIRoute = async ({ request }) => {
  let email: string
  try {
    const body = await request.json()
    if (typeof body.email !== 'string' || !isValidEmail(body.email))
      throw 'Missing/invalid email'
    email = body.email
  } catch (error) {
    return new Response(
      typeof error === 'string' ? error : 'Bad request body',
      { status: 400 }
    )
  }

  const user = await getUserByEmail(email);
  const code = await makeLoginCode(user.id)
  await mail(user.email, loginCodeTemplate(code))
  return new Response(JSON.stringify({}), { status: 200 })
}
