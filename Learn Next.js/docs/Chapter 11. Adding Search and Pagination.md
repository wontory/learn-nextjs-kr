Chapter 11

# 검색과 페이지네이션 추가

이전 장에서 스트리밍을 사용하여 대시보드의 초기 로딩 성능을 향상시켰습니다. 이제 `/invoices` 페이지로 이동하여 검색과 페이지네이션을 추가하는 방법을 배워봅시다!

&nbsp;

> ### 이번 장에서는...
>
> 다음과 같은 내용을 다룰 예정입니다.
>
> - Next.js API인 `searchParams`, `usePathname`, `useRouter`의 사용 방법 배우기
> - URL 검색 매개변수를 사용하여 검색과 페이지네이션 구현하기

&nbsp;

## 시작 코드

`/dashboard/invoices/page.tsx` 파일 안에 다음 코드를 붙여넣으세요:

`/app/dashboard/invoices/page.tsx`

```typescript
import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';

export default async function Page() {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>송장</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="송장 검색..." />
        <CreateInvoice />
      </div>
      {/*  <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense> */}
      <div className="mt-5 flex w-full justify-center">
        {/* <Pagination totalPages={totalPages} /> */}
      </div>
    </div>
  );
}
```

앞으로 작업할 페이지와 컴포넌트들을 익히는 데 시간을 투자해보세요:

1. `<Search/>`는 특정 송장을 검색할 수 있도록 합니다.
2. `<Pagination/>`은 송장 페이지 간을 이동할 수 있게 합니다.
3. `<Table/>`은 송장을 표시합니다.

검색 기능은 클라이언트와 서버에 걸쳐 작동합니다. 사용자가 클라이언트에서 송장을 검색하면 URL 매개변수가 업데이트되고 서버에서 데이터를 가져와 테이블이 새 데이터로 서버에서 다시 렌더링됩니다.

&nbsp;

## 왜 URL 검색 매개변수를 사용할까요?

위에서 언급한대로 검색 상태를 관리하기 위해 URL 검색 매개변수를 사용할 것입니다. 이 패턴은 클라이언트 측 상태로 작업하는 데 익숙하다면 새로울 수 있습니다.

URL 매개변수를 사용하는 검색의 몇 가지 이점은 다음과 같습니다:

- **북마크 및 공유 가능한 URL**: 검색 매개변수가 URL에 포함되어 있기 때문에 사용자는 애플리케이션의 현재 상태를 북마크하여 나중에 참조하거나 공유할 수 있습니다.
- **서버 측 렌더링 및 초기 로드**: URL 매개변수는 초기 상태를 렌더링하는 데 직접적으로 사용될 수 있어 서버 렌더링을 처리하기 쉽습니다.
- **분석 및 추적**: URL에 검색 쿼리와 필터가 직접 포함되어 있기 때문에 추가적인 클라이언트 측 로직 없이 사용자 행동을 추적하기가 더 쉽습니다.

&nbsp;

## 검색 기능 추가하기

다음은 검색 기능을 구현하는 데 사용할 Next.js 클라이언트 훅들입니다:

