Chapter 8

# 정적 렌더링과 동적 렌더링

이전 장에서는 대시보드 개요 페이지에 대한 데이터를 가져왔습니다. 그러나 현재 설정의 두 가지 한계에 대해 간단히 논의했습니다:

1. 데이터 요청이 의도치 않은 워터폴을 생성하고 있습니다.
2. 대시보드는 정적이므로 데이터 업데이트는 애플리케이션에 반영되지 않습니다.

&nbsp;

> ### 이번 장에서는...
>
> 다음과 같은 내용을 다룰 예정입니다.
>
> - 정적 렌더링이란 무엇이며 애플리케이션 성능을 어떻게 향상시키는지
> - 동적 렌더링이란 무엇이고 언제 사용하는지
> - 대시보드를 동적으로 만들기 위한 다양한 방법
> - 느린 데이터 가져오기를 시뮬레이션하여 결과 확인하기

&nbsp;

### 정적 렌더링이란 무엇인가요?

정적 렌더링에서는, (배포할 때) 서버에서 빌드되는 시간 동안 또는 [재검증](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#revalidating-data) 중에 데이터 가져오기와 렌더링이 발생합니다. 그 결과물은 [컨텐츠 전송 네트워크(CDN)](https://nextjs.org/docs/app/building-your-application/rendering/server-components#static-rendering-default)에 분배되고 캐시될 수 있습니다.

![사용자가 페이지를 요청할 때 서버 대신 CDN에 접속하는 방법을 보여주는 다이어그램](https://nextjs.org/_next/image?url=%2Flearn%2Flight%2Fstatic-site-generation.png&w=3840&q=75&dpl=dpl_5zZfXC4CJ1Yn3Xex9jSRLvh6MCPF)

사용자가 애플리케이션에 방문할 때마다 캐시된 결과가 제공됩니다. 정적 렌더링의 장점은 다음과 같습니다:

- **빠른 웹사이트** - 사전 렌더링된 콘텐츠는 캐시되고 전역적으로 분배됩니다. 이는 전 세계 사용자가 웹사이트 콘텐츠에 빠르게 액세스할 수 있도록 보장합니다.
- **서버 부하 감소** - 콘텐츠가 캐시되기 때문에 서버는 각 사용자 요청에 동적으로 콘텐츠를 생성할 필요가 없습니다.
- **검색 엔진 최적화(SEO)** - 사전 렌더링된 콘텐츠는 페이지 로드 시 이미 사용 가능하기 때문에 검색 엔진 크롤러가 쉽게 색인화할 수 있습니다. 이는 검색 엔진 순위 향상으로 이어질 수 있습니다.

정적 렌더링은 **데이터가 없는 경우** 또는 **사용자 간에 공유되는 데이터**에 유용합니다. 예를 들어, 정적 블로그 글이나 제품 페이지와 같은 경우에 적합합니다. 그러나 주기적으로 업데이트되는 개인화된 데이터가 있는 대시보드에는 적합하지 않을 수 있습니다.

정적 렌더링의 반대는 동적 렌더링입니다.

&nbsp;

> ### 퀴즈를 풀어보세요!
>
> 지금까지 배운 내용을 테스트해보세요.
>
> **대시보드 앱에 정적 렌더링이 적합하지 않은 이유는 무엇일까요?**
>
> - A: 웹사이트를 느리게 만들기 때문에
> - B: 서버 부하가 증가할 것이기 때문에
> - C: 애플리케이션에 최신 데이터 변경 사항이 반영되지 않을 것이기 때문에
> - D: 컨텐츠 전송 네트워크가 필요하기 때문에
>
> &nbsp;
>
> #### 정답 확인
>
> **C: 애플리케이션에 최신 데이터 변경 사항이 반영되지 않을 것이기 때문에**
>
> 데이터가 업데이트되면 대시보드에 최신 변경 사항을 보여주고 싶어요. 정적 렌더링은 이러한 경우에 적합하지 않습니다.

&nbsp;

---

&nbsp;

## 동적 렌더링이란 무엇인가요?

동적 렌더링에서는 컨텐츠가 **요청 시간(사용자가 페이지를 방문할 때)**에 서버에서 렌더링됩니다. 동적 렌더링의 장점은 다음과 같습니다:

- **실시간 데이터** - 동적 렌더링을 통해 애플리케이션이 실시간으로 또는 자주 업데이트되는 데이터를 표시할 수 있습니다. 데이터가 자주 변경되는 애플리케이션에 이상적입니다.
- **사용자별 콘텐츠** - 대시보드나 사용자 프로필과 같은 개인화된 콘텐츠를 제공하고 사용자 상호작용에 따라 데이터를 업데이트하는 것이 더 쉽습니다.
- **요청 시간 정보** - 동적 렌더링을 사용하면 요청 시간에만 알 수 있는 정보에 액세스할 수 있습니다. 예를 들어, 쿠키나 URL 검색 매개변수 등입니다.

&nbsp;

> ### 퀴즈를 풀어보세요!
>
> 지금까지 배운 내용을 테스트해보세요.
>
> **요청 시간에만 알 수 있는 정보는 무엇일까요?**
>
> - A: 데이터베이스 스키마
> - B: URL 경로
> - C: 쿠키 및 URL 검색 매개변수
>
> &nbsp;
>
> #### 정답 확인
>
> **C: 쿠키 및 URL 검색 매개변수**
>
> 쿠키와 URL 검색 매개변수는 요청 시간에만 알 수 있는 정보입니다.

&nbsp;

---

&nbsp;

## 대시보드를 동적으로 만들기

기본적으로 `@vercel/postgres`는 자체 캐싱 시맨틱스를 설정하지 않습니다. 이는 프레임워크가 자체적으로 정적 및 동적 동작을 설정할 수 있게 합니다.

서버 컴포넌트 또는 데이터 가져오기 함수 내에서 `unstable_noStore`라는 Next.js API를 사용하여 정적 렌더링을 사용하지 않도록 설정할 수 있습니다. 이를 추가해봅시다.

`data.ts`에서 `next/cache`에서 `unstable_noStore`를 가져오고 데이터 가져오기 함수의 최상단에 호출합니다.

`/app/lib/data.ts`

```typescript
// ...
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchRevenue() {
  // 응답이 캐시되지 않도록 여기에 noStore()를 추가합니다.
  // 이는 fetch(..., {cache: 'no-store'})와 동등합니다.
  noStore();

  // ...
}

export async function fetchLatestInvoices() {
  noStore();
  // ...
}

export async function fetchCardData() {
  noStore();
  // ...
}

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number
) {
  noStore();
  // ...
}

export async function fetchInvoicesPages(query: string) {
  noStore();
  // ...
}

export async function fetchFilteredCustomers(query: string) {
  noStore();
  // ...
}

export async function fetchInvoiceById(query: string) {
  noStore();
  // ...
}
```

> **참고:** `unstable_noStore`는 실험적인 API이며 나중에 변경될 수 있습니다. 본인의 프로젝트에서 안정적인 API를 사용하려면 [세그먼트 구성 옵션](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config)인 `export const dynamic = "force-dynamic"`을 사용할 수도 있습니다.

&nbsp;

---

&nbsp;

## 느린 데이터 가져오기 시뮬레이션

대시보드를 동적으로 만드는 것은 좋은 첫 걸음입니다. 그러나 이전 장에서 언급한 문제점이 하나 있습니다. 모든 다른 요청보다 한 데이터 요청이 더 느린 경우 어떻게 될까요?

느린 데이터 가져오기를 시뮬레이션해보겠습니다. `data.ts` 파일에서 `fetchRevenue()` 내의 `console.log`와 `setTimeout`을 주석 해제해보세요.

`/app/lib/data.ts`

```typescript
export async function fetchRevenue() {
  try {
    // 데모 목적으로 응답을 인위적으로 지연시킵니다.
    // 실제 제품에서는 이렇게 하지 마세요 :)
    console.log('수익 데이터 가져오는 중...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue>`SELECT * FROM revenue`;

    console.log('데이터 가져오기 완료 - 3초 후');

    return data.rows;
  } catch (error) {
    console.error('데이터베이스 오류:', error);
    throw new Error('수익 데이터를 가져오지 못했습니다.');
  }
}
```

이제 새 탭에서 [http://localhost:3000/dashboard/](http://localhost:3000/dashboard/)를 열고 페이지 로드에 더 오랜 시간이 걸리는 것을 확인하세요. 터미널에서도 다음과 같은 메시지를 볼 수 있어야 합니다:

```bash
Fetching revenue data...
Data fetch completed after 3 seconds.
```

여기서는 인위적으로 3초 지연을 추가하여 느린 데이터 가져오기를 시뮬레이션했습니다. 결과적으로 데이터를 가져오는 동안 전체 페이지가 차단됩니다.

이렇게 동적 렌더링을 사용할 때 **가장 느린 데이터 가져오기에 따라 애플리케이션의 속도가 결정된다**는 개발자들이 해결해야 할 공통적인 도전 과제에 도달했습니다.
