Chapter 5

# 페이지 간 이동하기

이전 장에서는 대시보드 레이아웃과 페이지를 만들었습니다. 이제 대시보드 경로들 간에 이동할 수 있도록 몇 가지 링크를 추가해 봅시다.

> ### 이 장에서는...
>
> 다음과 같은 주제들을 다룰 예정입니다.
>
> - `next/link` 컴포넌트 사용 방법
> - `usePathname()` 훅을 사용하여 활성화된 링크 표시하는 방법
> - Next.js에서 페이지 이동이 작동하는 방법

---

## 페이지 이동 최적화의 필요성

페이지 간에 링크를 만들려면 전통적으로는 `<a>` HTML 요소를 사용해야 합니다. 현재 측면 링크는 `<a>` 요소를 사용하고 있지만 브라우저에서 홈, 송장 및 고객 페이지 간에 이동할 때 발생하는 현상을 주의하세요.

보셨나요?

각 페이지 이동 시 전체 페이지가 새로 고침됩니다!

---

## `<Link>` 컴포넌트

Next.js에서는 애플리케이션 내의 페이지 간에 링크를 만들기 위해 `<Link />` 컴포넌트를 사용할 수 있습니다. `<Link>`를 사용하면 JavaScript를 사용하여 [클라이언트-사이드 페이지 이동](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#how-routing-and-navigation-works)이 가능합니다.

`<Link />` 컴포넌트를 사용하기 위해 `/app/ui/dashboard/nav-links.tsx` 파일을 열고 [`next/link`](https://nextjs.org/docs/app/api-reference/components/link)에서 `Link` 컴포넌트를 가져와서 `<a>` 태그를 `<Link>`로 변경하세요.

`/app/ui/dashboard/nav-links.tsx`

```tsx
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

// ...

export default function NavLinks() {
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
```

`Link` 컴포넌트는 `<a>` 태그를 사용하는 것과 유사하지만 `<a href="…">` 대신에 `<Link href="…">`를 사용합니다.

변경 사항을 저장하고 localhost에서 작동하는지 확인하세요. 이제 새로 고침 없이 페이지 간에 이동이 가능해야 합니다. 애플리케이션의 일부가 서버에서 렌더링되기는 하지만 전체 페이지 새로 고침이 없어 웹 앱처럼 느껴집니다. 왜 그럴까요?

### 자동 코드 분할 및 사전 로딩

페이지 이동 경험을 향상시키기 위해 Next.js는 라우트 세그먼트별로 애플리케이션 코드를 자동으로 분할합니다. 이는 브라우저가 초기 로드 시 모든 애플리케이션 코드를 로드하는 전통적인 React [싱글 페이지 애플리케이션](https://developer.mozilla.org/en-US/docs/Glossary/SPA)과 다릅니다.

라우트별로 코드를 분할하면 페이지가 격리됩니다. 특정 페이지에서 오류가 발생하더라도 나머지 애플리케이션은 여전히 작동합니다.

또한 production 환경에서 브라우저 뷰포트에 [`<Link>`](https://nextjs.org/docs/api-reference/next/link) 컴포넌트가 나타나면 Next.js가 자동으로 연결된 경로의 코드를 백그라운드에서 **사전로드(prefetches)**합니다. 사용자가 링크를 클릭할 때 대상 페이지의 코드는 이미 백그라운드에서 로드되어 페이지 전환이 거의 즉시 발생합니다!

자세한 내용은 [페이지 이동이 작동하는 방법](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#how-routing-and-navigation-works)을 확인하세요.

> ### 퀴즈 시간!
>
> 여러분이 방금 배운 내용을 테스트하고 학습한 내용을 확인하세요.
>
> **production 환경에서 브라우저 뷰포트에 <Link> 컴포넌트가 나타날 때 Next.js가 수행하는 작업은 무엇인가요?**
>
> - A: 추가 CSS 다운로드
> - B: 이미지 사전로드
> - C: 연결된 경로의 코드 사전로드
> - D: 연결된 경로의 지연 로딩 활성화
>
> &nbsp;
>
> #### 정답 확인
>
> **C: 연결된 경로의 코드 사전로드**

---

## 패턴: 활성화된 링크 표시

사용자에게 현재 어떤 페이지에 있는지 나타내기 위해 활성화된 링크를 표시하는 것은 일반적인 UI 패턴입니다. 이를 위해서는 사용자의 현재 경로를 URL에서 가져와야 합니다. Next.js는 [`usePathname()`](https://nextjs.org/docs/app/api-reference/functions/use-pathname)이라는 훅을 제공하며 이를 사용하여 경로를 확인하고 해당 패턴을 구현할 수 있습니다.

[`usePathname()`](https://nextjs.org/docs/app/api-reference/functions/use-pathname)은 훅이므로 `nav-links.tsx`를 클라이언트 컴포넌트로 변환해야 합니다. 파일 맨 위에 React의 `"use client"` 지시어를 추가한 다음 `next/navigation`에서 `usePathname()`을 가져오세요.

`/app/ui/dashboard/nav-links.tsx`

```tsx
'use client';

import {
  UserGroupIcon,
  HomeIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// ...
```

다음으로 `<NavLinks />` 컴포넌트 내에서 `pathname`이라는 변수에 경로를 할당하세요.

`/app/ui/dashboard/nav-links.tsx`

```tsx
export default function NavLinks() {
  const pathname = usePathname();
  // ...
}
```

`clsx` 라이브러리는 [CSS 스타일링](https://nextjs.org/learn/dashboard-app/css-styling) 챕터에서 소개한 것처럼 링크가 활성 상태일 때 클래스 이름을 조건부로 적용하는 데 사용할 수 있습니다. `link.href`가 `pathname`과 일치하는 경우 링크는 파란색 텍스트와 연한 파란색 배경으로 표시되어야 합니다.

다음은 `nav-links.tsx`의 최종 코드입니다.

`/app/ui/dashboard/nav-links.tsx`

```tsx
'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// ...

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
```

저장하고 localhost에서 확인하세요. 이제 활성화된 링크가 파란색으로 강조되어 표시됩니다.