- **`useSearchParams`** - 현재 URL의 매개변수에 액세스할 수 있게 합니다. 예를 들어 이 URL `/dashboard/invoices?page=1&query=pending`의 검색 매개변수는 다음과 같이 보일 것입니다: `{page: '1', query: 'pending'}`.
- **`usePathname`** - 현재 URL의 경로명을 읽을 수 있게 합니다. 예를 들어 `/dashboard/invoices` 경로의 경우, `usePathname`은 `'/dashboard/invoices'`를 반환합니다.
- **`useRouter`** - 클라이언트 구성 요소 내에서 라우트 간에 탐색을 가능하게 합니다. [여러 가지 방법](https://nextjs.org/docs/app/api-reference/functions/use-router#userouter)을 사용할 수 있습니다.

구현 단계에 대한 간단한 개요입니다:

1. 사용자 입력을 캡처합니다.
2. 검색 매개변수로 URL을 업데이트합니다.
3. URL을 입력 필드와 동기화합니다.
4. 검색 쿼리를 반영하여 테이블을 업데이트합니다.

&nbsp;

### 1. 사용자 입력 캡처하기

`<Search>` 컴포넌트 (`/app/ui/search.tsx`)로 이동하면 다음을 볼 수 있습니다:

- `"use client"` - 이는 클라이언트 컴포넌트로, 이벤트 리스너와 훅을 사용할 수 있음을 의미합니다.
- `<input>` - 이는 검색 입력란입니다.

`handleSearch` 함수를 만들고, `<input>` 요소에 `onChange` 리스너를 추가하세요. `onChange`는 입력 값이 변경될 때마다 `handleSearch`를 호출할 것입니다.

`/app/ui/search.tsx`

```typescript
'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Search({ placeholder }: { placeholder: string }) {
  function handleSearch(term: string) {
    console.log(term);
  }

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        검색
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
```

개발자 도구에서 콘솔을 열고 검색 필드에 입력해보세요. 검색어가 콘솔에 로그되는 것을 확인할 수 있어야 합니다.

좋아요! 사용자의 검색 입력을 캡처하는 데 성공했습니다. 이제 검색어로 URL을 업데이트해야 합니다.

&nbsp;

### 2. URL 검색 매개변수로 URL 업데이트하기

`'next/navigation'`에서 `useSearchParams` 훅을 가져와 변수에 할당하세요:

`/app/ui/search.tsx`

```typescript
'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams } from 'next/navigation';

export default function Search() {
  const searchParams = useSearchParams();

  function handleSearch(term: string) {
    console.log(term);
  }
  // ...
}
```

`handleSearch` 내에서 `searchParams`를 사용하여 새 [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) 인스턴스를 만드세요.

`/app/ui/search.tsx`

```typescript
'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams } from 'next/navigation';

export default function Search() {
  const searchParams = useSearchParams();

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
  }
  // ...
}
```

`URLSearchParams`는 URL 쿼리 매개변수를 조작하기 위한 유틸리티 메서드를 제공하는 Web API입니다. 복잡한 문자열 리터럴을 만드는 대신, 이를 사용하여 `?page=1&query=a`와 같은 매개변수 문자열을 얻을 수 있습니다.

이제 사용자의 입력에 따라 쿼리 문자열을 `set` 메서드를 사용하여 만들어보세요. 입력이 비어 있으면 `delete`할 것입니다:

`/app/ui/search.tsx`

```typescript
'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams } from 'next/navigation';

export default function Search() {
  const searchParams = useSearchParams();

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
  }
  // ...
}
```

이제 쿼리 문자열이 있습니다. `useRouter`와 `usePathname` 훅을 사용하여 URL을 업데이트할 수 있습니다.

`'next/navigation'`에서 `useRouter`와 `usePathname`을 가져와서 `handleSearch` 내에서 `useRouter()`의 `replace` 메서드를 사용하세요:

`/app/ui/search.tsx`

```typescript
'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }
}
```

여기에서 무슨 일이 일어나는지 살펴보겠습니다:

- `${pathname}`은 현재 경로입니다. 여러분의 경우 `"/dashboard/invoices"`입니다.
- 사용자가 검색 바에 입력하는 동안 `params.toString()`은 이 입력을 URL에 친화적인 형식으로 변환합니다.
- `replace(${pathname}?${params.toString()})`은 사용자의 검색 데이터로 URL을 업데이트합니다. 예를 들어 사용자가 "Lee"를 검색하면 `/dashboard/invoices?query=lee`와 같이 URL이 업데이트됩니다.
- Next.js의 클라이언트 측 탐색 덕분에 페이지를 다시 로드하지 않고 URL이 업데이트됩니다. (이에 대해 [페이지 간 탐색](https://nextjs.org/learn/dashboard-app/navigating-between-pages) 챕터에서 배웠습니다).

&nbsp;

### 3. URL과 입력을 동기화하기

URL과 입력 필드가 동기화되고 공유할 때 입력 필드가 채워지도록 `searchParams`에서 읽어 `defaultValue`를 입력에 전달할 수 있습니다:

`/app/ui/search.tsx`

```typescript
<input
  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
  placeholder={placeholder}
  onChange={(e) => {
    handleSearch(e.target.value);
  }}
  defaultValue={searchParams.get('query')?.toString()}
/>
```

> **`defaultValue` vs. `value` / 제어되는 vs. 제어되지 않는**
>
> 입력의 값을 관리하기 위해 상태를 사용한다면 `value` 속성을 사용하여 제어되는 컴포넌트로 만들 것입니다. 이는 React가 입력의 상태를 관리할 것을 의미합니다.
>
> 그러나 여기서는 상태를 사용하지 않으므로 `defaultValue`를 사용합니다. 이는 네이티브 입력이 자체 상태를 관리할 것입니다. 여기서는 상태 대신 검색 쿼리를 URL에 저장하기 때문에 이렇게 사용할 수 있습니다.

&nbsp;

### 4. 테이블 업데이트하기

마지막으로 검색 쿼리를 반영하기 위해 테이블 컴포넌트를 업데이트해야 합니다.

송장 페이지로 이동하세요.

페이지 컴포넌트는 [`searchParams`라는 prop을 받습니다](https://nextjs.org/docs/app/api-reference/file-conventions/page), 따라서 현재 URL 매개변수를 `<Table>` 컴포넌트로 전달할 수 있습니다.

`/app/dashboard/invoices/page.tsx`

```typescript
import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>송장</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="송장 검색..." />
        <CreateInvoice />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
```

`<Table>` 컴포넌트로 이동하면 `query`와 `currentPage` 두 prop이 `fetchFilteredInvoices()` 함수로 전달됩니다. 이 함수는 쿼리와 일치하는 송장을 반환합니다.

`/app/ui/invoices/table.tsx`

```typescript
// ...
export default async function InvoicesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const invoices = await fetchFilteredInvoices(query, currentPage);
  // ...
}
```

위의 변경 사항을 적용한 후 테스트해보세요. 검색어를 입력하면 URL이 업데이트되고 새 요청이 서버에 전송됩니다. 서버에서는 해당하는 송장만 반환됩니다.

> **언제 `useSearchParams()` 훅 vs. `searchParams` prop을 사용해야 할까요?**
>
> 두 가지 다른 방식으로 검색 매개변수를 추출했습니다. 어느 것을 사용할지는 클라이언트 또는 서버에서 작업하는지에 따라 달라집니다.
>
> - `<Search>`는 클라이언트 컴포넌트이므로 `useSearchParams()` 훅을 사용하여 클라이언트에서 매개변수에 액세스했습니다.
> - `<Table>`은 자체 데이터를 가져오는 서버 컴포넌트이므로 페이지에서 `searchParams` prop을 컴포넌트로 전달할 수 있습니다.
>
> 일반적으로 클라이언트에서 매개변수를 읽으려면 `useSearchParams()` 훅을 사용하는 것이 좋습니다. 이렇게 하면 다시 서버로 돌아갈 필요가 없습니다.

&nbsp;

### Best practice: 디바운싱

축하합니다! Next.js에서 검색 기능을 구현했습니다! 하지만 최적화할 수 있는 부분이 있습니다.

`handleSearch` 함수 안에 다음 `console.log`를 추가하세요:

`/app/ui/search.tsx`

```typescript
function handleSearch(term: string) {
  console.log(`검색 중... ${term}`);

  const params = new URLSearchParams(searchParams);
  if (term) {
    params.set('query', term);
  } else {
    params.delete('query');
  }
  replace(`${pathname}?${params.toString()}`);
}
```

그런 다음 검색 바에 "Emil"을 입력하고 개발 도구 콘솔을 확인해보세요. 무슨 일이 일어나고 있나요?

`개발 도구 콘솔`

```bash
Searching... E
Searching... Em
Searching... Emi
Searching... Emil
```

매 입력마다 URL이 업데이트되고, 따라서 매 입력마다 데이터베이스를 쿼리하고 있습니다! 우리 애플리케이션은 작아서 문제가 되지 않지만, 수천 명의 사용자가 매 입력마다 데이터베이스에 새 요청을 보낸다고 상상해보세요.

**Debouncing**은 함수가 발생하는 속도를 제한하는 프로그래밍 관행입니다. 우리의 경우 사용자가 타이핑을 멈춘 후에만 데이터베이스를 쿼리하길 원합니다.

> **Debouncing이 작동하는 방법:**
>
> 1. **이벤트 발생**: 디바운스해야 하는 이벤트(예: 검색 상자에서의 타이핑)가 발생하면 타이머가 시작됩니다.
> 2. **대기**: 타이머가 만료되기 전에 새 이벤트가 발생하면 타이머가 재설정됩니다.
> 3. **실행**: 타이머가 카운트다운을 마치면 디바운스된 함수가 실행됩니다.

디바운싱은 여러 가지 방법으로 구현할 수 있습니다. 직접 디바운스 함수를 만들거나 [`use-debounce`](https://www.npmjs.com/package/use-debounce)라는 라이브러리를 사용할 수 있습니다.

`use-debounce`를 설치하세요:

`터미널`

```bash
npm i use-debounce
```

`<Search>` 컴포넌트에서 `useDebouncedCallback`이라는 함수를 가져와서 사용하세요:

`/app/ui/search.tsx`

```typescript
// ...
import { useDebouncedCallback } from 'use-debounce';

// Search 컴포넌트 내에서...
const handleSearch = useDebouncedCallback((term) => {
  console.log(`검색 중... ${term}`);

  const params = new URLSearchParams(searchParams);
  if (term) {
    params.set('query', term);
  } else {
    params.delete('query');
  }
  replace(`${pathname}?${params.toString()}`);
}, 300);
```

이 함수는 `handleSearch` 내용을 감싸고 사용자가 타이핑을 멈춘 후에만 코드를 실행합니다(300ms 후).

다시 검색 바에 입력하고 개발 도구 콘솔을 확인해보세요. 다음과 같은 내용이 표시됩니다:

`개발 도구 콘솔`

```bash
검색 중... Emil
```

디바운싱을 통해 데이터베이스로 전송되는 요청 수를 줄일 수 있어서 리소스를 절약할 수 있습니다.

&nbsp;

> ### 퀴즈 시간입니다!
>
> 지금까지 배운 내용을 테스트해보세요.
>
> **검색 기능에서 디바운싱이 해결하는 문제는 무엇인가요?**
>
> - A: 데이터베이스 쿼리 속도를 높입니다.
> - B: URL 북마크 기능을 추가합니다.
> - C: 매 입력마다 데이터베이스 쿼리를 방지합니다.
> - D: SEO 최적화에 도움이 됩니다.
>
> &nbsp;
>
> #### 정답 확인
>
> **C: 매 입력마다 데이터베이스 쿼리를 방지합니다.**
>
> 맞았습니다! 디바운싱은 키를 누를 때마다 새로운 데이터베이스 쿼리를 방지하여 리소스를 절약합니다.

&nbsp;

## 페이지네이션 추가

검색 기능을 도입한 후에는 테이블이 한 번에 6개의 송장만 표시되는 것을 알 수 있습니다. 이는 `data.ts`의 `fetchFilteredInvoices()` 함수가 한 페이지당 최대 6개의 송장을 반환하기 때문입니다.

페이지네이션을 추가하면 사용자가 다른 페이지를 탐색하여 모든 송장을 볼 수 있습니다. 검색과 마찬가지로 URL 매개변수를 사용하여 페이지네이션을 구현하는 방법을 살펴보겠습니다.

`<Pagination/>` 컴포넌트로 이동하면 클라이언트 컴포넌트임을 알 수 있습니다. 데이터베이스 비밀 키를 노출시킬 수 있기 때문에 데이터를 클라이언트에서 가져오지 않아야 합니다.(기억하세요, API 레이어를 사용하지 않고 있습니다). 대신, 서버에서 데이터를 가져와 컴포넌트에 prop으로 전달할 수 있습니다.

`/dashboard/invoices/page.tsx`에서 `fetchInvoicesPages`라는 새 함수를 가져와 `searchParams`에서 `query`를 인수로 전달하세요.

`/app/dashboard/invoices/page.tsx`

```typescript
// ...
import { fetchInvoicesPages } from '@/app/lib/data';

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string,
    page?: string,
  },
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const totalPages = await fetchInvoicesPages(query);

  return (
    // ...
  );
}
```

`fetchInvoicesPages`는 검색 쿼리를 기반으로 한 페이지의 총 개수를 반환합니다. 예를 들어, 검색 쿼리와 일치하는 12개의 송장이 있고 각 페이지에 6개의 송장이 표시된다면 총 페이지 수는 2가 됩니다.

다음으로 `<Pagination/>` 컴포넌트에 `totalPages` prop을 전달하세요.

`/app/dashboard/invoices/page.tsx`

```typescript
// ...

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const totalPages = await fetchInvoicesPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
```

`<Pagination/>` 컴포넌트로 이동하고 `usePathname` 및 `useSearchParams` 훅을 가져옵니다. 현재 페이지를 가져와 새 페이지를 설정하는 데 사용할 것입니다. 또한 이 컴포넌트의 코드를 주석 해제해야 합니다. 아직 `<Pagination/>` 로직을 구현하지 않았기 때문에 일시적으로 애플리케이션이 중단될 수 있습니다. 이제 그 부분을 해결해 봅시다!

`/app/ui/invoices/pagination.tsx`

```typescript
'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { generatePagination } from '@/app/lib/utils';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  // ...
}
```

그 다음, `<Pagination>` 컴포넌트 내부에 `createPageURL`이라는 새 함수를 만듭니다. 검색과 유사하게 `URLSearchParams`를 사용하여 새 페이지 번호를 설정하고 `pathName`을 사용하여 URL 문자열을 생성할 것입니다.

`/app/ui/invoices/pagination.tsx`

```typescript
'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { generatePagination } from '@/app/lib/utils';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  // ...
}
```

여기에서 무슨 일이 일어나는지 살펴보겠습니다:

- `createPageURL`은 현재 검색 매개변수의 인스턴스를 만듭니다.
- 그런 다음 "page" 매개변수를 제공된 페이지 번호로 업데이트합니다.
- 마지막으로 경로 이름과 업데이트된 검색 매개변수를 사용하여 전체 URL을 생성합니다.

나머지 `<Pagination>` 컴포넌트는 스타일링과 다양한 상태 (첫 번째, 마지막, 활성, 비활성 등)를 다룹니다. 이 강의에서는 자세히 다루지 않겠지만, 코드를 살펴보고 `createPageURL`이 어디에서 호출되는지 확인해보세요.

마지막으로 사용자가 새로운 검색 쿼리를 입력할 때 페이지 번호를 1로 재설정하고 싶습니다. `<Search>` 컴포넌트의 `handleSearch` 함수를 업데이트하여 이를 수행할 수 있습니다.

`/app/ui/search.tsx`

```typescript
'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);
```

&nbsp;

## 요약

축하합니다! URL 매개변수와 Next.js API를 사용하여 검색 및 페이지네이션을 구현했습니다.

이 장에서는 다음과 같은 내용을 다루었습니다:

- 클라이언트 상태 대신 URL 검색 매개변수를 사용하여 검색 및 페이지네이션을 처리했습니다.
- 서버에서 데이터를 가져왔습니다.
- 더 부드러운 클라이언트 측 전환을 위해 `useRouter` 라우터 훅을 사용했습니다.

이러한 패턴은 클라이언트 측 React 작업 시 사용하는 것과는 다르지만, URL 검색 매개변수를 사용하고 이 상태를 서버로 옮기는 장점을 더 잘 이해할 수 있게 되었을 것입니다.
