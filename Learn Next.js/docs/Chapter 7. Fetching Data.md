Chapter 7

# 데이터 가져오기

지금까지 데이터베이스를 생성하고 시드(seed)로 초기화했습니다. 애플리케이션에서 데이터를 가져오는 다양한 방법과 대시보드 개요 페이지를 구축하는 방법에 대해 알아봅시다.

&nbsp;

> ### 이번 장에서는...
>
> 다음과 같은 주제들을 다룰 예정입니다.
>
> - 데이터를 가져오는 몇 가지 접근 방법 알아보기: API, ORM, SQL 등
> - 서버 컴포넌트가 백엔드 리소스에 안전하게 접근하는 데 어떻게 도움이 되는지
> - 네트워크 워터폴이란 무엇인지
> - JavaScript 패턴을 사용하여 병렬 데이터 가져오기를 구현하는 방법

&nbsp;

---

&nbsp;

## 데이터를 가져오는 방법 선택하기

### API 레이어

API는 애플리케이션 코드와 데이터베이스 사이의 중간 레이어입니다. API를 사용하는 몇 가지 경우는 다음과 같습니다:

- API를 제공하는 타사 서비스를 사용하는 경우
- 클라이언트에서 데이터를 가져오는 경우, 데이터베이스 비밀 키를 노출하지 않기 위해 서버에서 작동하는 API 레이어를 가져야 합니다.

Next.js에서는 [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)를 사용하여 API 엔드포인트를 생성할 수 있습니다.

&nbsp;

### 데이터베이스 쿼리

