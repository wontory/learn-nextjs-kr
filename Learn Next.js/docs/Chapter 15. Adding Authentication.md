Chapter 15

# 인증 추가하기

이전 장에서는 인보이스 라우트를 구축하며 양식 유효성 검사를 추가하고 접근성을 향상시켰습니다. 이번 장에서는 대시보드에 인증을 추가할 것입니다.

&nbsp;

> ### 이번 장에서는...
>
> 다음과 같은 내용을 다룰 예정입니다.
>
> - 인증이 무엇인지?
> - NextAuth.js를 사용하여 앱에 인증 추가하는 방법
> - 미들웨어를 사용하여 사용자를 리디렉션하고 라우트를 보호하는 방법
> - React의 `useFormStatus`와 `useFormState`를 사용하여 보류 중인 상태와 양식 오류를 처리하는 방법

&nbsp;

---

&nbsp;

## 인증이란 무엇인가요?

인증은 현재 많은 웹 애플리케이션에서 중요한 부분입니다. 이는 시스템이 사용자 자신이 누구인지 확인하는 방법입니다.

안전한 웹사이트는 종종 사용자의 신원을 확인하는 여러 방법을 사용합니다. 예를 들어, 사용자 이름과 비밀번호를 입력한 후에도 사이트는 사용자의 장치로 인증 코드를 보내거나 Google Authenticator와 같은 외부 앱을 사용할 수 있습니다. 이러한 2단계 인증(2FA)은 보안을 높이는 데 도움이 됩니다. 비밀번호를 알고 있다고 해도 고유한 토큰 없이는 계정에 액세스할 수 없습니다.

&nbsp;

### 인증 vs. 권한 부여

웹 개발에서 인증과 권한 부여는 서로 다른 역할을 합니다.

- **인증(Authentication)** 은 사용자가 자기 자신인지 확인하는 것입니다. 사용자 이름과 비밀번호와 같은 것으로 신원을 증명합니다.
- **권한 부여(Authorization)** 는 다음 단계입니다. 사용자의 신원이 확인되면 권한 부여는 사용자가 애플리케이션의 어떤 부분을 사용할 수 있는지 결정합니다.

그래서 인증은 누구인지 확인하고, 권한 부여는 애플리케이션에서 무엇을 할 수 있는지 또는 액세스할 수 있는지 결정합니다.

&nbsp;

> ### 퀴즈 시간입니다!
>
> 지금까지 배운 내용을 테스트해보세요.
>
> **다음 중 인증과 권한 부여의 차이를 가장 잘 설명하는 것은 무엇일까요?**
>
> - A: 인증은 액세스할 수 있는 것을 결정합니다. 권한 부여는 신원을 확인합니다.
> - B: 인증과 권한 부여는 모두 사용자가 액세스할 수 있는 애플리케이션의 부분을 결정합니다.
> - C: 인증은 신원을 확인합니다. 권한 부여는 액세스할 수 있는 것을 결정합니다.
> - D: 차이가 없습니다. 두 용어는 같은 의미를 갖습니다.
>
> &nbsp;
>
> **정답 확인**
>
> **C: 인증은 신원을 확인합니다. 권한 부여는 액세스할 수 있는 것을 결정합니다.**
>
> 정답입니다! 비슷하게 들리지만, 인증은 신원을 확인하고 권한 부여는 애플리케이션에서 무엇을 할 수 있는지를 결정합니다.

&nbsp;

---

&nbsp;

## 로그인 라우트 생성하기

`/login`이라는 새로운 라우트를 애플리케이션에 생성하여 아래 코드를 붙여넣기하세요:

`/app/login/page.tsx`

```tsx
import AcmeLogo from '@/app/ui/acme-logo';
import LoginForm from '@/app/ui/login-form';

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
```

페이지가 `<LoginForm />`을 가져오는 것을 알 수 있는데, 이는 이 장에서 나중에 업데이트할 것입니다.

&nbsp;

---

&nbsp;

## NextAuth.js

