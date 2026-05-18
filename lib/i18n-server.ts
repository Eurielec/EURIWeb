import { cookies } from 'next/headers';
import { dictionaries, Locale } from './i18n';

export async function getDictionaryServer() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('NEXT_LOCALE')?.value || 'es') as Locale;
  return dictionaries[locale] || dictionaries.es;
}
