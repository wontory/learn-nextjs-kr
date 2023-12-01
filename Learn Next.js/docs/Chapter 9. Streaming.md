# Chapter 9. Streaming

Chapter 9

## 스트리밍

이전 장에서는 대시보드 페이지를 동적으로 만들었지만, 느린 데이터 가져오기가 애플리케이션의 성능에 어떤 영향을 미칠 수 있는지에 대해 논의했습니다. 느린 데이터 요청이 있을 때 사용자 경험을 어떻게 개선할 수 있는지 살펴봅시다.

&#x20;

> #### 이번 장에서는...
>
> 다음과 같은 내용을 다룰 예정입니다.
>
> * 스트리밍이 무엇이며 언제 사용하는지
> * `loading.tsx`와 Suspense를 사용한 스트리밍 구현 방법
> * 로딩 스켈레톤은 무엇인가
> * 라우트 그룹은 무엇이며 언제 사용하는지
> * 애플리케이션에서 Suspense 경계를 배치하는 위치

&#x20;

***

&#x20;

### 스트리밍이란?

스트리밍은 라우트를 더 작은 "조각"으로 분해하고 준비되는 대로 서버에서 클라이언트로 점진적으로 스트리밍하는 데이터 전송 기술입니다.

![시간에 따른 순차적 데이터 가져오기 및 병렬 데이터 가져오기를 보여주는 다이어그램](https://nextjs.org/\_next/image?url=%2Flearn%2Flight%2Fserver-rendering-with-streaming.png\&w=3840\&q=75\&dpl=dpl\_HLrzm1iszLgPFzNAQ3hHHL5Lhsu3)

스트리밍을 통해 느린 데이터 요청이 전체 페이지를 막는 것을 방지할 수 있습니다. 이를 통해 사용자는 모든 UI가 표시되기 전에 페이지의 일부를 볼 수 있고 상호 작용할 수 있습니다.

![시간에 따른 순차적 데이터 가져오기 및 병렬 데이터 가져오기를 보여주는 다이어그램](https://nextjs.org/\_next/image?url=%2Flearn%2Flight%2Fserver-rendering-with-streaming-chart.png\&w=3840\&q=75\&dpl=dpl\_HLrzm1iszLgPFzNAQ3hHHL5Lhsu3)

스트리밍은 React의 컴포넌트 모델과 잘 작동합니다. 각 컴포넌트를 \*조각(chunk)\*으로 생각할 수 있기 때문입니다.

Next.js에서 스트리밍을 구현하는 두 가지 방법이 있습니다:

1. 페이지 수준에서 `loading.tsx` 파일을 사용하는 방법.
2. 특정 컴포넌트에서 `<Suspense>`를 사용하는 방법.

어떻게 작동하는지 살펴봅시다.

&#x20;

> #### 퀴즈 타임!
>
> 지금까지 배운 내용을 테스트해보세요.
>
> **스트리밍의 장점 중 하나는 무엇인가요?**
>
> * A: 청크 암호화를 통해 데이터 요청이 보안이 강화됩니다.
> * B: 모든 청크는 완전히 받은 후에만 렌더링됩니다.
> * C: 청크가 병렬로 렌더링되어 전체 로드 시간이 줄어듭니다.
>
> &#x20;
>
> **정답 확인**
>
> **C: 청크가 병렬로 렌더링되어 전체 로드 시간이 줄어듭니다.**
>
> 이 방식의 장점 중 하나는 페이지의 전체 로드 시간을 크게 줄일 수 있다는 점입니다.

&#x20;

***

&#x20;

### `loading.tsx`를 사용하여 전체 페이지 스트리밍하기

`/app/dashboard` 폴더에서 `loading.tsx`라는 새 파일을 만듭니다:

`/app/dashboard/loading.tsx`

```typescript
export default function Loading() {
  return <div>Loading...</div>;
}
```

[http://localhost:3000/dashboard](http://localhost:3000/dashboard)을 새로 고치면 다음과 같이 표시됩니다:

!['Loading...’ 텍스트가 있는 대시보드 페이지](https://nextjs.org/\_next/image?url=%2Flearn%2Flight%2Floading-page.png\&w=1920\&q=75\&dpl=dpl\_HLrzm1iszLgPFzNAQ3hHHL5Lhsu3)

여기에서 몇 가지 일이 벌어지고 있습니다:

1. `loading.tsx`는 Suspense를 기반으로 한 특수한 Next.js 파일로, 페이지 콘텐츠가 로드될 때 대체로 보여줄 수 있는 폴백 UI를 만들 수 있게 해줍니다.
2. `<Sidebar>`가 정적이므로 즉시 표시됩니다. 사용자는 동적 콘텐츠가 로드되는 동안 `<Sidebar>`와 상호 작용할 수 있습니다.
3. 사용자는 페이지가 완전히 로드되기를 기다릴 필요가 없으므로 (이를 '중단 가능한 네비게이션'이라고 합니다) 페이지를 나가기 위해 기다릴 필요가 없습니다.

축하합니다! 스트리밍을 구현했습니다. 그러나 사용자 경험을 개선하기 위해 더 할 수 있는 일이 있습니다. `Loading...` 텍스트 대신 로딩 스켈레톤을 표시해보겠습니다.

&#x20;

#### 로딩 스켈레톤 추가

로딩 스켈레톤은 UI의 간소화된 버전입니다.

많은 웹사이트에서 로딩 중임을 사용자에게 알리는 플레이스홀더(또는 폴백)로 사용됩니다. `loading.tsx`에 삽입하는 모든 UI는 정적 파일의 일부로 삽입되어 먼저 전송됩니다. 그런 다음 나머지 동적 콘텐츠가 서버에서 클라이언트로 스트리밍됩니다.

`loading.tsx` 파일 내에서 `<DashboardSkeleton>` 컴포넌트를 가져와보세요:

`/app/dashboard/loading.tsx`

```typescript
import DashboardSkeleton from '@/app/ui/skeletons';

export default function Loading() {
  return <DashboardSkeleton />;
}
```

그런 다음 [http://localhost:3000/dashboard](http://localhost:3000/dashboard)을 새로 고치면 다음과 같이 표시됩니다:

![로딩 스켈레톤이 있는 대시보드 페이지](https://nextjs.org/\_next/image?url=%2Flearn%2Flight%2Floading-page-with-skeleton.png\&w=1920\&q=75\&dpl=dpl\_HLrzm1iszLgPFzNAQ3hHHL5Lhsu3)

&#x20;

#### 라우트 그룹을 사용하여 로딩 스켈레톤 버그 수정

현재 로딩 스켈레톤은 송장 및 고객 페이지에도 적용될 것입니다.

`loading.tsx`가 파일 시스템에서 `/invoices/page.tsx` 및 `/customers/page.tsx`보다 상위 수준이므로 이 페이지에도 적용될 것입니다.

이 문제를 [라우트 그룹](https://nextjs.org/docs/app/building-your-application/routing/route-groups)을 사용하여 수정할 수 있습니다. `/(overview)`라는 새 폴더를 `dashboard` 폴더 내에 만든 후 `loading.tsx` 및 `page.tsx` 파일을 해당 폴더로 이동하세요:

![괄호를 사용하여 라우트 그룹을 만드는 폴더 구조](https://nextjs.org/\_next/image?url=%2Flearn%2Flight%2Froute-group.png\&w=3840\&q=75\&dpl=dpl\_HLrzm1iszLgPFzNAQ3hHHL5Lhsu3)

이제 `loading.tsx` 파일은 대시보드 개요 페이지에만 적용됩니다.

라우트 그룹을 사용하면 URL 경로 구조에 영향을 주지 않고 파일을 논리적 그룹으로 구성할 수 있습니다. 괄호 `()`를 사용하여 새 폴더를 생성하면 해당 이름이 URL 경로에 포함되지 않습니다. 따라서 `/dashboard/(overview)/page.tsx`는 `/dashboard`로 변합니다.

여기서 라우트 그룹을 사용하여 `loading.tsx`가 대시보드 개요 페이지에만 적용되도록합니다. 그러나 라우트 그룹은 애플리케이션을 `(마케팅)` 라우트 및 `(쇼핑)` 라우트와 같은 섹션으로 또는 더 큰 애플리케이션에는 팀별로 분리하기 위해서도 사용할 수 있습니다.

&#x20;

#### 컴포넌트 스트리밍

지금까지 전체 페이지를 스트리밍하고 있었습니다. 하지만 React Suspense를 사용하여 더 세분화된 방식으로 특정 컴포넌트를 스트리밍할 수 있습니다.

Suspense를 사용하면 조건(예: 데이터가 로드될 때까지)에 따라 애플리케이션의 일부를 렌더링을 지연시킬 수 있습니다. 동적 컴포넌트를 Suspense로 감쌀 수 있습니다. 그 후, 동적 컴포넌트가 로드되는 동안 보여줄 대체 컴포넌트를 전달할 수 있습니다.

느린 데이터 요청을 기억한다면, `fetchRevenue()`라는 요청이 전체 페이지를 느리게 만드는 것입니다. 페이지를 차단하는 대신에 Suspense를 사용하여 이 컴포넌트만 스트리밍하고 페이지의 나머지 UI를 즉시 표시할 수 있습니다.

그렇게 하려면 데이터를 가져오는 함수를 컴포넌트로 이동해야 합니다. 코드를 업데이트해볼까요?

`/dashboard/(overview)/page.tsx`에서 `fetchRevenue()` 및 해당 데이터를 모두 삭제해주세요:

```typescript
import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { fetchLatestInvoices, fetchCardData } from '@/app/lib/data'; // fetchRevenue 삭제

export default async function Page() {
  const revenue = await fetchRevenue // 이 줄 삭제
  const latestInvoices = await fetchLatestInvoices();
  const {
    numberOfInvoices,
    numberOfCustomers,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData();

  return (
    // ...
  );
}
```

그 후, React에서 `<Suspense>`를 import하고 `<RevenueChart />` 주위에 래핑하세요. `<RevenueChartSkeleton>`이라는 대체 컴포넌트를 전달할 수 있습니다.

```typescript
import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { fetchLatestInvoices, fetchCardData } from '@/app/lib/data';
import { Suspense } from 'react';
import { RevenueChartSkeleton } from '@/app/ui/skeletons';

export default async function Page() {
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
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <LatestInvoices latestInvoices={latestInvoices} />
      </div>
    </main>
  );
}
```

마지막으로, `<RevenueChart>` 컴포넌트를 업데이트하여 자체 데이터를 가져오도록하고 전달된 prop을 제거하세요:

```typescript
import { generateYAxis } from '@/app/lib/utils';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchRevenue } from '@/app/lib/data';

// ...

export default async function RevenueChart() { // 컴포넌트를 async로 변경하고 props를 제거하세요
  const revenue = await fetchRevenue(); // 컴포넌트 내에서 데이터 가져오기

  const chartHeight = 350;
  const { yAxisLabels, topLabel } = generateYAxis(revenue);

  if (!revenue || revenue.length === 0) {
    return <p className="mt-4 text-gray-400">데이터 없음.</p>;
  }

  return (
    // ...
  );
}
```

이제 페이지를 새로 고침하면 거의 즉시 대시보드 정보를 볼 수 있지만, `<RevenueChart>`에는 대체 스켈레톤이 표시될 것입니다.

&#x20;

#### 실습: `<LatestInvoices>` 스트리밍

이제 여러분 차례입니다! 방금 배운 내용을 바탕으로 `<LatestInvoices>` 컴포넌트를 스트리밍해 보세요.

`fetchLatestInvoices()`를 페이지에서 `<LatestInvoices>` 컴포넌트로 이동하세요. `<Suspense>` 경계 내에 폴백 컴포넌트로 `<LatestInvoicesSkeleton>`이라는 대체 스켈레톤을 넣어주세요.

준비가 되면 토글을 확장하여 솔루션 코드를 볼 수 있습니다:

&#x20;

<details>

<summary> <strong>솔루션 보기</strong></summary>

대시보드 페이지:

`/app/dashboard/(overview)/page.tsx`

```typescript
import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardData } from '@/app/lib/data'; // fetchLatestInvoices 삭제
import { Suspense } from 'react';
import {
  RevenueChartSkeleton,
  LatestInvoicesSkeleton,
} from '@/app/ui/skeletons

';

export default async function Page() {
  // `const latestInvoices = await fetchLatestInvoices()` 삭제
  const {
    numberOfInvoices,
    numberOfCustomers,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData();

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        대시보드
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
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div>
    </main>
  );
}
```

`<LatestInvoices>` 컴포넌트. 반드시 props를 삭제하세요!:

`/app/ui/dashboard/latest-invoices.tsx`

```typescript
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
import { fetchLatestInvoices } from '@/app/lib/data';

export default async function LatestInvoices() { // props 삭제
  const latestInvoices = await fetchLatestInvoices();

  return (
    // ...
  );
}
```

</details>

&#x20;

***

&#x20;

### 컴포넌트 그룹화

좋습니다! 거의 다 왔습니다. 이제 `<Card>` 컴포넌트를 Suspense로 감싸야 합니다. 각각의 카드에 대한 데이터를 가져올 수 있지만, 이렇게 하면 카드가 로드될 때 UI가 _깜빡_거릴 수 있습니다.

그렇다면 이 문제를 어떻게 해결할 수 있을까요?

stagger 효과를 위해 wrapper 컴포넌트로 카드들을 그룹화할 수 있습니다. 이렇게 하면`<Sidebar/>`와 같은 정적 컴포넌트가 먼저 표시되고 카드 등이 나중에 로드됩니다.

`page.tsx` 파일에서:

* `<Card>` 컴포넌트를 삭제하세요.
* `fetchCardData()` 함수를 삭제하세요.
* 새로운 **wrapper** 컴포넌트인 `<CardWrapper />`를 import하세요.
* 새로운 **스켈레톤** 컴포넌트인 `<CardsSkeleton />`을 import하세요.
* `<CardWrapper />`를 Suspense로 감싸세요.

`/app/dashboard/page.tsx`

```typescript
import CardWrapper from '@/app/ui/dashboard/cards';
// ...
import {
  RevenueChartSkeleton,
  LatestInvoicesSkeleton,
  CardsSkeleton,
} from '@/app/ui/skeletons';

export default async function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      // ...
    </main>
  );
}
```

그런 다음 `/app/ui/dashboard/cards.tsx` 파일로 이동하여 `fetchCardData()` 함수를 import하고 `<CardWrapper/>` 컴포넌트 내에서 이를 호출하세요. 이 컴포넌트에서 필요한 코드를 주석 해제하는 것을 잊지 마세요.

`/app/ui/dashboard/cards.tsx`

```typescript
// ...
import { fetchCardData } from '@/app/lib/data';

// ...

export default async function CardWrapper() {
  const {
    numberOfInvoices,
    numberOfCustomers,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData();

  return (
    <>
      <Card title="Collected" value={totalPaidInvoices} type="collected" />
      <Card title="Pending" value={totalPendingInvoices} type="pending" />
      <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
      <Card
        title="Total Customers"
        value={numberOfCustomers}
        type="customers"
      />
    </>
  );
}
```

페이지를 새로 고치면 모든 카드가 동시에 로드된 것을 볼 수 있어요. 여러 컴포넌트가 동시에 로드되길 원할 때 이 패턴을 사용할 수 있어요.

&#x20;

***

&#x20;

### 어디에 Suspense 경계를 배치할지 결정하기

Suspense 경계를 어디에 두느냐는 몇 가지 요소에 따라 달라질 것입니다:

1. 사용자가 스트리밍하는 동안 페이지를 사용할 수 있길 원하는 방식.
2. 우선순위를 두고 싶은 컨텐츠.
3. 컴포넌트가 데이터 가져오기에 의존하는지 여부.

대시보드 페이지를 살펴보세요. 다르게 한 부분이 있나요?

걱정하지 마세요. 정답은 없습니다.

* `loading.tsx`처럼 **전체 페이지**를 스트리밍할 수 있지만, 하나의 컴포넌트가 느린 데이터를 가져와서 로딩 시간이 길어질 수 있습니다.
* **모든 컴포넌트**를 개별적으로 스트리밍할 수 있지만, 컴포넌트가 준비되어 화면에 나타날 때 _깜빡이는 효과_가 발생할 수 있습니다.
* **페이지 섹션**들을 스트리밍함으로써 stagger 효과도 만들 수 있습니다. 하지만 이를 위해서는 래퍼 컴포넌트를 만들어야 합니다.

Suspense 경계를 어디에 두느냐는 애플리케이션에 따라 다를 것입니다. 일반적으로 필요로하는 컴포넌트 내로 데이터 가져오기를 이동시키고, 해당 컴포넌트를 Suspense로 감싸는 것이 좋은 방법입니다. 그러나 애플리케이션이 필요로 한다면, 섹션 또는 전체 페이지를 스트리밍하는 것 또한 문제가 없습니다.

Suspense를 실험해보고 어떤 방식이 최선인지 확인해보세요. 이것은 사용자 경험을 더 향상시킬 수 있는 강력한 API입니다.

&#x20;

> #### 퀴즈 시간입니다!
>
> 지금까지 배운 것을 테스트해보세요.
>
> **Suspense와 데이터 가져오기를 다룰 때 일반적으로 좋은 실천 방법은 무엇인가요?**
>
> * A: 데이터 가져오기를 상위 컴포넌트로 이동시키기
> * B: 데이터 가져오기에는 Suspense를 사용하지 않기
> * C: 데이터 가져오기를 필요한 컴포넌트로 이동시키기
> * D: 에러 경계를 위해 Suspense만 사용하기
>
> &#x20;
>
> **정답 확인**
>
> **C: 데이터 가져오기를 필요한 컴포넌트로 이동시키기**
>
> 데이터 가져오기를 필요한 컴포넌트로 이동시킴으로써 보다 세분화된 Suspense 경계를 생성할 수 있어요. 이를 통해 특정 컴포넌트를 스트리밍하고 UI 차단을 방지할 수 있어요.

&#x20;

***

&#x20;

### 앞으로의 계획

스트리밍과 서버 컴포넌트는 데이터 가져오기와 로딩 상태를 처리하는 새로운 방식을 제공하며, 궁극적으로 최종 사용자 경험을 향상시키는 것을 목표로 합니다.

다음 장에서는 스트리밍을 고려한 새로운 Next.js 렌더링 모델인 부분적 사전 렌더링에 대해 배우게 될 것입니다.