우리는 애플리케이션에 인증을 추가하기 위해 [NextAuth.js](https://nextjs.authjs.dev/)를 사용할 것입니다. NextAuth.js는 세션 관리, 로그인 및 로그아웃, 인증의 다른 측면들을 관리하는 복잡성을 많이 숨겨줍니다. 이러한 기능들을 수동으로 구현할 수도 있지만, 이 과정은 시간이 많이 걸리고 오류가 발생할 수 있습니다. NextAuth.js는 이 과정을 간소화하여 Next.js 애플리케이션에서의 인증에 대한 통일된 솔루션을 제공합니다.

&nbsp;

---

&nbsp;

## NextAuth.js 설정하기

터미널에서 다음 명령어를 실행하여 NextAuth.js를 설치하세요:

`Terminal`

```bash
npm install next-auth@beta
```

여기서 `beta` 버전의 NextAuth.js를 설치하고 있는데, 이는 Next.js 14와 호환됩니다.

다음으로, 애플리케이션을 위한 비밀 키를 생성하세요. 이 키는 쿠키를 암호화하는 데 사용되며 사용자 세션의 보안을 보장합니다. 다음 명령어를 터미널에서 실행하여 키를 생성할 수 있습니다:

`Terminal`

```bash
openssl rand -base64 32
```

그런 다음, `.env` 파일의 `AUTH_SECRET` 변수에 생성된 키를 추가하세요:

`.env`

```shell
AUTH_SECRET=your-secret-key
```

인증을 제대로 사용하려면, Vercel 프로젝트의 환경 변수도 업데이트해야 합니다. Vercel에서 환경 변수를 추가하는 방법은 이 [가이드](https://vercel.com/docs/projects/environment-variables)를 참고하세요.

&nbsp;

### 페이지 옵션 추가하기

프로젝트의 루트에 `auth.config.ts` 파일을 생성하고 `authConfig` 객체를 내보내세요. 이 객체에는 NextAuth.js의 구성 옵션이 포함됩니다. 현재는 `pages` 옵션만 포함될 것입니다:

`/auth.config.ts`

```ts
import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
};
```

`pages` 옵션을 사용하여 사용자 지정 로그인, 로그아웃 및 오류 페이지의 경로를 지정할 수 있습니다. 이는 필수는 아니지만, `signIn: '/login'`을 `pages` 옵션에 추가함으로써 사용자는 NextAuth.js의 기본 페이지 대신에 우리의 사용자 지정 로그인 페이지로 리디렉션됩니다.

&nbsp;

---

&nbsp;

## Next.js 미들웨어를 사용하여 라우트 보호하기

다음으로 라우트를 보호하는 로직을 추가하세요. 이렇게 하면 사용자가 로그인하지 않은 경우 대시보드 페이지에 액세스할 수 없습니다.

`/auth.config.ts`

```ts
import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
```

`authorized` 콜백은 [Next.js 미들웨어](https://nextjs.org/docs/api-routes/api-middlewares)를 통해 페이지에 액세스할 권한이 있는지 확인하는 데 사용됩니다. 이는 요청이 완료되기 전에 호출되며 `auth` 및 `request` 속성을 포함하는 객체를 받습니다. `auth` 속성에는 사용자 세션이 포함되고, `request` 속성에는 들어오는 요청이 포함됩니다.

`providers` 옵션은 다른 로그인 옵션을 나열하는 배열입니다. 지금은 NextAuth 구성을 충족시키기 위해 빈 배열입니다. 이에 대해 자세히 배우는 것은 [자격 증명 제공자 추가](https://nextjs.org/learn/dashboard-app/adding-authentication#adding-the-credentials-provider) 섹션에서 알아볼 것입니다.

다음으로, `authConfig` 객체를 미들웨어 파일로 가져오기 위해 `middleware.ts`라는 파일을 프로젝트의 루트에 생성하고 다음 코드를 붙여넣으세요:

`/middleware.ts`

```ts
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
```

여기서 `authConfig` 객체를 사용하여 NextAuth.js를 초기화하고 `auth` 속성을 내보냅니다. 또한 미들웨어의 `matcher` 옵션을 사용하여 특정 경로에서 실행되도록 지정합니다.

이 작업에 미들웨어를 활용하는 장점은 보호된 라우트가 미들웨어가 인증을 확인하기 전에 렌더링되지 않는다는 것입니다. 이는 애플리케이션의 보안과 성능을 향상시킵니다.

&nbsp;

### 비밀번호 해싱

데이터베이스에 저장하기 전에 비밀번호를 **해싱**하는 것이 좋습니다. 해싱은 비밀번호를 길이가 고정된 문자열로 변환하여 무작위로 보이게 만듭니다. 이는 사용자 데이터가 노출되더라도 보안 계층을 제공합니다.

`seed.js` 파일에서는 사용자의 비밀번호를 데이터베이스에 저장하기 전에 `bcrypt`라는 패키지를 사용하여 해싱했습니다. 이어서 사용자가 입력한 비밀번호가 데이터베이스의 비밀번호와 일치하는지 확인하기 위해 나중에 _다시_ 사용할 것입니다. 그러나 이를 위해 `bcrypt` 패키지를 위한 별도의 파일을 만들어야 합니다. 이는 `bcrypt`가 Next.js 미들웨어에 사용할 수 없는 Node.js API에 의존하기 때문입니다.

`auth.ts`라는 새 파일을 만들고 `authConfig` 객체를 확장하세요:

`/auth.ts`

```ts
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
});
```

&nbsp;

### 자격 증명 제공자 추가

다음으로 NextAuth.js를 위한 `providers` 옵션을 추가해야 합니다. `providers`는 Google 또는 GitHub과 같은 다양한 로그인 옵션을 나열하는 배열입니다. 이 강의에서는 [자격 증명 제공자(Credentials provider)](https://authjs.dev/getting-started/providers/credentials-tutorial)만 사용할 것입니다.

자격 증명 제공자를 사용하면 사용자 이름과 비밀번호로 로그인할 수 있습니다.

`/auth.ts`

```ts
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [Credentials({})],
});
```

> **참고:**
>
> 자격 증명 제공자를 사용하고 있지만, 일반적으로는 [OAuth](https://authjs.dev/getting-started/providers/oauth-tutorial)나 [이메일](https://authjs.dev/getting-started/providers/email-tutorial)과 같은 대안적인 제공자를 사용하는 것이 좋습니다. 전체 옵션 목록은 [NextAuth.js 문서](https://authjs.dev/getting-started/providers)에서 확인할 수 있습니다.

&nbsp;

### 로그인 기능 추가

`authorize` 함수를 사용하여 인증 로직을 처리할 수 있습니다. 서버 액션과 비슷하게 `zod`를 사용하여 이메일과 비밀번호를 유효성 검사한 후 데이터베이스에서 사용자가 존재하는지 확인할 수 있습니다:

`/auth.ts`

```ts
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
      },
    }),
  ],
});
```

자격 증명을 확인한 후 데이터베이스에서 사용자를 가져오는 새 `getUser` 함수를 생성하세요.

`/auth.ts`

```ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
        }

        return null;
      },
    }),
  ],
});
```

그런 다음, 비밀번호가 일치하는지 확인하기 위해 `bcrypt.compare`를 호출하세요:

`/auth.ts`

```ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { sql } from '@vercel/postgres';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';

// ...

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        // ...

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) return user;
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});
```

마지막으로, 비밀번호가 일치하면 사용자를 반환하고, 그렇지 않으면 사용자가 로그인하는 것을 방지하기 위해 `null`을 반환하세요.

&nbsp;

### 로그인 폼 업데이트

이제 로그인 폼과 인증 로직을 연결해야 합니다. `actions.ts` 파일에서 `authenticate`라는 새 액션을 만들어야 합니다. 이 액션은 `auth.ts`에서 `signIn` 함수를 가져와야 합니다:

`/app/lib/actions.ts`

```ts
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

// ...

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
```

`'CredentialsSignin'` 오류가 있을 경우 적절한 오류 메시지를 표시하려고 합니다. NextAuth.js 오류에 대해 자세히 알아보려면 [문서](https://errors.authjs.dev/)를 확인하세요.

마지막으로, `login-form.tsx` 컴포넌트에서 서버 액션을 호출하고 양식 오류를 처리하기 위해 React의 `useFormState`를 사용할 수 있고, `useFormStatus`를 사용하여 양식의 대기 상태를 처리할 수 있습니다:

`app/ui/login-form.tsx`

```tsx
'use client';

import { lusitana } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from '@/app/lib/actions';

export default function LoginForm() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);

  return (
    <form action={dispatch} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Please log in to continue.
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <LoginButton />
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="mt-4 w-full" aria-disabled={pending}>
      Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  );
}
```

&nbsp;

---

&nbsp;

## 로그아웃 기능 추가

`<SideNav />`에 로그아웃 기능을 추가하려면 `<form>` 요소에서 `auth.ts`의 `signOut` 함수를 호출하세요:

`/ui/dashboard/sidenav.tsx`

```tsx
import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import AcmeLogo from '@/app/ui/acme-logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import { signOut } from '@/auth';

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      // ...
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form
          action={async () => {
            'use server';
            await signOut();
          }}
        >
          <button className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
```

&nbsp;

---

&nbsp;

## 인증 시도

이제 인증을 시도해보세요. 다음 자격 증명을 사용하여 응용 프로그램에 로그인하고 로그아웃할 수 있어야 합니다:

- 이메일: `user@nextmail.com`
- 비밀번호: `123456`