풀스택 애플리케이션을 만들 때는 데이터베이스와 상호작용하는 로직을 작성해야 합니다. Postgres와 같은 [관계형 데이터베이스](https://aws.amazon.com/relational-database/)의 경우 SQL 또는 [Prisma](https://www.prisma.io/)와 같은 [ORM](https://vercel.com/docs/storage/vercel-postgres/using-an-orm#)을 사용할 수 있습니다.

데이터베이스 쿼리를 작성해야 하는 몇 가지 경우는 다음과 같습니다:

- API 엔드포인트를 생성하는 경우, 데이터베이스와 상호작용하는 로직을 작성해야 합니다.
- React 서버 컴포넌트를 사용하는 경우(서버에서 데이터를 가져오는 경우), 클라이언트에게 데이터베이스 비밀 키를 노출하지 않고 API 레이어 없이 데이터베이스 쿼리를 직접 작성할 수 있습니다.

&nbsp;

> ### 퀴즈를 풀어보세요!
>
> 지금까지 배운 내용을 테스트해보세요.
>
> **다음 상황 중 데이터베이스를 직접 쿼리하면 안 되는 경우는 어떤 것일까요?**
>
> - A: 클라이언트에서 데이터를 가져오는 경우
> - B: 서버에서 데이터를 가져오는 경우
> - C: 데이터베이스와 상호작용하기 위해 자체 API 레이어를 생성하는 경우
>
> &nbsp;
>
> #### 정답 확인
>
> **A: 클라이언트에서 데이터를 가져오는 경우**
>
> 맞습니다. 클라이언트에서 데이터를 가져올 때는 데이터베이스를 직접 쿼리해서는 안 됩니다. 이렇게 하면 데이터베이스 비밀 키가 노출될 수 있습니다.

&nbsp;

React 서버 컴포넌트에 대해 더 알아보겠습니다.

&nbsp;

### 데이터를 가져오기 위해 서버 컴포넌트 사용하기

기본적으로 Next.js 애플리케이션은 **React 서버 컴포넌트**를 사용합니다. 서버 컴포넌트로 데이터를 가져오는 것은 비교적 새로운 방법이며, 이를 사용하는 몇 가지 이점이 있습니다:

- 서버 컴포넌트는 프로미스를 지원하여 데이터 가져오기와 같은 비동기 작업을 간단하게 처리할 수 있습니다. `useEffect`, `useState` 또는 데이터를 가져오는 라이브러리를 사용하지 않고도 `async/await` 구문을 사용할 수 있습니다.
- 서버 컴포넌트는 서버에서 실행되므로 비용이 많이 드는 데이터 가져오기와 로직을 서버에 유지하고 결과만 클라이언트에 전송할 수 있습니다.
- 앞에서 언급했듯이 서버 컴포넌트는 서버에서 실행되므로 API 레이어를 추가로 사용하지 않고도 데이터베이스를 직접 쿼리할 수 있습니다.

&nbsp;

> ### 퀴즈를 풀어보세요!
>
> 지금까지 배운 내용을 테스트해보세요.
>
> **React 서버 컴포넌트를 사용하여 데이터를 가져오는 데 한 가지 장점은 무엇일까요?**
>
> - A: SQL 인젝션으로부터 자동으로 보호됩니다.
> - B: 추가적인 API 레이어 없이 서버에서 데이터베이스를 직접 쿼리할 수 있습니다.
> - C: API 레이어를 사용하고 엔드포인트를 생성해야 합니다.
>
> &nbsp;
>
> #### 정답 확인
>
> **B: 추가적인 API 레이어 없이 서버에서 데이터베이스를 직접 쿼리할 수 있습니다.**
>
> 서버 컴포넌트를 사용하면 데이터베이스를 직접적으로 가져올 수 있습니다.

&nbsp;

### SQL 사용하기

대시보드 프로젝트에서는 [Vercel Postgres SDK](https://vercel.com/docs/storage/vercel-postgres/sdk)와 SQL을 사용하여 데이터베이스 쿼리를 작성할 것입니다. SQL을 사용하는 몇 가지 이유는 다음과 같습니다:

- SQL은 관계형 데이터베이스 쿼리에 대한 산업 표준입니다 (예: ORM은 내부적으로 SQL을 생성합니다).
- SQL을 기본적으로 이해하면 관계형 데이터베이스의 기본 원리를 이해하는 데 도움이 되어 다른 도구에도 지식을 적용할 수 있습니다.
- SQL은 특정 데이터를 가져오고 조작하는 데 유용합니다.
- Vercel Postgres SDK는 [SQL 인젝션](https://vercel.com/docs/storage/vercel-postgres/sdk#preventing-sql-injections)을 방지하는 보호 기능을 제공합니다.

SQL을 사용해본 적이 없어도 걱정하지 마세요. 쿼리를 이미 작성해놨습니다.

`/app/lib/data.ts`로 이동해보세요. 여기에서 `@vercel/postgres`에서 [`sql`](https://vercel.com/docs/storage/vercel-postgres/sdk#sql) 함수를 가져오는 것을 볼 수 있습니다.

```typescript
import { sql } from '@vercel/postgres';

// ...
```

어떤 서버 컴포넌트에서든 `sql`을 호출할 수 있습니다. 하지만 컴포넌트를 더 쉽게 탐색할 수 있도록 모든 데이터 쿼리를 `data.ts` 파일에 유지하고 해당 컴포넌트로 가져올 수 있도록 했습니다.

&nbsp;

> ### 퀴즈를 풀어보세요!
>
> 지금까지 배운 내용을 테스트해보세요.
>
> **SQL을 사용하여 데이터를 가져오는 데 무엇이 가능한가요?**
>
> - A: 일괄적으로 모든 데이터를 가져올 수 있습니다.
> - B: 특정 데이터를 가져오고 조작할 수 있습니다.
> - C: 성능을 개선하기 위해 자동으로 캐시할 수 있습니다.
> - D: 데이터베이스 스키마를 동적으로 변경할 수 있습니다.
>
> &nbsp;
>
> #### 정답 확인
>
> **B: 특정 데이터를 가져오고 조작할 수 있습니다.**
>
> SQL을 사용하면 특정 데이터를 가져오고 조작하기 위해 명확한 쿼리를 작성할 수 있습니다.

&nbsp;

> **참고**: Chapter 6에서 자체 데이터베이스를 사용했다면 데이터베이스에 맞게 쿼리를 업데이트해야 합니다. `/app/lib/data.ts`에서 쿼리를 찾을 수 있습니다.

&nbsp;

---

&nbsp;

## 대시보드 개요 페이지용 데이터 가져오기

지금까지 데이터를 가져오는 여러 방법에 대해 이해했습니다. 이제 대시보드 개요 페이지용 데이터를 가져와보겠습니다. `/app/dashboard/page.tsx`로 이동하고 아래 코드를 붙여넣고 살펴보세요.

`/app/dashboard/page.tsx`

```typescript
import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';

export default async function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        대시보드
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* <Card title="Collected" value={totalPaidInvoices} type="collected" /> */}
        {/* <Card title="Pending" value={totalPendingInvoices} type="pending" /> */}
        {/* <Card title="Total Invoices" value={numberOfInvoices} type="invoices" /> */}
        {/* <Card
          title="Total Customers"
          value={numberOfCustomers}
          type="customers"
        /> */}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/* <RevenueChart revenue={revenue}  /> */}
        {/* <LatestInvoices latestInvoices={latestInvoices} /> */}
      </div>
    </main>
  );
}
```

위 코드에서:

- Page는 **async** 컴포넌트입니다. `await`를 사용하여 데이터를 가져올 수 있습니다.
- 데이터를 받는 3개의 컴포넌트가 있습니다: `<Card>`, `<RevenueChart>`, `<LatestInvoices>`. 현재 애플리케이션이 오류를 일으키지 않도록 주석 처리되어 있습니다.

&nbsp;

---

&nbsp;

## `<RevenueChart/>`를 위한 데이터 가져오기

`<RevenueChart/>` 컴포넌트에 데이터를 가져오려면 `data.ts`에서 `fetchRevenue` 함수를 가져와 컴포넌트 내에서 호출하세요.

`/app/dashboard/page.tsx`

```typescript
import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { fetchRevenue } from '@/app/lib/data';

export default async function Page() {
  const revenue = await fetchRevenue();
  // ...
}
```

그런 다음 `<RevenueChart/>` 컴포넌트 주석을 해제하고 컴포넌트 파일(`'/app/ui/dashboard/revenue-chart.tsx'`)로 이동하여 내부 코드를 주석 해제하세요. 로컬호스트를 확인하면 `revenue` 데이터를 사용하는 차트를 볼 수 있어야 합니다.

![최근 12개월간 총 수익을 보여주는 수익 차트](https://nextjs.org/_next/image?url=%2Flearn%2Flight%2Frecent-revenue.png&w=1920&q=75&dpl=dpl_ChYDa5hHagUGaZ7CBzNRRwGyEoGj)

계속해서 더 많은 데이터 쿼리를 가져와 봅시다!

&nbsp;

---

&nbsp;

## `<LatestInvoices/>` 데이터 가져오기

`<LatestInvoices />` 컴포넌트의 경우, 가장 최근 5개의 송장을 날짜순으로 가져와야 합니다.

자바스크립트를 사용하여 모든 송장을 가져와 정렬할 수 있습니다. 지금은 데이터가 작기 때문에 문제는 되지 않지만, 애플리케이션이 커지면 각 요청마다 전송되는 데이터 양과 처리하는 데 필요한 자바스크립트가 크게 증가할 수 있습니다.

최신 송장을 메모리에서 정렬하는 대신 SQL 쿼리를 사용하여 마지막 5개의 송장만 가져올 수 있습니다. 예를 들어, `data.ts` 파일의 SQL 쿼리는 다음과 같습니다:

`/app/lib/data.ts`

```typescript
// 날짜순으로 최신 5개의 송장 가져오기
const data = await sql<LatestInvoiceRaw>`
  SELECT invoices.amount, customers.name, customers.image_url, customers.email
  FROM invoices
  JOIN customers ON invoices.customer_id = customers.id
  ORDER BY invoices.date DESC
  LIMIT 5`;
```

페이지에서 `fetchLatestInvoices` 함수를 가져오세요:

`/app/dashboard/page.tsx`

```typescript
import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { fetchRevenue, fetchLatestInvoices } from '@/app/lib/data';

export default async function Page() {
  const revenue = await fetchRevenue();
  const latestInvoices = await fetchLatestInvoices();
  // ...
}
```

그런 다음, `<LatestInvoices />` 컴포넌트의 관련 코드를 주석 해제합니다. 또한 `/app/ui/dashboard/latest-invoices`에서 `<LatestInvoices />` 컴포넌트의 관련 코드도 주석 해제해야 합니다.

로컬호스트에 방문하면 데이터베이스에서 마지막 5개만 반환되는 것을 확인할 수 있습니다. 여러분은 데이터베이스 쿼리를 직접 작성하는 것의 장점을 보고 있습니다!

![수익 차트와 함께 최신 송장 컴포넌트](https://nextjs.org/_next/image?url=%2Flearn%2Flight%2Flatest-invoices.png&w=1920&q=75&dpl=dpl_ChYDa5hHagUGaZ7CBzNRRwGyEoGj)

&nbsp;

---

&nbsp;

## 연습: `<Card>` 컴포넌트용 데이터 가져오기

이제 `<Card>` 컴포넌트용 데이터를 가져올 차례입니다. 카드에는 다음 데이터가 표시됩니다:

- 수집된 송장 총액.
- 대기 중인 송장 총액.
- 총 송장 수.
- 총 고객 수.

다시 말씀드리면, 모든 송장과 고객을 가져와 데이터를 조작할 수 있겠지만, SQL을 사용하여 필요한 데이터만 가져올 수 있습니다. 예를 들면, `Array.length`를 사용하여 총 송장 수와 고객 수를 가져올 수 있습니다.

```typescript
const totalInvoices = allInvoices.length;
const totalCustomers = allCustomers.length;
```

하지만, SQL을 사용하면 오로지 우리가 원하는 데이터만을 가져올 수 있습니다. `Array.length`를 사용하는 것 보다 조금 길긴 하지만, 이것은 요청에 전송할 데이터가 적다는 것을 의미합니다. SQL 대안을 살펴봅시다:

`/app/lib/data.ts`

```typescript
const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
```

가져와야 하는 함수는 `fetchCardData`입니다. 함수에서 반환된 값을 구조분해할 필요가 있습니다.

> **힌트:**
>
> - 카드 컴포넌트에서 필요한 데이터를 확인하세요.
> - 함수가 무엇을 반환하는지 `data.ts` 파일을 확인하세요.

준비가 되셨으면, 아래 토글을 펼쳐서 최종 코드를 확인하세요:

&nbsp;

<details>
<summary><strong>&nbsp;솔루션 보기</strong></summary>

`/app/dashboard/page.tsx`

```typescript
import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import {
  fetchRevenue,
  fetchLatestInvoices,
  fetchCardData,
} from '@/app/lib/data';

export default async function Page() {
  const revenue = await fetchRevenue();
  const latestInvoices = await fetchLatestInvoices();
  const {
    numberOfInvoices,
    numberOfCustomers,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData();

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Collected" value={totalPaidInvoices} type="collected" />
        <Card title="Pending" value={totalPendingInvoices} type="pending" />
        <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
        <Card
          title="Total Customers"
          value={numberOfCustomers}
          type="customers"
        />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <RevenueChart revenue={revenue} />
        <LatestInvoices latestInvoices={latestInvoices} />
      </div>
    </main>
  );
}
```

</details>

&nbsp;

좋습니다! 이제 대시보드 개요 페이지에 필요한 모든 데이터를 가져왔습니다. 페이지는 다음과 같이 보여야 합니다:

![대시보드 페이지 - 모든 데이터 가져오기](https://nextjs.org/_next/image?url=%2Flearn%2Flight%2Fcomplete-dashboard.png&w=1920&q=75&dpl=dpl_ChYDa5hHagUGaZ7CBzNRRwGyEoGj)

하지만... 주의해야 할 두 가지가 있습니다:

1. 데이터 요청이 의도치 않게 서로를 막고 있어서, **요청 워터폴**이 만들어졌습니다.
2. 기본적으로 Next.js는 라우트를 **사전 렌더링**하여 성능을 향상시키는데, 이를 **정적 렌더링**이라고 합니다. 데이터가 변경되면 대시보드에 반영되지 않을 수 있습니다.

이번 장에서 1번을 설명하고, 다음 장에서 2번을 자세히 살펴보겠습니다.

&nbsp;

---

&nbsp;

## 요청 워터폴이란?

"워터폴"이란 이전 요청의 완료에 따라 종속되는 일련의 네트워크 요청을 말합니다. 데이터 가져오기의 경우, 각 요청은 이전 요청이 데이터를 반환할 때까지 시작할 수 없습니다.

![시간을 나타내는 다이어그램에서 순차적 데이터 가져오기 및 병렬 데이터 가져오기](https://nextjs.org/_next/image?url=%2Flearn%2Flight%2Fsequential-parallel-data-fetching.png&w=3840&q=75&dpl=dpl_ChYDa5hHagUGaZ7CBzNRRwGyEoGj)

예를 들어, `fetchLatestInvoices()`가 실행되기 위해서는 `fetchRevenue()`가 실행될 때까지 기다려야 합니다.

`/app/dashboard/page.tsx`

```typescript
const revenue = await fetchRevenue();
const latestInvoices = await fetchLatestInvoices(); // fetchRevenue() 완료될 때까지 기다림
const {
  numberOfInvoices,
  numberOfCustomers,
  totalPaidInvoices,
  totalPendingInvoices,
} = await fetchCardData(); // fetchLatestInvoices() 완료될 때까지 기다림
```

이 패턴은 반드시 나쁜 것은 아닙니다. 다음 요청 이전에 조건을 충족해야 한다면 워터폴이 필요할 수 있습니다. 예를 들어, 사용자 ID와 프로필 정보를 먼저 가져오고 나서 친구 목록을 가져오고 싶을 수 있습니다. 이 경우 각 요청은 이전 요청에서 반환된 데이터에 의존합니다.

하지만 이 동작은 또한 의도하지 않게 발생할 수도 있고 성능에 영향을 줄 수 있습니다.

&nbsp;

> ### 퀴즈를 풀어보세요!
>
> 지금까지 배운 내용을 테스트해보세요.
>
> **어떤 경우에 워터폴 패턴을 사용하고 싶을까요?**
>
> - A: 다음 요청을 하기 전에 조건을 충족시키기 위해
> - B: 모든 요청을 동시에 수행하기 위해
> - C: 서버 부하를 줄이기 위해 한 번에 하나씩 요청을 처리하기 위해
>
> &nbsp;
>
> #### 정답 확인
>
> **A: 다음 요청을 하기 전에 조건을 충족시키기 위해**
>
> 예를 들어, 사용자 ID와 프로필 정보를 가져오고 나서 친구 목록을 가져오고 싶을 수 있습니다.

&nbsp;

---

&nbsp;

## 병렬 데이터 가져오기

워터폴을 피하는 일반적인 방법은 모든 데이터 요청을 동시에 시작하는 것입니다 - 병렬로.

자바스크립트에서는 [`Promise.all()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) 또는 [`Promise.allSettled()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled) 함수를 사용하여 모든 프로미스를 동시에 시작할 수 있습니다. 예를 들어, `data.ts`에서 `fetchCardData()` 함수에서는 `Promise.all()`을 사용하고 있습니다:

`/app/lib/data.js`

```typescript
export async function fetchCardData() {
  try {
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);
    // ...
  }
}
```

이 패턴을 사용하면 다음과 같은 것들이 가능합니다:

- 모든 데이터 가져오기를 동시에 시작하여 성능 향상을 이끌 수 있습니다.
- 모든 라이브러리나 프레임워크에 적용할 수 있는 네이티브 자바스크립트 패턴을 사용할 수 있습니다.

그러나 이 자바스크립트 패턴에만 의존하는 경우 한 가지 단점이 있습니다: 어떤 데이터 요청이 다른 모든 요청보다 느릴 때는 어떻게 될까요?
